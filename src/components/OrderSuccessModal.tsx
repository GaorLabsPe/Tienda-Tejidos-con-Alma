import React, { useState } from 'react';
import { CheckCircle2, MessageCircle, Copy, Check, X } from 'lucide-react';

interface OrderSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderMessage: string;
  whatsappUrl: string;
}

export const OrderSuccessModal: React.FC<OrderSuccessModalProps> = ({
  isOpen,
  onClose,
  orderMessage,
  whatsappUrl,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(orderMessage);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[88dvh] animate-in slide-in-from-bottom duration-200 border border-[#EFE5F5]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Mobile pull handle */}
        <div className="w-12 h-1 bg-[#E8DAF2] rounded-full mx-auto my-2 sm:hidden shrink-0"></div>

        {/* Top Header */}
        <div className="bg-[#653977] p-4 sm:p-5 text-white text-center relative shadow-sm">
          <button
            onClick={onClose}
            className="absolute top-3 right-3 w-7 h-7 rounded-full bg-white/15 hover:bg-white/25 active:scale-95 text-white flex items-center justify-center font-bold cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
          <div className="w-11 h-11 rounded-full bg-emerald-400/20 border border-emerald-300/40 flex items-center justify-center mx-auto mb-2 text-emerald-300">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <h2 className="text-base sm:text-lg font-black uppercase tracking-wide">¡Pedido Listo! 🌻</h2>
          <p className="text-xs text-purple-100 mt-0.5 font-medium">
            Presiona el botón para abrir WhatsApp y enviar tu pedido
          </p>
        </div>

        {/* Content */}
        <div className="p-4 overflow-y-auto space-y-3 flex-1 bg-white">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3.5 px-4 bg-[#25D366] hover:bg-[#20bd5a] text-white font-extrabold text-sm rounded-2xl shadow-lg flex items-center justify-center gap-2 active:scale-[0.98] transition-all cursor-pointer"
          >
            <MessageCircle className="w-5 h-5 fill-white stroke-none" />
            <span>Abrir WhatsApp y Enviar</span>
          </a>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#F0E4F7]" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-stone-400 font-bold">O copia el texto</span>
            </div>
          </div>

          {/* Message Box */}
          <div className="p-3 bg-[#FAF7FC] rounded-xl border border-[#EADBEE] relative">
            <pre className="text-[11px] font-mono text-stone-800 whitespace-pre-wrap leading-relaxed max-h-40 overflow-y-auto">
              {orderMessage}
            </pre>
            <button
              onClick={handleCopy}
              className="mt-2 w-full py-2 bg-white hover:bg-[#F6EEFA] active:scale-95 border border-[#DFC9EE] text-[#502763] font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700">¡Mensaje Copiado!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-[#653977]" />
                  <span>Copiar Mensaje</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 bg-[#FCFAFE] border-t border-[#F0E4F7] text-center shrink-0">
          <button
            onClick={onClose}
            className="text-xs font-bold text-stone-500 hover:text-stone-800 cursor-pointer"
          >
            Cerrar esta ventana
          </button>
        </div>
      </div>
    </div>
  );
};
