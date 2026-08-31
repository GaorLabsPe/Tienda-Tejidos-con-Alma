import React from 'react';
import { StoreSettings } from '../types';
import { MapPin, Sparkles, ChevronDown, ArrowRight } from 'lucide-react';
import { HERO_FEATURED_IMAGE } from '../data/catalog';

interface HeroEntranceProps {
  settings: StoreSettings;
  deliveryType: 'delivery' | 'pickup';
  onDeliveryTypeChange: (type: 'delivery' | 'pickup') => void;
  onExploreCatalog: () => void;
}

export const HeroEntrance: React.FC<HeroEntranceProps> = ({
  settings,
  deliveryType,
  onDeliveryTypeChange,
  onExploreCatalog,
}) => {
  return (
    <div className="flex-1 flex flex-col justify-between bg-[#FCFAFE] relative overflow-hidden">
      {/* 1. TOP WARM BURGUNDY STATUS BAR */}
      <div className="bg-[#653977] text-white px-3.5 sm:px-4 py-2.5 sm:py-3 flex items-center justify-between shadow-xs shrink-0">
        <button
          onClick={() =>
            onDeliveryTypeChange(deliveryType === 'delivery' ? 'pickup' : 'delivery')
          }
          className="flex items-center gap-2 text-left group active:opacity-80 cursor-pointer"
        >
          <div className="w-8 h-8 rounded-full bg-white/15 flex items-center justify-center text-purple-100 shrink-0">
            <MapPin className="w-4 h-4 text-purple-100" />
          </div>
          <div>
            <div className="text-[9px] font-bold tracking-widest text-purple-200/90 uppercase">
              {deliveryType === 'delivery' ? 'ENVIAR A' : 'RECOGER EN'}
            </div>
            <div className="text-xs font-bold text-white flex items-center gap-1">
              <span>{deliveryType === 'delivery' ? 'Lima Metropolitana' : 'Taller Artesanal'}</span>
              <ChevronDown className="w-3 h-3 text-purple-200 group-hover:translate-y-0.5 transition-transform" />
            </div>
          </div>
        </button>
        {/* Live Delivery status pill */}
        <div className="bg-white/15 backdrop-blur-xs border border-white/20 px-2.5 py-1 rounded-full flex items-center gap-1.5 shadow-2xs shrink-0">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="text-[10px] font-bold text-white tracking-wide whitespace-nowrap">
            Envíos Hoy
          </span>
        </div>
      </div>

      {/* 2. BRAND TITLE HEADER */}
      <div className="bg-white px-4 py-2.5 sm:py-3 text-center border-b border-[#F0E4F7] shadow-2xs shrink-0">
        <h1 className="text-lg sm:text-xl md:text-2xl font-black tracking-tight text-[#54286B] uppercase font-sans">
          {settings.storeName}
        </h1>
        <p className="text-[9px] sm:text-[10px] font-bold tracking-[0.2em] text-[#9363A8] uppercase mt-0.5">
          TALLER ARTESANAL • RAMOS ETERNOS
        </p>
      </div>

      {/* 3. HERO SHOWCASE CARD */}
      <div className="flex-1 px-4 py-3 sm:py-4 flex flex-col items-center justify-center text-center relative z-10 min-h-0">
        {/* Soft pastel decorative floating bubbles */}
        <div className="absolute top-6 left-6 w-6 h-3 bg-[#E4D1F0] rounded-full rotate-45 blur-[0.5px] pointer-events-none opacity-60"></div>
        <div className="absolute top-10 right-6 w-5 h-5 rounded-full border-2 border-[#E9DAF5] pointer-events-none"></div>
        <div className="absolute bottom-16 left-4 w-4 h-4 rounded-full border-2 border-[#E4D1F0] pointer-events-none"></div>
        <div className="absolute top-24 left-3 w-3 h-3 bg-[#F2E3FA] rounded-full pointer-events-none"></div>
        <div className="absolute bottom-12 right-6 w-7 h-3 bg-[#E9DAF5] rounded-full -rotate-45 blur-[0.5px] pointer-events-none opacity-70"></div>

        {/* Small top category pill */}
        <div className="inline-flex items-center gap-1.5 sm:gap-2 bg-[#F6EEFA] px-3 py-1 sm:py-1.5 rounded-full border border-[#E8D6F2] shadow-2xs mb-2 shrink-0">
          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          <span className="text-[10px] sm:text-[11px] font-bold text-[#502763] tracking-wide">
            FLORES & CROCHET
          </span>
          <span className="bg-[#653977] text-white text-[8px] sm:text-[9px] font-bold px-1.5 py-0.5 rounded-full uppercase">
            TALLER
          </span>
        </div>

        {/* Headline */}
        <div className="mb-2 sm:mb-3 shrink-0">
          <h2 className="text-xl sm:text-2xl min-[400px]:text-3xl font-black text-[#4E2464] leading-[1.15] tracking-tight">
            Detalles que
            <br />
            <span className="relative inline-block px-1 text-[#4E2464]">
              <span className="relative z-10">Despiertan</span>
              <span className="absolute bottom-1 left-0 right-0 h-1.5 bg-[#E6D4F2] rounded-full z-0"></span>
            </span>
            <br />
            Tus Sentidos
          </h2>
        </div>

        {/* Big Rounded Circular Photo Container */}
        <div className="w-full max-w-[260px] sm:max-w-[280px] aspect-square my-auto relative shrink-1 min-h-[170px] max-h-[280px] flex items-center justify-center">
          {/* Circular Frame with soft pastel aura */}
          <div className="w-full h-full rounded-full p-2.5 bg-white shadow-xl shadow-[#7D4D95]/10 border-2 border-[#EFE3F7] relative group overflow-hidden">
            <div className="w-full h-full rounded-full overflow-hidden relative">
              <img
                src={HERO_FEATURED_IMAGE}
                alt="Girasol artesanal a crochet"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>

            {/* Sparkle badge */}
            <div className="absolute top-2 right-4 bg-white/95 backdrop-blur-xs text-[#502763] text-[10px] font-bold px-2.5 py-1 rounded-full shadow-md border border-[#EDE0F7] flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-[#653977] fill-[#653977]" />
              <span>Glow Edition</span>
            </div>
          </div>
        </div>

        {/* Subtitle */}
        <p className="text-[11px] sm:text-xs text-stone-500 font-medium max-w-xs mt-2 shrink-0">
          Flores tejidas a mano que duran para siempre. Diseños personalizados con dedicatoria especial.
        </p>
      </div>

      {/* 4. BOTTOM ACTION CTA BUTTON */}
      <div className="p-4 bg-white border-t border-[#F0E4F7] shrink-0 shadow-lg">
        <button
          onClick={onExploreCatalog}
          className="w-full py-3.5 px-4 bg-[#653977] hover:bg-[#552965] active:bg-[#451C53] text-white font-bold text-xs sm:text-sm rounded-2xl shadow-md shadow-[#653977]/25 flex items-center justify-center gap-2 transition-all active:scale-[0.98] uppercase tracking-wider cursor-pointer"
        >
          <span>Ver Menú Completo</span>
          <ArrowRight className="w-4 h-4 text-purple-100" />
        </button>
      </div>
    </div>
  );
};
