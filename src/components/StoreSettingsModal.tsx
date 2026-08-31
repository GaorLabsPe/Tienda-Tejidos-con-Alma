import React, { useState } from 'react';
import { StoreSettings } from '../types';
import { Settings, Save, X, Phone, DollarSign, Store, Clock } from 'lucide-react';

interface StoreSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: StoreSettings;
  onSaveSettings: (newSettings: StoreSettings) => void;
}

export const StoreSettingsModal: React.FC<StoreSettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onSaveSettings,
}) => {
  const [form, setForm] = useState<StoreSettings>({ ...settings });

  React.useEffect(() => {
    setForm({ ...settings });
  }, [settings]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveSettings(form);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-[#EFE5F5] overflow-hidden flex flex-col max-h-[92dvh] animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-[#653977] p-4 sm:p-5 text-white flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center text-purple-100">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black tracking-tight uppercase">
                Configuración de la Florería
              </h2>
              <p className="text-xs text-purple-100 font-medium">
                Edita el WhatsApp de destino y datos de pago
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/15 hover:bg-white/25 text-white flex items-center justify-center font-bold cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSave} className="p-4 sm:p-5 overflow-y-auto space-y-4 flex-1">
          {/* Store Name */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-stone-700 flex items-center gap-1.5">
              <Store className="w-3.5 h-3.5 text-[#653977]" />
              <span>Nombre de la Tienda</span>
            </label>
            <input
              type="text"
              required
              value={form.storeName}
              onChange={(e) => setForm({ ...form, storeName: e.target.value })}
              className="w-full text-xs p-2.5 rounded-xl border border-stone-200 focus:border-[#653977] focus:ring-1 focus:ring-[#653977] outline-hidden font-medium"
            />
          </div>

          {/* WhatsApp Phone */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-stone-700 flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-emerald-600" />
              <span>Número de WhatsApp (con código de país)</span>
            </label>
            <input
              type="tel"
              required
              placeholder="51987654321"
              value={form.whatsappNumber}
              onChange={(e) => setForm({ ...form, whatsappNumber: e.target.value.replace(/\D/g, '') })}
              className="w-full text-xs p-2.5 rounded-xl border border-stone-200 focus:border-[#653977] focus:ring-1 focus:ring-[#653977] outline-hidden font-medium"
            />
            <p className="text-[10px] text-stone-400">
              Ejemplo para Perú: 519XXXXXXXX (código 51 + 9 dígitos)
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {/* Currency Symbol */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-stone-700 flex items-center gap-1.5">
                <DollarSign className="w-3.5 h-3.5 text-[#653977]" />
                <span>Símbolo Moneda</span>
              </label>
              <input
                type="text"
                required
                value={form.currencySymbol}
                onChange={(e) => setForm({ ...form, currencySymbol: e.target.value })}
                className="w-full text-xs p-2.5 rounded-xl border border-stone-200 focus:border-[#653977] focus:ring-1 focus:ring-[#653977] outline-hidden font-medium"
              />
            </div>

            {/* Preparation Time */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-stone-700 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[#653977]" />
                <span>Tiempo de Entrega</span>
              </label>
              <input
                type="text"
                value={form.estimatedDeliveryTime}
                onChange={(e) => setForm({ ...form, estimatedDeliveryTime: e.target.value })}
                placeholder="24 - 48 horas"
                className="w-full text-xs p-2.5 rounded-xl border border-stone-200 focus:border-[#653977] focus:ring-1 focus:ring-[#653977] outline-hidden font-medium"
              />
            </div>
          </div>

          {/* Payment Info */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-stone-700 block">
              Instrucciones de Pago / Medios aceptados
            </label>
            <textarea
              rows={2}
              value={form.paymentInfo}
              onChange={(e) => setForm({ ...form, paymentInfo: e.target.value })}
              placeholder="Yape / Plin al 987654321 o Transferencia BCP..."
              className="w-full text-xs p-2.5 rounded-xl border border-stone-200 focus:border-[#653977] focus:ring-1 focus:ring-[#653977] outline-hidden resize-none font-medium"
            />
          </div>

          {/* Footer Submit */}
          <div className="pt-2 border-t border-purple-50 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-stone-600 hover:text-stone-900 cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-[#653977] hover:bg-[#552965] text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-1.5 active:scale-95 transition-all cursor-pointer"
            >
              <Save className="w-3.5 h-3.5 text-purple-100" />
              <span>Guardar Cambios</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
