import React from 'react';
import { motion } from 'motion/react';
import { DEFAULT_CATEGORIES } from '../data/catalog';
import { CategoryItem, Product } from '../types';
import { Layers } from 'lucide-react';

interface CategoryGridSectionProps {
  selectedCategory: string;
  onSelectCategory: (categoryId: string) => void;
  categories?: CategoryItem[];
  products?: Product[];
}

export const CategoryGridSection: React.FC<CategoryGridSectionProps> = ({
  selectedCategory,
  onSelectCategory,
  categories = DEFAULT_CATEGORIES,
  products = [],
}) => {
  const visualCategories = categories.filter((c) => c.id !== 'todos' && c.isVisible !== false);

  return (
    <section className="mb-6">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-3 px-1">
        <div className="flex items-center gap-1.5">
          <div className="w-5 h-5 rounded-full bg-[#F3EAF8] flex items-center justify-center text-[#653977]">
            <Layers className="w-3.5 h-3.5" />
          </div>
          <h2 className="text-sm sm:text-base font-bold text-stone-900 tracking-tight">
            Categorías
          </h2>
        </div>

        {selectedCategory !== 'todos' && (
          <button
            onClick={() => onSelectCategory('todos')}
            className="text-xs font-bold text-[#502763] hover:text-[#54286B] transition-colors bg-[#F5ECF9] px-2.5 py-0.5 rounded-full active:scale-95 cursor-pointer"
          >
            Ver todas (Todos)
          </button>
        )}
      </div>

      {/* 2-Column Photo Grid */}
      <div className="grid grid-cols-2 gap-3 px-0.5">
        {visualCategories.map((cat, idx) => {
          const isSelected = selectedCategory === cat.id;
          const productCount = products.length > 0 
            ? products.filter(p => p.category === cat.id && p.isVisible !== false).length 
            : (cat.count || 0);

          return (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.22, delay: idx * 0.04 }}
              onClick={() => onSelectCategory(cat.id)}
              className={`group relative h-36 sm:h-40 rounded-3xl overflow-hidden cursor-pointer shadow-xs transition-all duration-300 active:scale-[0.97] border ${
                isSelected
                  ? 'ring-3 ring-[#653977] border-[#653977] shadow-md scale-[1.02]'
                  : 'border-[#EFE5F5] hover:border-[#DFC7ED] hover:shadow-md'
              }`}
            >
              {/* Category Background Image */}
              <img
                src={cat.image || 'https://images.unsplash.com/photo-1597848212624-a19eb35e2651?auto=format&fit=crop&w=800&q=80'}
                alt={cat.name}
                className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
              />

              {/* Gradient Overlay for high-contrast legible text */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#3B194D]/80 via-[#3B194D]/25 to-transparent"></div>

              {/* Top Mini Tag */}
              <div className="absolute top-2.5 left-2.5">
                <span className="text-[10px] bg-white/90 backdrop-blur-xs text-[#54286B] px-2 py-0.5 rounded-full font-bold shadow-xs">
                  {cat.emoji || '🌸'}
                </span>
              </div>

              {/* Bottom Card Title and Counter */}
              <div className="absolute bottom-3 left-3 right-3 text-white">
                <h3 className="font-bold text-sm sm:text-base leading-tight drop-shadow-xs">
                  {cat.name}
                </h3>
                <p className="text-[10px] text-purple-200 font-medium flex items-center gap-1 mt-0.5">
                  <span>{productCount} {productCount === 1 ? 'modelo' : 'modelos'}</span>
                  <span>•</span>
                  <span className="text-emerald-300 font-bold">Ver →</span>
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};
