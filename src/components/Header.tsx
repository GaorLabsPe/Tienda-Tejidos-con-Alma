import React from 'react';
import { StoreSettings } from '../types';
import { MapPin } from 'lucide-react';
import { useSecretAdminTrigger } from '../utils/secretTrigger';

interface HeaderProps {
  settings: StoreSettings;
  deliveryType: 'delivery' | 'pickup';
  onDeliveryTypeChange: (type: 'delivery' | 'pickup') => void;
  onOpenSettings: () => void;
  onGoHome: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  settings,
  deliveryType,
  onDeliveryTypeChange,
  onOpenSettings,
  onGoHome,
}) => {
  const handleSecretAdmin = useSecretAdminTrigger(onOpenSettings);

  return (
    <header className="bg-white border-b border-[#F0E4F7]">
      {/* Top Banner with Delivery Toggle */}
      <div className="bg-[#653977] text-white px-3.5 py-2 flex items-center justify-between">
        <div className="flex items-center gap-2 text-left">
          <span className="w-2 h-2 rounded-full bg-emerald-300 animate-pulse"></span>
          <span 
            onClick={handleSecretAdmin}
            className="text-[10px] font-bold uppercase tracking-wider text-purple-100 cursor-pointer select-none touch-manipulation"
          >
            {settings.storeName}
          </span>
        </div>
      </div>

      {/* Main Brand info */}
      <div className="p-3">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 text-left group">
            <button
              type="button"
              onClick={onGoHome}
              title="Ir a Inicio"
              className="w-10 h-10 rounded-2xl bg-[#F8F2FA] border border-[#E9DAF2] group-hover:border-[#DDC5EA] group-hover:bg-[#F2E5F7] flex items-center justify-center text-2xl shadow-2xs shrink-0 transition-colors cursor-pointer"
            >
              🌻
            </button>
            <div>
              <h1 className="text-base font-black text-[#54286B] leading-tight uppercase tracking-tight flex items-center gap-1">
                <span onClick={onGoHome} className="cursor-pointer group-hover:text-[#7A4395] transition-colors">
                  {settings.storeName.replace('💜', '').trim()}
                </span>
                <span
                  onClick={handleSecretAdmin}
                  title="💜"
                  className="cursor-pointer select-none text-purple-600 hover:scale-125 active:scale-150 transition-transform touch-manipulation px-0.5"
                >
                  💜
                </span>
              </h1>
              <p className="text-[10px] font-bold tracking-wider text-stone-500 uppercase mt-0.5 flex items-center gap-1.5">
                <span>Ramos Eternos</span>
                <span className="text-[#B795CC]">•</span>
                <span onClick={onGoHome} className="text-[#653977] font-bold cursor-pointer hover:underline">
                  Inicio
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* Delivery / Pickup Switcher (Soft Lilac Pill style) */}
        <div className="mt-2.5 bg-[#F6EEFA] p-1 rounded-2xl flex items-center gap-1 border border-[#EADBEE]">
          <button
            onClick={() => onDeliveryTypeChange('delivery')}
            className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              deliveryType === 'delivery'
                ? 'bg-[#653977] text-white shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>Delivery</span>
          </button>

          <button
            onClick={() => onDeliveryTypeChange('pickup')}
            className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              deliveryType === 'pickup'
                ? 'bg-[#653977] text-white shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <span>Retiro en Taller</span>
          </button>
        </div>
      </div>
    </header>
  );
};

