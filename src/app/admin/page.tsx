'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { Property, StatusImovel, STATUS_IMOVEL_CONFIG, CATEGORIAS } from '@/types/property';
import { getStoredProperties, deleteStoredProperty, updatePropertyStatus } from '@/lib/propertyStore';
import PropertyEditModal from '@/components/PropertyEditModal';
import {
  ShieldCheck,
  Building2,
  CheckCircle2,
  Clock,
  DollarSign,
  Plus,
  Search,
  Edit3,
  Trash2,
  ExternalLink,
  Eye,
  Lock,
  KeyRound,
  LogOut,
  Camera,
  Star,
  Settings,
  Layers,
  ArrowRight,
  AlertTriangle,
  RotateCcw,
  RefreshCw,
} from 'lucide-react';

export default function AdminDashboardPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading, logout, changePassword } = useAuth();

  const [properties, setProperties] = useState<Property[]>([]);
  const [isFetching, setIsFetching] = useState(false);
  const [fetchError, setFetchError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('todos');
  const [selectedPropertyForEdit, setSelectedPropertyForEdit] = useState<Property | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Estados da Aba de Troca de Senha / Configurações
  const [activeTab, setActiveTab] = useState<'imoveis' | 'seguranca'>('imoveis');
  const [currentPass, setCurrentPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmNewPass, setConfirmNewPass] = useState('');
  const [passSuccessMsg, setPassSuccessMsg] = useState('');
  const [passErrorMsg, setPassErrorMsg] = useState('');
  const [isChangingPass, setIsChangingPass] = useState(false);

  // Redireciona para /login se não estiver logado
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isLoading, isAuthenticated, router]);

  // Carrega imóveis do Supabase via API com fallback para o catálogo local
  const loadProperties = useCallback(async () => {
    setIsFetching(true);
    setFetchError('');
    try {
      const res = await fetch('/api/properties', { cache: 'no-store' });
      if (!res.ok) throw new Error(`Erro HTTP ${res.status}`);
      const json = await res.json();
      if (!json.success) throw new Error(json.error || 'Erro ao carregar imóveis');
      if (json.data && json.data.length > 0) {
        setProperties(json.data);
      } else {
        setProperties(getStoredProperties());
      }
    } catch (err: any) {
      console.warn('Erro ao carregar imóveis da API, usando catálogo local:', err);
      setProperties(getStoredProperties());
    } finally {
      setIsFetching(false);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      loadProperties();
    }
  }, [isAuthenticated, loadProperties]);

  if (isLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 text-[#1c1917] font-bold">
        Verificando credenciais de acesso...
      </div>
    );
  }

  // Estatísticas
  const totalImoveis = properties.length;
  const disponiveis = properties.filter((p) => p && p.status === 'disponivel').length;
  const negociacao = properties.filter((p) => p && p.status === 'negociacao').length;
  const vendidos = properties.filter((p) => p && p.status === 'vendido').length;
  const ocultos = properties.filter((p) => p && p.status === 'oculto').length;

  // Filtro local seguro (protegido contra nulls e números)
  const filteredProperties = properties.filter((p) => {
    if (!p) return false;
    const term = (searchTerm || '').trim().toLowerCase();
    const titulo = (p.titulo || '').toLowerCase();
    const bairro = (p.bairro || '').toLowerCase();
    const id = String(p.id || '').toLowerCase();

    const matchesSearch = !term || titulo.includes(term) || bairro.includes(term) || id.includes(term);
    const matchesStatus = statusFilter === 'todos' || p.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Ações de Imóveis — sincronizam store local e API
  const handleQuickStatusChange = async (id: string, newStatus: StatusImovel) => {
    // Atualização otimista na UI e no store local
    setProperties((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: newStatus } : p))
    );
    updatePropertyStatus(id, newStatus);
    try {
      const res = await fetch(`/api/properties/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) throw new Error('Falha ao atualizar status na API');
    } catch (err) {
      console.warn('Status atualizado localmente:', err);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Tem certeza que deseja excluir o imóvel "${title}"?`)) return;

    // Remove da UI e do store local imediatamente
    setProperties((prev) => prev.filter((p) => p.id !== id));
    deleteStoredProperty(id);
    try {
      const res = await fetch(`/api/properties/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Falha ao excluir imóvel na API');
    } catch (err) {
      console.warn('Imóvel excluído localmente:', err);
    }
  };

  // Abre o modal de criação com um imóvel vazio (o POST real acontece no modal ao salvar)
  const handleCreateNewProperty = () => {
    const emptyProperty: Property = {
      id: '',
      titulo: '',
      descricao: '',
      tipo: 'venda',
      categoria: 'casa',
      preco: 0,
      rua: '',
      bairro: 'Jardim La Salle',
      cidade: 'Toledo',
      estado: 'PR',
      quartos: 0,
      banheiros: 0,
      vagas: 0,
      areaTotal: null,
      areaUtil: null,
      imagens: [],
      comodidades: [],
      status: 'disponivel',
      destaque: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setSelectedPropertyForEdit(emptyProperty);
    setIsEditModalOpen(true);
  };

  // Após salvar no modal, recarrega a lista do banco
  const handleSaveProperty = async (updated: Property) => {
    setIsEditModalOpen(false);
    setSelectedPropertyForEdit(null);
    await loadProperties();
  };

  // Troca de Senha
  const handleChangePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPassSuccessMsg('');
    setPassErrorMsg('');

    if (newPass !== confirmNewPass) {
      setPassErrorMsg('A nova senha e a confirmação não coincidem.');
      return;
    }

    setIsChangingPass(true);
    try {
      const res = await changePassword(currentPass, newPass);
      if (res.success) {
        setPassSuccessMsg('Senha alterada com sucesso!');
        setCurrentPass('');
        setNewPass('');
        setConfirmNewPass('');
      } else {
        setPassErrorMsg(res.message || 'Erro ao alterar a senha.');
      }
    } catch (err) {
      setPassErrorMsg('Ocorreu um erro ao atualizar a senha.');
    } finally {
      setIsChangingPass(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/80 pt-28 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header Superior do Painel */}
        <div className="bg-gradient-to-r from-[#1c1917] via-[#141211] to-[#0a1120] rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden border border-[#b87d5b]/20">
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#b87d5b]/20 text-[#b87d5b] text-xs font-black uppercase tracking-wider mb-2">
              <ShieldCheck className="w-4 h-4" />
              Área Exclusiva do Corretor
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black">
              Painel de Controle • Ingrid Bossa
            </h1>
            <p className="text-gray-300 text-xs sm:text-sm mt-1">
              CRECI F-58168 • Gerencie seus imóveis, fotos, valores e status em tempo real.
            </p>
          </div>

          <div className="relative z-10 flex flex-wrap items-center gap-3">
            <button
              onClick={handleCreateNewProperty}
              className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-[#b87d5b] hover:bg-[#8e5433] text-white font-extrabold text-xs sm:text-sm shadow-lg transition-all hover:scale-105"
            >
              <Plus className="w-4 h-4" />
              <span>Cadastrar Novo Imóvel</span>
            </button>

            <button
              onClick={() => {
                logout();
                router.push('/');
              }}
              className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-white/10 hover:bg-red-600/80 text-white font-bold text-xs sm:text-sm transition-all"
              title="Encerrar sessão"
            >
              <LogOut className="w-4 h-4" />
              <span>Sair</span>
            </button>
          </div>
        </div>

        {/* Abas de Navegação */}
        <div className="flex items-center gap-2 border-b border-gray-200 pb-2">
          <button
            onClick={() => setActiveTab('imoveis')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all ${
              activeTab === 'imoveis'
                ? 'bg-[#1c1917] text-white shadow-md'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>Gerenciar Imóveis ({totalImoveis})</span>
          </button>

          <button
            onClick={() => setActiveTab('seguranca')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all ${
              activeTab === 'seguranca'
                ? 'bg-[#1c1917] text-white shadow-md'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <KeyRound className="w-4 h-4" />
            <span>Segurança &amp; Alterar Senha</span>
          </button>
        </div>

        {activeTab === 'imoveis' ? (
          <>
            {/* Cards de Métricas */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3.5 sm:gap-4">
              <div className="bg-white p-4 sm:p-5 rounded-2xl border border-gray-200/80 shadow-sm">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">Total</span>
                <p className="text-2xl sm:text-3xl font-black text-[#1c1917]">{totalImoveis}</p>
                <span className="text-[11px] text-gray-500 font-medium">Imóveis cadastrados</span>
              </div>

              <div className="bg-emerald-50/70 p-4 sm:p-5 rounded-2xl border border-emerald-200/80 shadow-sm">
                <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider block mb-1">Disponíveis</span>
                <p className="text-2xl sm:text-3xl font-black text-emerald-700">{disponiveis}</p>
                <span className="text-[11px] text-emerald-600 font-medium">Visíveis para venda</span>
              </div>

              <div className="bg-amber-50/70 p-4 sm:p-5 rounded-2xl border border-amber-200/80 shadow-sm">
                <span className="text-xs font-bold text-amber-700 uppercase tracking-wider block mb-1">Negociação</span>
                <p className="text-2xl sm:text-3xl font-black text-amber-700">{negociacao}</p>
                <span className="text-[11px] text-amber-600 font-medium">Proposta em análise</span>
              </div>

              <div className="bg-rose-50/70 p-4 sm:p-5 rounded-2xl border border-rose-200/80 shadow-sm">
                <span className="text-xs font-bold text-rose-700 uppercase tracking-wider block mb-1">Vendidos</span>
                <p className="text-2xl sm:text-3xl font-black text-rose-700">{vendidos}</p>
                <span className="text-[11px] text-rose-600 font-medium">Concluídos com sucesso</span>
              </div>

              <div className="bg-gray-100 p-4 sm:p-5 rounded-2xl border border-gray-300 shadow-sm">
                <span className="text-xs font-bold text-gray-600 uppercase tracking-wider block mb-1">Ocultos</span>
                <p className="text-2xl sm:text-3xl font-black text-gray-700">{ocultos}</p>
                <span className="text-[11px] text-gray-500 font-medium">Rascunhos privados</span>
              </div>
            </div>

            {/* Barra de Busca e Filtro de Status */}
            <div className="bg-white p-4 sm:p-5 rounded-2xl shadow-sm border border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Buscar por título ou bairro..."
                  className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-300 text-xs sm:text-sm focus:ring-2 focus:ring-[#1c1917] focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider whitespace-nowrap">Status:</span>
                {['todos', 'disponivel', 'negociacao', 'vendido', 'oculto'].map((st) => (
                  <button
                    key={st}
                    onClick={() => setStatusFilter(st)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all whitespace-nowrap ${
                      statusFilter === st
                        ? 'bg-[#1c1917] text-white shadow-sm'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {st === 'todos' ? 'Todos' : STATUS_IMOVEL_CONFIG[st as StatusImovel]?.label || st}
                  </button>
                ))}

                {/* Botão de Recarregar */}
                <button
                  onClick={loadProperties}
                  disabled={isFetching}
                  className="ml-2 p-2 rounded-xl bg-gray-100 hover:bg-[#1c1917] text-gray-600 hover:text-white transition-all disabled:opacity-50"
                  title="Recarregar imóveis"
                >
                  <RefreshCw className={`w-4 h-4 ${isFetching ? 'animate-spin' : ''}`} />
                </button>
              </div>
            </div>

            {/* Erro de carregamento */}
            {fetchError && (
              <div className="p-4 rounded-2xl bg-red-50 border border-red-200 flex items-center gap-3 text-red-700 text-xs font-bold">
                <AlertTriangle className="w-5 h-5 flex-shrink-0" />
                <span>{fetchError}</span>
                <button onClick={loadProperties} className="ml-auto underline">Tentar novamente</button>
              </div>
            )}

            {/* Lista / Cards de Imóveis */}
            <div className="space-y-4">
              {isFetching && properties.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-3xl border border-gray-200">
                  <p className="text-sm text-gray-500 font-medium">Carregando imóveis do banco de dados...</p>
                </div>
              ) : filteredProperties.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-3xl border border-gray-200">
                  <p className="text-base font-bold text-gray-700 mb-1">Nenhum imóvel corresponde aos filtros</p>
                  <p className="text-xs text-gray-500 mb-4">Tente limpar a busca ou cadastre um novo imóvel.</p>
                  <button
                    onClick={handleCreateNewProperty}
                    className="px-5 py-2.5 rounded-xl bg-[#1c1917] text-white text-xs font-bold hover:bg-[#b87d5b] transition-colors"
                  >
                    + Criar Novo Imóvel
                  </button>
                </div>
              ) : (
                filteredProperties.map((property) => {
                  const statusCfg = STATUS_IMOVEL_CONFIG[property.status] || STATUS_IMOVEL_CONFIG.disponivel;
                  const hasPhotos = property.imagens && property.imagens.length > 0;

                  return (
                    <div
                      key={property.id}
                      className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-5 shadow-sm hover:shadow-md transition-all border border-gray-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                    >
                      {/* Miniatura e Dados Principais */}
                      <div className="flex items-center gap-4 w-full md:w-auto">
                        <Link href={`/imoveis/${property.id}`} className="relative w-24 h-20 sm:w-28 sm:h-24 rounded-2xl overflow-hidden bg-gray-100 flex-shrink-0 group">
                          {hasPhotos ? (
                            <img
                              src={property.imagens[0]}
                              alt={property.titulo}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">Sem foto</div>
                          )}
                          <div className="absolute bottom-1 right-1 bg-black/70 text-white text-[10px] font-bold px-1.5 py-0.5 rounded flex items-center gap-1">
                            <Camera className="w-3 h-3" />
                            {property.imagens?.length || 0}
                          </div>
                        </Link>

                        <div>
                          <div className="flex flex-wrap items-center gap-2 mb-1">
                            <span className="text-[11px] font-black uppercase tracking-wider text-[#b87d5b]">
                              {property.tipo === 'venda' ? 'Venda' : 'Locação'}
                            </span>
                            <span className="text-gray-300">•</span>
                            <span className="text-[11px] font-bold text-gray-500 uppercase">
                              {CATEGORIAS[property.categoria] || property.categoria}
                            </span>
                            <span className="text-gray-300">•</span>
                            <span className="text-[11px] text-gray-400">Ref: #{property.codigo || String(property.id || '').slice(0, 8) || 'REF'}</span>
                          </div>

                          <Link href={`/imoveis/${property.id}`}>
                            <h3 className="text-base sm:text-lg font-black text-gray-900 hover:text-[#1c1917] transition-colors line-clamp-1">
                              {property.titulo || 'Imóvel sem título'}
                            </h3>
                          </Link>

                          <p className="text-xs text-gray-500 mt-0.5">
                            📍 {property.bairro || 'Toledo'}, Toledo • {property.quartos ?? 0} qts • {property.banheiros ?? 0} ban • {property.areaTotal || property.areaUtil || 0} m²
                          </p>

                          <p className="text-base font-black text-[#1c1917] mt-1">
                            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(Number(property.preco) || 0)}
                          </p>
                        </div>
                      </div>

                      {/* Ações e Seletor de Status */}
                      <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto justify-between md:justify-end pt-3 md:pt-0 border-t md:border-t-0 border-gray-100">
                        {/* Seletor Rápido de Status */}
                        <select
                          value={property.status}
                          onChange={(e) => handleQuickStatusChange(property.id, e.target.value as StatusImovel)}
                          className={`px-3 py-2 rounded-xl text-xs font-black uppercase tracking-wider border cursor-pointer ${statusCfg.bg} ${statusCfg.text} ${statusCfg.border}`}
                        >
                          <option value="disponivel">🟢 Disponível</option>
                          <option value="negociacao">🟡 Em Negociação</option>
                          <option value="vendido">🔴 Vendido</option>
                          <option value="oculto">⚪ Oculto / Rascunho</option>
                        </select>

                        {/* Botão Ver Página Interna / Galeria */}
                        <Link
                          href={`/imoveis/${property.id}`}
                          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gray-100 hover:bg-[#1c1917] text-gray-700 hover:text-white font-bold text-xs transition-all shadow-sm"
                          title="Abrir página interna e galeria de fotos"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          <span>Ver / Fotos</span>
                        </Link>

                        {/* Botão Editar */}
                        <button
                          onClick={() => {
                            setSelectedPropertyForEdit(property);
                            setIsEditModalOpen(true);
                          }}
                          className="p-2 rounded-xl bg-gray-100 hover:bg-[#b87d5b] text-gray-700 hover:text-white transition-all shadow-sm"
                          title="Editar dados cadastrais"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>

                        {/* Botão Excluir */}
                        <button
                          onClick={() => handleDelete(property.id, property.titulo)}
                          className="p-2 rounded-xl bg-red-50 hover:bg-red-600 text-red-600 hover:text-white transition-all shadow-sm"
                          title="Excluir imóvel"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </>
        ) : (
          /* ABA: SEGURANÇA E TROCA DE SENHA */
          <div className="max-w-2xl bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-200 space-y-6">
            <div>
              <div className="flex items-center gap-2.5 text-[#1c1917] mb-1">
                <KeyRound className="w-6 h-6 text-[#b87d5b]" />
                <h2 className="text-xl font-black">Alterar Senha de Acesso</h2>
              </div>
              <p className="text-xs text-gray-500">
                Altere a senha que dá acesso ao painel do corretor e às funções administrativas.
              </p>
            </div>

            {passSuccessMsg && (
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center gap-3 text-emerald-700 text-xs font-bold">
                <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                <span>{passSuccessMsg}</span>
              </div>
            )}

            {passErrorMsg && (
              <div className="p-4 rounded-2xl bg-red-50 border border-red-200 flex items-center gap-3 text-red-700 text-xs font-bold">
                <AlertTriangle className="w-5 h-5 flex-shrink-0" />
                <span>{passErrorMsg}</span>
              </div>
            )}

            <form onSubmit={handleChangePasswordSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Senha Atual
                </label>
                <input
                  type="password"
                  required
                  value={currentPass}
                  onChange={(e) => setCurrentPass(e.target.value)}
                  placeholder="Digite sua senha atual"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm focus:ring-2 focus:ring-[#1c1917] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Nova Senha (mínimo 6 caracteres)
                </label>
                <input
                  type="password"
                  required
                  value={newPass}
                  onChange={(e) => setNewPass(e.target.value)}
                  placeholder="Digite a nova senha segura"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm focus:ring-2 focus:ring-[#1c1917] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Confirmar Nova Senha
                </label>
                <input
                  type="password"
                  required
                  value={confirmNewPass}
                  onChange={(e) => setConfirmNewPass(e.target.value)}
                  placeholder="Repita a nova senha"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm focus:ring-2 focus:ring-[#1c1917] focus:outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={isChangingPass}
                className="w-full py-3.5 px-4 rounded-xl bg-[#1c1917] hover:bg-[#b87d5b] text-white font-black text-sm flex items-center justify-center gap-2 shadow-md transition-all disabled:opacity-50"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Salvar Nova Senha</span>
              </button>
            </form>

            <div className="pt-6 border-t border-gray-100 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-gray-700 block">Esqueceu a senha antiga?</span>
                <span className="text-[11px] text-gray-500">Utilize a recuperação por confirmação no e-mail.</span>
              </div>
              <Link
                href="/recuperar-senha"
                className="text-xs font-bold text-[#8e5433] hover:underline"
              >
                Recuperar por E-mail →
              </Link>
            </div>
          </div>
        )}

      </div>

      {/* Modal de Edição de Imóvel */}
      {selectedPropertyForEdit && (
        <PropertyEditModal
          property={selectedPropertyForEdit}
          allProperties={properties}
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedPropertyForEdit(null);
          }}
          onSave={handleSaveProperty}
        />
      )}
    </div>
  );
}
