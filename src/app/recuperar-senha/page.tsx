'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import {
  KeyRound,
  Mail,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Lock,
  ExternalLink,
  ShieldCheck,
  Send,
  Eye,
  EyeOff
} from 'lucide-react';

function RecuperarSenhaContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { requestPasswordReset, resetPasswordWithToken } = useAuth();

  const tokenParam = searchParams.get('token');

  const [email, setEmail] = useState('');
  const [generatedToken, setGeneratedToken] = useState<string | null>(tokenParam);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [isRequested, setIsRequested] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (tokenParam) {
      setGeneratedToken(tokenParam);
    }
  }, [tokenParam]);

  // Envio da solicitação de recuperação
  const handleRequestSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setIsLoading(true);

    try {
      const res = await requestPasswordReset(email);
      if (res.success && res.token) {
        setGeneratedToken(res.token);
        setIsRequested(true);
      } else {
        setErrorMessage(res.message || 'Erro ao solicitar recuperação.');
      }
    } catch (err) {
      setErrorMessage('Ocorreu um erro ao processar a solicitação.');
    } finally {
      setIsLoading(false);
    }
  };

  // Redefinição com o token
  const handleResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (newPassword !== confirmPassword) {
      setErrorMessage('As senhas digitadas não coincidem.');
      return;
    }

    if (newPassword.length < 6) {
      setErrorMessage('A nova senha deve possuir no mínimo 6 caracteres.');
      return;
    }

    if (!generatedToken) {
      setErrorMessage('Token de verificação inválido.');
      return;
    }

    setIsLoading(true);

    try {
      const res = await resetPasswordWithToken(generatedToken, newPassword);
      if (res.success) {
        setIsSuccess(true);
      } else {
        setErrorMessage(res.message || 'Erro ao redefinir a senha.');
      }
    } catch (err) {
      setErrorMessage('Ocorreu um erro ao redefinir a senha.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-gray-50 via-white to-gray-100">
      <div className="max-w-md w-full space-y-6">
        <div className="bg-white rounded-3xl shadow-2xl p-8 sm:p-10 border border-gray-200/80 relative overflow-hidden">
          {/* Barra superior dourada */}
          <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-[#1c1917] via-[#b87d5b] to-[#1c1917]" />

          {/* SUCESSO TOTAL */}
          {isSuccess ? (
            <div className="text-center py-4">
              <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-black text-gray-900 mb-2">Senha Atualizada!</h2>
              <p className="text-xs sm:text-sm text-gray-600 mb-8">
                Sua senha foi redefinida com sucesso. Você já pode acessar a área restrita do corretor com a nova senha.
              </p>
              <Link
                href="/login"
                className="w-full py-3.5 px-4 rounded-xl bg-[#1c1917] hover:bg-[#b87d5b] text-white font-black text-sm flex items-center justify-center gap-2 shadow-lg transition-all"
              >
                Ir para a Página de Login
              </Link>
            </div>
          ) : !isRequested && !tokenParam ? (
            /* PASSO 1: Solicitar Link de Recuperação */
            <div>
              <div className="text-center mb-8">
                <div className="w-16 h-16 rounded-2xl bg-[#1c1917]/10 text-[#1c1917] flex items-center justify-center mx-auto mb-4">
                  <KeyRound className="w-8 h-8 text-[#b87d5b]" />
                </div>
                <h1 className="text-2xl font-black text-[#1c1917] tracking-tight">
                  Recuperar Senha
                </h1>
                <p className="text-xs text-gray-500 mt-2">
                  Informe o seu e-mail cadastrado. Enviaremos um link de confirmação seguro para validação da troca de senha.
                </p>
              </div>

              {errorMessage && (
                <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-200 flex items-start gap-3 text-red-700 text-xs font-semibold">
                  <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-500 mt-0.5" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <form onSubmit={handleRequestSubmit} className="space-y-5">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                    E-mail do Corretor
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                      <Mail className="w-5 h-5" />
                    </div>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="ingrid@ingridbossa.com.br"
                      className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-300 text-sm focus:ring-2 focus:ring-[#1c1917] focus:outline-none"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3.5 px-4 rounded-xl bg-[#1c1917] hover:bg-[#b87d5b] text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg transition-all hover:scale-[1.01] disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  <span>Enviar Link de Confirmação</span>
                </button>
              </form>

              {/* Dica para teste */}
              <div className="mt-6 pt-4 border-t border-gray-100 text-center">
                <button
                  type="button"
                  onClick={() => setEmail('ingrid@ingridbossa.com.br')}
                  className="text-xs font-bold text-[#8e5433] hover:underline"
                >
                  Usar e-mail padrão de Ingrid Bossa
                </button>
              </div>
            </div>
          ) : (
            /* PASSO 2: Link Gerado / Formulário de Nova Senha */
            <div>
              {/* Notificação do E-mail Simulado */}
              <div className="mb-6 p-4 rounded-2xl bg-amber-50 border border-amber-200">
                <div className="flex items-center gap-2 text-amber-800 font-bold text-xs mb-1">
                  <Mail className="w-4 h-4 text-[#b87d5b]" />
                  <span>Confirmação de Segurança</span>
                </div>
                <p className="text-[11px] text-amber-900 leading-relaxed">
                  Link de confirmação gerado com sucesso para validação do corretor. Defina sua nova senha abaixo para concluir.
                </p>
              </div>

              <div className="text-center mb-6">
                <div className="w-14 h-14 rounded-2xl bg-[#1c1917] text-[#b87d5b] flex items-center justify-center mx-auto mb-3">
                  <Lock className="w-7 h-7" />
                </div>
                <h2 className="text-xl font-black text-[#1c1917]">Criar Nova Senha</h2>
                <p className="text-xs text-gray-500 mt-1">
                  Digite a nova senha para o seu acesso ao painel.
                </p>
              </div>

              {errorMessage && (
                <div className="mb-5 p-3.5 rounded-xl bg-red-50 border border-red-200 flex items-start gap-2.5 text-red-700 text-xs font-semibold">
                  <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-500 mt-0.5" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <form onSubmit={handleResetSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">
                    Nova Senha (mínimo 6 dígitos)
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Nova senha segura"
                      className="w-full px-4 py-2.5 pr-10 rounded-xl border border-gray-300 text-sm focus:ring-2 focus:ring-[#1c1917] focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">
                    Confirmar Nova Senha
                  </label>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repita a nova senha"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm focus:ring-2 focus:ring-[#1c1917] focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full mt-2 py-3.5 px-4 rounded-xl bg-[#1c1917] hover:bg-[#b87d5b] text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg transition-all"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Confirmar e Salvar Nova Senha</span>
                </button>
              </form>
            </div>
          )}

          {/* Link para voltar ao Login */}
          <div className="mt-6 pt-4 border-t border-gray-100 text-center">
            <Link
              href="/login"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-600 hover:text-[#1c1917] transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Voltar para o Login</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function RecuperarSenhaPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-[#1c1917]">Carregando...</div>}>
      <RecuperarSenhaContent />
    </Suspense>
  );
}
