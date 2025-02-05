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
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('admin', 'pastor', 'secretary', 'leader', 'member');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

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

-- Função auxiliar para verificar se o usuário é admin
CREATE OR REPLACE FUNCTION is_admin(user_uid uuid)
RETURNS boolean AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM profiles 
        WHERE user_id = user_uid 
        AND role = 'admin'
    );
END;
$$ language 'plpgsql' SECURITY DEFINER;

-- Função para atualizar o timestamp
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    IF (TG_OP = 'UPDATE') THEN
        NEW.updated_at = CURRENT_TIMESTAMP;
    END IF;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Criar o trigger para updated_at
DROP TRIGGER IF EXISTS set_updated_at ON profiles;
CREATE TRIGGER set_updated_at
    BEFORE UPDATE ON profiles
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

-- Políticas de RLS

-- Admins podem ver todos os perfis
CREATE POLICY "Admins podem ver todos os perfis"
ON profiles FOR SELECT
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM profiles 
        WHERE user_id = auth.uid() 
        AND role = 'admin'
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
    EXISTS (
        SELECT 1 FROM profiles 
        WHERE user_id = auth.uid() 
        AND role = 'admin'
    )
);

-- Admins podem atualizar qualquer perfil
CREATE POLICY "Admins podem atualizar perfis"
ON profiles FOR UPDATE
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM profiles 
        WHERE user_id = auth.uid() 
        AND role = 'admin'
    )
);

-- Usuários podem atualizar seu próprio perfil (exceto o role)
CREATE POLICY "Usuários podem atualizar dados básicos"
ON profiles FOR UPDATE
TO authenticated
USING (
    auth.uid() = user_id
)
WITH CHECK (
    auth.uid() = user_id AND
    EXISTS (
        SELECT 1 FROM profiles 
        WHERE user_id = auth.uid() 
        AND role = CAST(current_setting('row.role') AS user_role)
    )
);