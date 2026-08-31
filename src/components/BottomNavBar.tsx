import React from 'react';
import { Home, Flower2, Heart, ShoppingBag } from 'lucide-react';

export type TabType = 'inicio' | 'catalogo' | 'favoritos' | 'carrito';

interface BottomNavBarProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  cartCount: number;
  favoriteCount: number;
}

export const BottomNavBar: React.FC<BottomNavBarProps> = ({
  activeTab,
  onTabChange,
  cartCount,
  favoriteCount,
}) => {
  return (
    <div className="sticky bottom-0 z-40 px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-1 pointer-events-none">
      <nav className="pointer-events-auto bg-white/95 backdrop-blur-md border border-[#ECE0F3] rounded-full px-3 py-1.5 shadow-lg shadow-[#653977]/10 max-w-sm mx-auto flex items-center justify-around">
        {/* Inicio Tab */}
        <button
          onClick={() => onTabChange('inicio')}
          className={`flex flex-col items-center justify-center min-w-[56px] min-h-[44px] py-1 px-2 rounded-2xl transition-all active:scale-95 relative cursor-pointer ${
            activeTab === 'inicio' ? 'text-[#502763] font-black' : 'text-stone-400 hover:text-stone-600 font-semibold'
          }`}
        >
          <Home className={`w-5 h-5 ${activeTab === 'inicio' ? 'stroke-[2.5] text-[#653977]' : 'stroke-2'}`} />
          <span className="text-[10px] tracking-tight mt-0.5">Inicio</span>
          {activeTab === 'inicio' && (
            <span className="w-1 h-1 bg-[#653977] rounded-full mt-0.5"></span>
          )}
        </button>

        {/* Menú / Catálogo Tab */}
        <button
          onClick={() => onTabChange('catalogo')}
          className={`flex flex-col items-center justify-center min-w-[56px] min-h-[44px] py-1 px-2 rounded-2xl transition-all active:scale-95 relative cursor-pointer ${
            activeTab === 'catalogo' ? 'text-[#502763] font-black' : 'text-stone-400 hover:text-stone-600 font-semibold'
          }`}
        >
          <Flower2 className={`w-5 h-5 ${activeTab === 'catalogo' ? 'stroke-[2.5] text-[#653977]' : 'stroke-2'}`} />
          <span className="text-[10px] tracking-tight mt-0.5">Menú</span>
          {activeTab === 'catalogo' && (
            <span className="w-1 h-1 bg-[#653977] rounded-full mt-0.5"></span>
          )}
        </button>

        {/* Favoritos Tab */}
        <button
          onClick={() => onTabChange('favoritos')}
          className={`flex flex-col items-center justify-center min-w-[56px] min-h-[44px] py-1 px-2 rounded-2xl transition-all active:scale-95 relative cursor-pointer ${
            activeTab === 'favoritos' ? 'text-[#502763] font-black' : 'text-stone-400 hover:text-stone-600 font-semibold'
          }`}
        >
          <div className="relative">
            <Heart className={`w-5 h-5 ${activeTab === 'favoritos' ? 'stroke-[2.5] text-[#653977]' : 'stroke-2'}`} />
            {favoriteCount > 0 && (
              <span className="absolute -top-1.5 -right-2 bg-[#653977] text-white text-[8px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                {favoriteCount}
              </span>
            )}
          </div>
          <span className="text-[10px] tracking-tight mt-0.5">Favoritos</span>
          {activeTab === 'favoritos' && (
            <span className="w-1 h-1 bg-[#653977] rounded-full mt-0.5"></span>
          )}
        </button>

        {/* Carrito Tab */}
        <button
          onClick={() => onTabChange('carrito')}
          className={`flex flex-col items-center justify-center min-w-[56px] min-h-[44px] py-1 px-2 rounded-2xl transition-all active:scale-95 relative cursor-pointer ${
            activeTab === 'carrito' ? 'text-[#502763] font-black' : 'text-stone-400 hover:text-stone-600 font-semibold'
          }`}
        >
          <div className="relative">
            <ShoppingBag className={`w-5 h-5 ${activeTab === 'carrito' ? 'stroke-[2.5] text-[#653977]' : 'stroke-2'}`} />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-2 bg-[#653977] text-white text-[8px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                {cartCount}
              </span>
            )}
          </div>
          <span className="text-[10px] tracking-tight mt-0.5">Carrito</span>
          {activeTab === 'carrito' && (
            <span className="w-1 h-1 bg-[#653977] rounded-full mt-0.5"></span>
          )}
        </button>
      </nav>
    </div>
  );
};
