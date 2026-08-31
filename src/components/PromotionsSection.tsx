import React from 'react';
import { motion } from 'motion/react';
import { Product } from '../types';
import { Plus, Heart, Tag } from 'lucide-react';

interface PromotionsSectionProps {
  products: Product[];
  currencySymbol: string;
  onSelectProduct: (product: Product) => void;
  favorites: string[];
  onToggleFavorite: (productId: string) => void;
  onViewAll?: () => void;
}

export const PromotionsSection: React.FC<PromotionsSectionProps> = ({
  products,
  currencySymbol,
  onSelectProduct,
  favorites,
  onToggleFavorite,
  onViewAll,
}) => {
  const promoProducts = products.filter(
    (p) => p.originalPrice || p.category === 'combos' || p.badge?.includes('Glow') || p.badge?.includes('Oferta') || p.price < 40
  ).slice(0, 7);

  if (promoProducts.length === 0) return null;

  return (
    <section className="mb-5">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-2.5 px-1">
        <div className="flex items-center gap-1.5">
          <div className="w-5 h-5 rounded-full bg-[#F3EAF8] flex items-center justify-center text-[#653977]">
            <Tag className="w-3.5 h-3.5 fill-[#653977] text-[#653977]" />
          </div>
          <h2 className="text-sm sm:text-base font-bold text-stone-900 tracking-tight">
            Promociones y Ofertas
          </h2>
        </div>

        {onViewAll && (
          <button
            onClick={onViewAll}
            className="text-xs font-bold text-[#653977] hover:text-[#502763] transition-colors active:scale-95 cursor-pointer"
          >
            Ver todo
          </button>
        )}
      </div>

      {/* Horizontal Carousel */}
      <div className="flex gap-3 overflow-x-auto no-scrollbar scroll-smooth pb-2 pt-0.5 px-1">
        {promoProducts.map((product, idx) => {
          const isFav = favorites.includes(product.id);
          const oldPrice = product.originalPrice || (product.price * 1.2);

          return (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.25, delay: idx * 0.05 }}
              onClick={() => onSelectProduct(product)}
              className="w-40 sm:w-44 shrink-0 bg-white rounded-2xl border border-[#EFE5F5] shadow-2xs hover:shadow-md hover:border-[#DFC7ED] overflow-hidden flex flex-col justify-between cursor-pointer transition-all active:scale-[0.98] group"
            >
              {/* Product Image */}
              <div className="relative aspect-4/3 w-full bg-[#FAF5FC] overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                
                <span className="absolute top-1.5 left-1.5 bg-[#653977] text-white text-[9px] font-bold px-2 py-0.5 rounded-full shadow-xs">
                  {product.badge || 'Oferta'}
                </span>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleFavorite(product.id);
                  }}
                  className={`absolute top-1.5 right-1.5 w-6 h-6 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                    isFav
                      ? 'bg-[#653977] text-white'
                      : 'bg-white/80 backdrop-blur-xs text-stone-500 hover:text-[#653977]'
                  }`}
                >
                  <Heart
                    className={`w-3 h-3 ${isFav ? 'fill-white stroke-white' : 'stroke-2'}`}
                  />
                </button>
              </div>

              {/* Product Info */}
              <div className="p-2.5 flex flex-col justify-between flex-1 gap-1.5 bg-white">
                <div>
                  <h3 className="font-bold text-xs text-stone-900 group-hover:text-[#502763] truncate">
                    {product.name}
                  </h3>
                  <p className="text-[10px] text-stone-500 line-clamp-1 mt-0.5">
                    {product.description}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-1 border-t border-[#F5EDFA]">
                  <div className="flex flex-col">
                    <span className="text-[9px] text-stone-400 line-through">
                      {currencySymbol} {oldPrice.toFixed(2)}
                    </span>
                    <span className="text-xs font-extrabold text-[#502763]">
                      {currencySymbol} {product.price.toFixed(2)}
                    </span>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectProduct(product);
                    }}
                    className="w-6 h-6 rounded-lg bg-[#653977] hover:bg-[#552965] text-white flex items-center justify-center transition-colors cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5 text-purple-100 stroke-[2.5]" />
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};
