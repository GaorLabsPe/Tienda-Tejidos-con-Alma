import React from 'react';
import { motion } from 'motion/react';
import { Product } from '../types';
import { Plus, Heart } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onSelectProduct: (product: Product) => void;
  currencySymbol: string;
  isFavorite?: boolean;
  onToggleFavorite?: (productId: string) => void;
  index?: number;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onSelectProduct,
  currencySymbol,
  isFavorite = false,
  onToggleFavorite,
  index = 0,
}) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{
        duration: 0.22,
        delay: Math.min(index * 0.03, 0.15),
        ease: [0.22, 1, 0.36, 1],
      }}
      onClick={() => onSelectProduct(product)}
      className="bg-white rounded-2xl border border-[#EFE5F5] overflow-hidden shadow-2xs hover:shadow-md hover:border-[#DFC7ED] transition-all flex flex-col justify-between cursor-pointer active:scale-[0.99] group"
    >
      {/* Product Image */}
      <div className="relative aspect-4/3 w-full bg-[#FAF5FC] overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {product.badge && (
          <span className="absolute top-2 left-2 bg-[#653977] text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-xs">
            {product.badge}
          </span>
        )}
        {onToggleFavorite && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite(product.id);
            }}
            className={`absolute top-2 right-2 w-7 h-7 rounded-full flex items-center justify-center transition-all cursor-pointer ${
              isFavorite
                ? 'bg-[#653977] text-white shadow-xs'
                : 'bg-white/80 backdrop-blur-xs text-stone-500 hover:text-[#653977] shadow-2xs'
            }`}
          >
            <Heart
              className={`w-3.5 h-3.5 ${isFavorite ? 'fill-white stroke-white' : 'stroke-[2.5]'}`}
            />
          </button>
        )}
      </div>

      {/* Product Details */}
      <div className="p-3 flex flex-col flex-1 justify-between gap-2 bg-white">
        <div>
          <h3 className="font-bold text-xs sm:text-sm text-stone-800 group-hover:text-[#502763] line-clamp-1 leading-snug transition-colors">
            {product.name}
          </h3>
          <p className="text-[11px] text-stone-500 line-clamp-2 mt-0.5 font-medium leading-tight">
            {product.description}
          </p>
        </div>

        {/* Price & Add button */}
        <div className="flex items-center justify-between pt-1.5 border-t border-[#F5EDFA]">
          <div>
            <span className="text-xs sm:text-sm font-extrabold text-[#502763]">
              {currencySymbol} {product.price.toFixed(2)}
            </span>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onSelectProduct(product);
            }}
            className="flex items-center gap-1 bg-[#653977] hover:bg-[#552965] active:bg-[#451C53] text-white px-2.5 py-1 rounded-xl font-bold text-xs shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 text-purple-100 stroke-[3]" />
            <span>Agregar</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
};
