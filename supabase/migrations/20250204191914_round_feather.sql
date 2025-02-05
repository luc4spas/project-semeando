/*
  # Sistema de Autenticação e Perfis

  1. Novas Tabelas
    - `profiles` (perfis de usuário)
      - `id` (uuid, chave primária)
      - `user_id` (uuid, referência ao auth.users)
      - `role` (enum dos tipos de usuário)
      - `full_name` (nome completo)
      - `created_at` (data de criação)
      - `updated_at` (data de atualização)

  2. Segurança
    - RLS habilitado na tabela profiles
    - Políticas para leitura e atualização baseadas em roles
*/

-- Criar enum para roles
CREATE TYPE user_role AS ENUM ('admin', 'pastor', 'secretary', 'leader', 'member');

-- Criar tabela de perfis
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  role user_role NOT NULL DEFAULT 'member',
  full_name text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id)
);

-- Habilitar RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Trigger para atualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE PROCEDURE update_updated_at_column();

-- Políticas de RLS

-- Admins podem ver todos os perfis
CREATE POLICY "Admins podem ver todos os perfis"
ON profiles FOR SELECT
TO authenticated
USING (
  auth.uid() IN (
    SELECT user_id FROM profiles WHERE role = 'admin'
  )
);

-- Usuários podem ver seu próprio perfil
CREATE POLICY "Usuários podem ver seu próprio perfil"
ON profiles FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Admins podem criar perfis
CREATE POLICY "Admins podem criar perfis"
ON profiles FOR INSERT
TO authenticated
WITH CHECK (
  auth.uid() IN (
    SELECT user_id FROM profiles WHERE role = 'admin'
  )
);

-- Admins podem atualizar qualquer perfil
CREATE POLICY "Admins podem atualizar perfis"
ON profiles FOR UPDATE
TO authenticated
USING (
  auth.uid() IN (
    SELECT user_id FROM profiles WHERE role = 'admin'
  )
)
WITH CHECK (
  auth.uid() IN (
    SELECT user_id FROM profiles WHERE role = 'admin'
  )
);

-- Usuários podem atualizar seu próprio perfil (exceto o role)
CREATE POLICY "Usuários podem atualizar seu próprio perfil"
ON profiles FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (
  auth.uid() = user_id AND
  OLD.role = NEW.role -- Não permite alteração do role
);