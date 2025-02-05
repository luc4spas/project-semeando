import { User } from '@supabase/supabase-js';
import { supabase } from './supabase';

export type UserRole = 'admin' | 'pastor' | 'secretary' | 'leader' | 'member';

export interface Profile {
  id: string;
  user_id: string;
  role: UserRole;
  full_name: string;
  created_at: string;
  updated_at: string;
}

export async function getProfile(user: User): Promise<Profile | null> {
  try {
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Timeout ao buscar perfil')), 10000); // 10 segundos de timeout
    });

    const fetchProfile = supabase
      .from('profiles')
      .select('*')
      .eq('user_id', user.id)
      .single();

    const { data, error } = await Promise.race([fetchProfile, timeoutPromise]) as any;

    if (error) {
      console.error('Erro ao buscar perfil:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Erro ao buscar perfil:', error);
    return null;
  }
}

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;
  return data;
}

export async function signOut() {
  try {
    // Primeiro, limpar qualquer dado local
    localStorage.clear();
    
    // Fazer logout no Supabase
    const { error } = await supabase.auth.signOut({
      scope: 'global'  // Isso garante que todas as sessões sejam encerradas
    });
    
    if (error) {
      console.error('Erro ao fazer logout:', error);
      throw error;
    }

    // Forçar redirecionamento para a página inicial
    window.location.href = '/';
  } catch (error) {
    console.error('Erro ao fazer logout:', error);
    // Mesmo com erro, tentar limpar o estado
    localStorage.clear();
    window.location.href = '/';
    throw error;
  }
}

export async function isAdmin(userId: string): Promise<boolean> {
  const { data, error } = await supabase
    .from('profiles')
    .select('role')
    .eq('user_id', userId)
    .single();

  if (error || !data) return false;
  return data.role === 'admin';
}