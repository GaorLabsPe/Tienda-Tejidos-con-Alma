import React from 'react';
import { StoreSettings } from '../types';
import { Phone, MapPin, Clock, Heart, Sparkles, Instagram, Facebook } from 'lucide-react';

interface FooterProps {
  settings: StoreSettings;
  onOpenSettings: () => void;
  onOpenCustomBuilder: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  settings,
  onOpenSettings,
  onOpenCustomBuilder,
}) => {
  return (
    <footer className="mt-12 bg-amber-950 text-amber-100/90 border-t-4 border-amber-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          
          {/* Brand Col */}
          <div className="md:col-span-5 space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-500 text-amber-950 flex items-center justify-center text-xl font-bold">
                🌻
              </div>
              <div>
                <h3 className="text-xl font-black text-white">{settings.storeName}</h3>
                <p className="text-xs text-amber-300 font-semibold">Florería Crochet Artesanal</p>
              </div>
            </div>

            <p className="text-xs text-amber-200/80 leading-relaxed max-w-sm">
              Creamos flores y ramos eternos tejidos punto por punto con hilo antialérgico y mucho amor. Cada diseño es único, lleva aroma especial e incluye tarjeta con foto polaroid de regalo.
            </p>

            <div className="pt-2 flex items-center gap-2">
              <a
                href={`https://wa.me/${settings.whatsappNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-xs"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>WhatsApp: {settings.whatsappDisplay}</span>
              </a>
            </div>
          </div>

          {/* Quick links */}
          <div className="md:col-span-3 space-y-2">
            <h4 className="text-xs font-black text-amber-400 uppercase tracking-wider">
              Enlaces Rápidos
            </h4>
            <ul className="space-y-1.5 text-xs text-amber-200/80 font-semibold">
              <li>
                <button
                  onClick={onOpenCustomBuilder}
                  className="hover:text-white transition-colors flex items-center gap-1"
                >
                  <Sparkles className="w-3 h-3 text-amber-400" /> Armar Ramo a Medida
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenSettings}
                  className="hover:text-white transition-colors"
                >
                  Configuración de Tienda
                </button>
              </li>
              <li>
                <a
                  href={`https://wa.me/${settings.whatsappNumber}?text=Hola!%20Quisiera%20hacer%20una%20consulta%20personalizada`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  Atención al Cliente WhatsApp
                </a>
              </li>
            </ul>
          </div>

          {/* Info & Delivery */}
          <div className="md:col-span-4 space-y-2">
            <h4 className="text-xs font-black text-amber-400 uppercase tracking-wider">
              Envíos & Horarios
            </h4>
            <div className="space-y-1.5 text-xs text-amber-200/80">
              <p className="flex items-start gap-2">
                <Clock className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                <span>{settings.openingHours}</span>
              </p>
              <p className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                <span>{settings.storeAddress}</span>
              </p>
              <p className="text-[11px] text-amber-300 font-semibold pt-1">
                Aceptamos Yape ({settings.yapeNumber}), Plin, BCP, BBVA y Efectivo.
              </p>
            </div>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="mt-8 pt-6 border-t border-amber-900/60 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-amber-400/80">
          <p>© {new Date().getFullYear()} {settings.storeName} — Catálogo Virtual Interactivo con Pedido a WhatsApp.</p>
          <p className="flex items-center gap-1 font-semibold text-amber-300">
            Hecho con <Heart className="w-3 h-3 text-rose-500 fill-rose-500" /> para amantes del crochet
          </p>
        </div>
      </div>
    </footer>
  );
};
