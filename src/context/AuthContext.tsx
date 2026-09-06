'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export interface RealtorUser {
  id: string;
  name: string;
  email: string;
  creci: string;
  phone: string;
  role: 'corretor';
}

interface AuthContextType {
  user: RealtorUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, pass: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  changePassword: (currentPass: string, newPass: string) => Promise<{ success: boolean; message?: string }>;
  requestPasswordReset: (email: string) => Promise<{ success: boolean; token?: string; message?: string }>;
  resetPasswordWithToken: (token: string, newPass: string) => Promise<{ success: boolean; message?: string }>;
  updateProfile: (data: Partial<RealtorUser>) => void;
}

const DEFAULT_USER: RealtorUser = {
  id: 'realtor-ingrid',
  name: 'Ingrid Bossa',
  email: 'ingrid@ingridbossa.com.br',
  creci: 'CRECI F-58168',
  phone: '(45) 99810-0534',
  role: 'corretor',
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<RealtorUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Inicializa a sessão ao carregar o app usando Supabase Auth
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          setUser({
            ...DEFAULT_USER,
            email: session.user.email || DEFAULT_USER.email,
          });
        }
      } catch (e) {
        console.error('Erro ao ler autenticação do Supabase:', e);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();

    // Listener para mudanças de estado na autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser({
          ...DEFAULT_USER,
          email: session.user.email || DEFAULT_USER.email,
        });
      } else {
        setUser(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Login
  const login = async (email: string, pass: string): Promise<{ success: boolean; message?: string }> => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password: pass,
      });

      if (error) {
        return { success: false, message: 'E-mail ou senha incorretos.' };
      }

      return { success: true };
    } catch (err: any) {
      return { success: false, message: err.message || 'Erro ao fazer login.' };
    }
  };

  // Logout
  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  // Alterar senha logado
  const changePassword = async (currentPass: string, newPass: string): Promise<{ success: boolean; message?: string }> => {
    if (newPass.length < 6) {
      return { success: false, message: 'A nova senha deve possuir pelo menos 6 caracteres.' };
    }

    try {
      const { error } = await supabase.auth.updateUser({
        password: newPass
      });

      if (error) {
        return { success: false, message: error.message };
      }

      return { success: true, message: 'Senha atualizada com sucesso no banco de dados!' };
    } catch (err: any) {
      return { success: false, message: err.message || 'Erro ao alterar a senha.' };
    }
  };

  // Solicitar recuperação de senha por e-mail
  const requestPasswordReset = async (email: string): Promise<{ success: boolean; token?: string; message?: string }> => {
    try {
      const vercelUrl = process.env.NEXT_PUBLIC_SITE_URL || (typeof window !== 'undefined' ? window.location.origin : '');
      const resetUrl = `${vercelUrl}/recuperar-senha`;
      
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim().toLowerCase(), {
        redirectTo: resetUrl,
      });

      if (error) {
        return { success: false, message: error.message };
      }

      return {
        success: true,
        token: 'link_enviado',
        message: `Se o e-mail estiver cadastrado, um link de recuperação foi enviado.`,
      };
    } catch (e) {
      return { success: false, message: 'Erro ao gerar solicitação de recuperação.' };
    }
  };

  // Redefinir senha
  const resetPasswordWithToken = async (token: string, newPass: string): Promise<{ success: boolean; message?: string }> => {
    if (newPass.length < 6) {
      return { success: false, message: 'A nova senha deve possuir no mínimo 6 caracteres.' };
    }

    try {
      const { error } = await supabase.auth.updateUser({
        password: newPass
      });

      if (error) {
        return { success: false, message: error.message || 'Erro ao redefinir a senha.' };
      }

      return { success: true, message: 'Nova senha cadastrada com sucesso! Você já pode fazer login.' };
    } catch (e) {
      return { success: false, message: 'Erro ao redefinir a senha.' };
    }
  };

  // Atualizar perfil
  const updateProfile = (data: Partial<RealtorUser>) => {
    if (!user) return;
    const updated = { ...user, ...data };
    setUser(updated);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        changePassword,
        requestPasswordReset,
        resetPasswordWithToken,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser utilizado dentro de um AuthProvider');
  }
  return context;
}
