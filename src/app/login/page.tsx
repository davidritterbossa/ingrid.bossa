'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import {
  Lock,
  Mail,
  Eye,
  EyeOff,
  ShieldCheck,
  ArrowRight,
  AlertCircle,
  KeyRound,
  Home
} from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { login, isAuthenticated } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Se já estiver logado, redireciona para o painel
  React.useEffect(() => {
    if (isAuthenticated) {
      router.push('/admin');
    }
  }, [isAuthenticated, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setIsLoading(true);

    try {
      const res = await login(email, password);
      if (res.success) {
        router.push('/admin');
      } else {
        setErrorMessage(res.message || 'Erro ao realizar login.');
      }
    } catch (err) {
      setErrorMessage('Ocorreu um erro inesperado. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-gray-50 via-white to-gray-100">
      <div className="max-w-md w-full space-y-8">
        
        {/* Card do Formulário */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 sm:p-10 border border-gray-200/80 relative overflow-hidden">
          {/* Decoração superior dourada */}
          <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-[#1c1917] via-[#b87d5b] to-[#1c1917]" />

          {/* Header do Card */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-[#1c1917] text-[#b87d5b] flex items-center justify-center mx-auto mb-4 shadow-lg border border-[#b87d5b]/30">
              <Lock className="w-8 h-8" />
            </div>

            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#b87d5b]/15 text-[#8e5433] text-xs font-black uppercase tracking-wider mb-2">
              <ShieldCheck className="w-3.5 h-3.5" />
              Área Restrita do Corretor
            </span>

            <h1 className="text-2xl sm:text-3xl font-black text-[#1c1917] tracking-tight">
              Acesso Ingrid Bossa
            </h1>
            <p className="text-xs text-gray-500 mt-1">
              Entre com suas credenciais para gerenciar imóveis, fotos e status.
            </p>
          </div>

          {/* Alerta de Erro */}
          {errorMessage && (
            <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-200 flex items-start gap-3 text-red-700 text-xs sm:text-sm animate-shake">
              <AlertCircle className="w-5 h-5 flex-shrink-0 text-red-500 mt-0.5" />
              <p className="font-semibold">{errorMessage}</p>
            </div>
          )}

          {/* Formulário */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Campo E-mail */}
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                E-mail ou Usuário
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <Mail className="w-5 h-5" />
                </div>
                <input
                  type="text"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="digite seu email"
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-300 text-sm focus:ring-2 focus:ring-[#1c1917] focus:border-transparent transition-all"
                />
              </div>
            </div>

            {/* Campo Senha */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Senha de Acesso
                </label>
                <Link
                  href="/recuperar-senha"
                  className="text-xs font-bold text-[#8e5433] hover:text-[#1c1917] transition-colors"
                >
                  Esqueci minha senha
                </Link>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <KeyRound className="w-5 h-5" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-11 pr-11 py-3 rounded-xl border border-gray-300 text-sm focus:ring-2 focus:ring-[#1c1917] focus:border-transparent transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                  title={showPassword ? 'Ocultar senha' : 'Exibir senha'}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Botão Entrar */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 px-4 rounded-xl bg-[#1c1917] hover:bg-[#b87d5b] text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-all hover:scale-[1.01] disabled:opacity-50"
            >
              {isLoading ? (
                <span>Verificando credenciais...</span>
              ) : (
                <>
                  <span>Entrar no Painel</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Voltar para Home */}
        <div className="text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-[#1c1917] transition-colors"
          >
            <Home className="w-4 h-4" />
            <span>Voltar para o site público</span>
          </Link>
        </div>

      </div>
    </div>
  );
}
