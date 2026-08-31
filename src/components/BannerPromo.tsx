import React from 'react';
import { Sparkles, HeartHandshake, Truck, ShieldCheck, Flower, Wand2 } from 'lucide-react';

interface BannerPromoProps {
  onOpenCustomBuilder: () => void;
}

export const BannerPromo: React.FC<BannerPromoProps> = ({ onOpenCustomBuilder }) => {
  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-4">
      {/* Hero Welcome Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-100 via-amber-50 to-orange-100 border-2 border-amber-200 p-5 sm:p-7 shadow-xs">
        {/* Cute background floating illustrations */}
        <div className="absolute -top-6 -right-6 text-7xl opacity-20 pointer-events-none select-none">🌻</div>
        <div className="absolute bottom-2 right-1/4 text-5xl opacity-15 pointer-events-none select-none">🐝</div>
        <div className="absolute -bottom-4 -left-4 text-6xl opacity-15 pointer-events-none select-none">🌷</div>

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          
          <div className="lg:col-span-8 space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-200/80 text-amber-900 text-xs font-extrabold border border-amber-300 shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-amber-700 animate-spin" />
              <span>Flores Eternas 100% Tejidas a Mano</span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-black text-amber-950 tracking-tight leading-tight">
              Regala flores tejidas que <span className="text-amber-600 underline decoration-wavy decoration-amber-300">nunca se marchitan</span> 🧶💛
            </h2>

            <p className="text-sm sm:text-base text-amber-900/80 font-medium max-w-2xl">
              Elige tu ramo favorito de nuestro catálogo o personalízalo con flores, colores, papel coreano, luces LED y tarjeta con foto. 
              <strong className="text-amber-950 font-bold"> ¡Tu pedido llega directo y listo a nuestro WhatsApp!</strong>
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                onClick={onOpenCustomBuilder}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-amber-900 hover:bg-amber-800 text-amber-50 font-extrabold text-sm shadow-md hover:shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <Wand2 className="w-4 h-4 text-amber-300" />
                <span>Armar Ramo a mi Gusto</span>
              </button>
              
              <div className="flex items-center gap-2 bg-white/70 px-3 py-2 rounded-2xl border border-amber-200/80 text-xs font-bold text-amber-900">
                <span className="text-base">📸</span>
                <span>¡Incluye Tarjeta + Foto Polaroid Gratis!</span>
              </div>
            </div>
          </div>

          {/* Quick Stats & Guarantees pill grid */}
          <div className="lg:col-span-4 grid grid-cols-2 gap-2.5">
            <div className="bg-white/85 p-3 rounded-2xl border border-amber-200 shadow-2xs">
              <div className="w-8 h-8 rounded-xl bg-amber-100 flex items-center justify-center text-amber-700 mb-2">
                <Flower className="w-4 h-4" />
              </div>
              <h4 className="text-xs font-black text-amber-950">Hilo Antialérgico</h4>
              <p className="text-[11px] text-amber-800/80 mt-0.5">Suave, duradero y sin pelusas</p>
            </div>

            <div className="bg-white/85 p-3 rounded-2xl border border-amber-200 shadow-2xs">
              <div className="w-8 h-8 rounded-xl bg-amber-100 flex items-center justify-center text-amber-700 mb-2">
                <Truck className="w-4 h-4" />
              </div>
              <h4 className="text-xs font-black text-amber-950">Envío Exprés</h4>
              <p className="text-[11px] text-amber-800/80 mt-0.5">Entrega hoy o fecha programada</p>
            </div>

            <div className="bg-white/85 p-3 rounded-2xl border border-amber-200 shadow-2xs">
              <div className="w-8 h-8 rounded-xl bg-amber-100 flex items-center justify-center text-amber-700 mb-2">
                <HeartHandshake className="w-4 h-4" />
              </div>
              <h4 className="text-xs font-black text-amber-950">Aroma Floral</h4>
              <p className="text-[11px] text-amber-800/80 mt-0.5">Perfume delicado incluido</p>
            </div>

            <div className="bg-white/85 p-3 rounded-2xl border border-amber-200 shadow-2xs">
              <div className="w-8 h-8 rounded-xl bg-amber-100 flex items-center justify-center text-amber-700 mb-2">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <h4 className="text-xs font-black text-amber-950">Yape / Plin / BCP</h4>
              <p className="text-[11px] text-amber-800/80 mt-0.5">Pagos 100% seguros y rápidos</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
