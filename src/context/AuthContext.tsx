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

  // Inicializa a sessão ao carregar o app usando Supabase Auth ou fallback de demonstração
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        if (typeof window !== 'undefined' && localStorage.getItem('ingrid_bossa_demo_auth') === 'true') {
          setUser(DEFAULT_USER);
          setIsLoading(false);
          return;
        }

        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          setUser({
            ...DEFAULT_USER,
            email: session.user.email || DEFAULT_USER.email,
          });
        }
      } catch (e) {
        console.warn('Supabase Auth não conectado, operando em modo demonstrativo:', e);
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
      } else if (typeof window !== 'undefined' && localStorage.getItem('ingrid_bossa_demo_auth') === 'true') {
        setUser(DEFAULT_USER);
      } else {
        setUser(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Login com fallback de demonstração imediata para a corretora e testes
  const login = async (email: string, pass: string): Promise<{ success: boolean; message?: string }> => {
    const cleanEmail = email.trim().toLowerCase();
    const isDemoEmail =
      cleanEmail === 'ingrid@ingridbossa.com.br' ||
      cleanEmail === 'admin@ingridbossa.com.br' ||
      cleanEmail === 'ingridbossa' ||
      cleanEmail === 'admin';
    const isDemoPass = pass === '123456' || pass === 'admin123' || pass === 'ingrid2026';

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password: pass,
      });

      if (!error && data?.session?.user) {
        return { success: true };
      }

      if (isDemoEmail && isDemoPass) {
        setUser({
          ...DEFAULT_USER,
          email: cleanEmail.includes('@') ? cleanEmail : DEFAULT_USER.email,
        });
        if (typeof window !== 'undefined') {
          localStorage.setItem('ingrid_bossa_demo_auth', 'true');
        }
        return { success: true };
      }

      return { success: false, message: error?.message || 'E-mail ou senha incorretos. (Dica de teste: ingrid@ingridbossa.com.br / 123456)' };
    } catch (err: any) {
      if (isDemoEmail && isDemoPass) {
        setUser({
          ...DEFAULT_USER,
          email: cleanEmail.includes('@') ? cleanEmail : DEFAULT_USER.email,
        });
        if (typeof window !== 'undefined') {
          localStorage.setItem('ingrid_bossa_demo_auth', 'true');
        }
        return { success: true };
      }
      return { success: false, message: 'E-mail ou senha incorretos. (Dica de teste: ingrid@ingridbossa.com.br / 123456)' };
    }
  };

  // Logout
  const logout = async () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('ingrid_bossa_demo_auth');
    }
    try {
      await supabase.auth.signOut();
    } catch {
      // ignore
    }
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
        // Se estiver em modo demo, confirma a troca local
        if (typeof window !== 'undefined' && localStorage.getItem('ingrid_bossa_demo_auth') === 'true') {
          return { success: true, message: 'Senha atualizada com sucesso no ambiente de teste!' };
        }
        return { success: false, message: error.message };
      }

      return { success: true, message: 'Senha atualizada com sucesso no banco de dados!' };
    } catch (err: any) {
      if (typeof window !== 'undefined' && localStorage.getItem('ingrid_bossa_demo_auth') === 'true') {
        return { success: true, message: 'Senha atualizada com sucesso no ambiente de teste!' };
      }
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
