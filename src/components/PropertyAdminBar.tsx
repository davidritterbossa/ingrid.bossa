'use client';

import React, { useState } from 'react';
import { Property, StatusImovel, STATUS_IMOVEL_CONFIG } from '@/types/property';
import {
  ShieldCheck,
  Camera,
  Edit3,
  Trash2,
  Check,
  AlertTriangle,
  ChevronDown
} from 'lucide-react';

interface PropertyAdminBarProps {
  property: Property;
  onStatusChange: (newStatus: StatusImovel) => void;
  onOpenPhotoManager: () => void;
  onOpenEditModal: () => void;
  onDeleteProperty: () => void;
}

export default function PropertyAdminBar({
  property,
  onStatusChange,
  onOpenPhotoManager,
  onOpenEditModal,
  onDeleteProperty,
}: PropertyAdminBarProps) {
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState('');

  const currentStatusConfig = STATUS_IMOVEL_CONFIG[property.status] || STATUS_IMOVEL_CONFIG.disponivel;

  const triggerFeedback = (msg: string) => {
    setFeedbackMsg(msg);
    setTimeout(() => setFeedbackMsg(''), 2500);
  };

  const handleSelectStatus = (status: StatusImovel) => {
    onStatusChange(status);
    setShowStatusDropdown(false);
    triggerFeedback(`Status alterado para: ${STATUS_IMOVEL_CONFIG[status].label}`);
  };

  return (
    <div className="mb-6 relative">
      {/* Toast Feedback */}
      {feedbackMsg && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 bg-stone-900 text-white px-5 py-2.5 rounded-full shadow-2xl flex items-center gap-2 border border-rosebronze-400/50 text-xs sm:text-sm font-bold animate-bounce">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{feedbackMsg}</span>
        </div>
      )}

      {/* Painel Principal */}
      <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-5 shadow-lg border border-stone-200/80 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        {/* Esquerda: Identificação e Status */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-stone-900 text-white text-xs font-black uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4 text-rosebronze-400" />
            <span>Painel da Corretora</span>
          </div>

          {/* Seletor de Status */}
          <div className="relative">
            <button
              onClick={() => setShowStatusDropdown(!showStatusDropdown)}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl border text-xs font-black uppercase tracking-wider shadow-sm transition-all hover:opacity-90 ${currentStatusConfig.bg} ${currentStatusConfig.text} ${currentStatusConfig.border}`}
            >
              <span className={`w-2.5 h-2.5 rounded-full ${currentStatusConfig.dot}`} />
              <span>Status: {currentStatusConfig.label}</span>
              <ChevronDown className="w-3.5 h-3.5 ml-1 opacity-70" />
            </button>

            {showStatusDropdown && (
              <div className="absolute left-0 mt-2 w-52 bg-white rounded-2xl shadow-2xl border border-stone-200 py-2 z-40 animate-fade-in">
                <p className="px-3.5 py-1 text-[11px] font-bold text-stone-400 uppercase tracking-wider">
                  Alterar Status do Imóvel
                </p>
                {(['disponivel', 'negociacao', 'vendido', 'oculto'] as StatusImovel[]).map((st) => {
                  const cfg = STATUS_IMOVEL_CONFIG[st];
                  const isSelected = property.status === st;
                  return (
                    <button
                      key={st}
                      onClick={() => handleSelectStatus(st)}
                      className={`w-full px-3.5 py-2 text-left text-xs font-bold flex items-center justify-between transition-colors hover:bg-stone-50 ${
                        isSelected ? 'bg-stone-100/80 text-stone-900' : 'text-stone-700'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${cfg.dot}`} />
                        <span>{cfg.label}</span>
                      </div>
                      {isSelected && <Check className="w-3.5 h-3.5 text-stone-900" />}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Direita: Botões de Ação */}
        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto justify-start md:justify-end">
          {/* Botão Gerenciar Fotos */}
          <button
            onClick={onOpenPhotoManager}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-xs transition-all shadow-sm hover:scale-[1.02]"
            title="Adicionar ou remover fotos da galeria"
          >
            <Camera className="w-4 h-4 text-rosebronze-600" />
            <span>Gerenciar Fotos</span>
          </button>

          {/* Botão Editar Dados */}
          <button
            onClick={onOpenEditModal}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-stone-900 hover:bg-rosebronze-600 text-white font-bold text-xs transition-all shadow-sm hover:scale-[1.02]"
            title="Alterar preço, características e descrição"
          >
            <Edit3 className="w-4 h-4" />
            <span>Editar Dados</span>
          </button>

          {/* Botão Excluir Imóvel */}
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="p-2.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 transition-all hover:scale-105"
            title="Excluir este imóvel"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Modal de Confirmação de Exclusão */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-stone-200 text-center">
            <div className="w-14 h-14 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-8 h-8" />
            </div>

            <h3 className="text-xl font-bold text-stone-900 mb-2">Excluir Imóvel?</h3>
            <p className="text-sm text-stone-600 mb-6">
              Tem certeza que deseja remover <strong>&quot;{property.titulo}&quot;</strong>? Esta ação não pode ser desfeita.
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 py-3 rounded-xl border border-stone-300 font-bold text-sm text-stone-700 hover:bg-stone-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  setShowDeleteConfirm(false);
                  onDeleteProperty();
                }}
                className="flex-1 py-3 rounded-xl bg-red-600 hover:bg-red-700 font-bold text-sm text-white transition-colors shadow-md"
              >
                Sim, Excluir
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
