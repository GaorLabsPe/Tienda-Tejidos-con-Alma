import React from 'react';
import { StoreSettings } from '../types';
import { Phone, Heart, Instagram, Facebook, Video } from 'lucide-react';
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

  const hasTiktok = Boolean(settings.showTiktok !== false && settings.tiktokUrl && settings.tiktokUrl.trim());
  const hasInstagram = Boolean(settings.showInstagram !== false && settings.instagramUrl && settings.instagramUrl.trim());
  const hasFacebook = Boolean(settings.showFacebook !== false && settings.facebookUrl && settings.facebookUrl.trim());

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
          Florería Crochet Artesanal • Ramos y Flores Eternas tejidas a mano con hilo hipoalergénico
        </p>

        {/* Social Media & WhatsApp Links */}
        <div className="w-full pt-1 space-y-3">
          <p className="text-[11px] font-black text-[#653977] uppercase tracking-wider">
            ¡Síguenos en nuestras redes sociales! 🌸
          </p>

          <div className="flex flex-wrap items-center justify-center gap-2.5">
            {/* TikTok */}
            {hasTiktok && (
              <a
                href={settings.tiktokUrl}
                target="_blank"
                rel="noopener noreferrer"
                title="Síguenos en TikTok"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-black hover:bg-stone-800 text-white font-bold text-xs shadow-xs hover:shadow transition-all active:scale-95 cursor-pointer"
              >
                <Video className="w-3.5 h-3.5 text-cyan-300" />
                <span>TikTok</span>
              </a>
            )}

            {/* Instagram */}
            {hasInstagram && (
              <a
                href={settings.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                title="Síguenos en Instagram"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-purple-600 via-pink-600 to-amber-500 hover:opacity-95 text-white font-bold text-xs shadow-xs hover:shadow transition-all active:scale-95 cursor-pointer"
              >
                <Instagram className="w-3.5 h-3.5" />
                <span>Instagram</span>
              </a>
            )}

            {/* Facebook */}
            {hasFacebook && (
              <a
                href={settings.facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                title="Síguenos en Facebook"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#1877F2] hover:bg-[#166fe5] text-white font-bold text-xs shadow-xs hover:shadow transition-all active:scale-95 cursor-pointer"
              >
                <Facebook className="w-3.5 h-3.5" />
                <span>Facebook</span>
              </a>
            )}

            {/* WhatsApp */}
            <a
              href={`https://wa.me/${settings.whatsappNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-xs shadow-xs hover:shadow transition-all active:scale-95 cursor-pointer"
            >
              <Phone className="w-3.5 h-3.5 fill-white" />
              <span>WhatsApp</span>
            </a>
          </div>
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

