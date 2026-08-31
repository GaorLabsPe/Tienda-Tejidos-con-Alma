import React from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Product } from '../types';
import { ProductCard } from './ProductCard';
import { Heart, Flower2 } from 'lucide-react';

interface FavoritesViewProps {
  favoriteProducts: Product[];
  onSelectProduct: (product: Product) => void;
  currencySymbol: string;
  onExploreCatalog: () => void;
}

export const FavoritesView: React.FC<FavoritesViewProps> = ({
  favoriteProducts,
  onSelectProduct,
  currencySymbol,
  onExploreCatalog,
}) => {
  return (
    <div className="flex-1 p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-black text-stone-900 flex items-center gap-1.5">
            <Heart className="w-4 h-4 text-[#653977] fill-[#653977]" />
            <span>Tus Ramos Favoritos</span>
          </h2>
          <p className="text-xs text-stone-500 font-semibold">
            Ramos que has guardado para regalar
          </p>
        </div>
        <span className="text-xs font-bold bg-[#F5ECF9] text-[#502763] px-2.5 py-1 rounded-full">
          {favoriteProducts.length} {favoriteProducts.length === 1 ? 'favorito' : 'favoritos'}
        </span>
      </div>

      {favoriteProducts.length > 0 ? (
        <motion.div layout className="grid grid-cols-2 gap-2.5">
          <AnimatePresence mode="popLayout">
            {favoriteProducts.map((product, idx) => (
              <ProductCard
                key={product.id}
                index={idx}
                product={product}
                onSelectProduct={onSelectProduct}
                currencySymbol={currencySymbol}
                isFavorite={true}
              />
            ))}
          </AnimatePresence>
        </motion.div>
      ) : (
        <div className="p-8 text-center bg-white rounded-3xl border border-[#EFE5F5] mt-6 space-y-3 shadow-2xs">
          <div className="w-14 h-14 rounded-full bg-[#FAF5FC] border border-[#EFE5F5] flex items-center justify-center mx-auto text-2xl">
            💝
          </div>
          <div>
            <h3 className="font-bold text-sm text-stone-900">
              Aún no tienes favoritos guardados
            </h3>
            <p className="text-xs text-stone-500 mt-1 font-medium max-w-xs mx-auto">
              Explora nuestro catálogo y dale me gusta a tus modelos de ramos y tulipanes preferidos.
            </p>
          </div>
          <button
            onClick={onExploreCatalog}
            className="px-4 py-2 bg-[#653977] hover:bg-[#552965] text-white font-bold text-xs rounded-xl shadow-md inline-flex items-center gap-1.5 cursor-pointer"
          >
            <Flower2 className="w-3.5 h-3.5 text-purple-100" />
            <span>Explorar Catálogo</span>
          </button>
        </div>
      )}
    </div>
  );
};
