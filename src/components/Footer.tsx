import React from 'react';
import { StoreSettings } from '../types';
import { Phone, Heart } from 'lucide-react';
import { useSecretAdminTrigger } from '../utils/secretTrigger';

interface FooterProps {
  settings: StoreSettings;
  onOpenAdmin: () => void;
  onOpenCustomBuilder: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  settings,
  onOpenAdmin,
}) => {
  const handleSecretAdmin = useSecretAdminTrigger(onOpenAdmin);

  return (
    <footer className="mt-12 bg-[#FCFAFE] border-t border-[#F0E4F7] text-[#54286B] py-8 px-4">
      <div className="max-w-3xl mx-auto flex flex-col items-center justify-center text-center space-y-4">
        
        {/* Brand Name with Purple Heart */}
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-2xl bg-[#F8F2FA] border border-[#E9DAF2] flex items-center justify-center text-xl shadow-2xs">
            🌻
          </div>
          <h3 className="text-lg sm:text-xl font-black text-[#54286B] tracking-tight uppercase flex items-center gap-1.5">
            <span 
              onClick={handleSecretAdmin}
              className="cursor-pointer select-none touch-manipulation hover:text-[#7A4395] transition-colors"
            >
              {settings.storeName.replace('💜', '').trim()}
            </span>
            <span
              onClick={handleSecretAdmin}
              title="💜"
              className="cursor-pointer select-none text-2xl active:scale-150 hover:scale-125 transition-transform inline-block touch-manipulation p-1 text-purple-600"
            >
              💜
            </span>
          </h3>
        </div>

        <p className="text-xs text-stone-500 font-medium max-w-sm">
          Florería Crochet Artesanal • Ramos y Flores Eternas
        </p>

        {/* WhatsApp Button matching app aesthetic */}
        <div>
          <a
            href={`https://wa.me/${settings.whatsappNumber}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-xs sm:text-sm shadow-sm hover:shadow transition-all active:scale-95"
          >
            <Phone className="w-4 h-4 fill-white" />
            <span>WhatsApp: {settings.whatsappDisplay}</span>
          </a>
        </div>

        {/* Minimal Copyright */}
        <div className="pt-4 border-t border-[#F0E4F7] w-full flex flex-col sm:flex-row items-center justify-between text-[11px] text-stone-400 gap-2">
          <p 
            className="cursor-pointer select-none touch-manipulation hover:text-[#54286B] transition-colors" 
            onClick={handleSecretAdmin}
          >
            © {new Date().getFullYear()} {settings.storeName.replace('💜', '').trim()}{' '}
            <span className="inline-block text-sm hover:scale-125 transition-transform text-purple-600">💜</span>
          </p>
          <p className="flex items-center gap-1 text-stone-500 font-medium">
            Hecho con <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> con amor
          </p>
        </div>

      </div>
    </footer>
  );
};
