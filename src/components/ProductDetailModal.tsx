import React, { useState, useEffect } from 'react';
import { Product, CartItemOption } from '../types';
import { X, Plus, Minus } from 'lucide-react';

interface ProductDetailModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (product: Product, quantity: number, options: CartItemOption) => void;
  currencySymbol: string;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  isOpen,
  onClose,
  onAddToCart,
  currencySymbol,
}) => {
  const [quantity, setQuantity] = useState<number>(1);
  const [selectedColor, setSelectedColor] = useState<string>(
    product?.availableColors ? product.availableColors[0] : ''
  );
  const [selectedTierUnits, setSelectedTierUnits] = useState<number>(
    product?.unitTiers ? product.unitTiers[0].units : 1
  );
  const [dedicationText, setDedicationText] = useState<string>('');

  useEffect(() => {
    if (product) {
      setQuantity(1);
      setSelectedColor(product.availableColors ? product.availableColors[0] : '');
      setSelectedTierUnits(product.unitTiers ? product.unitTiers[0].units : 1);
      setDedicationText('');
    }
  }, [product]);

  if (!isOpen || !product) return null;

  let unitPrice = product.price;
  if (product.unitTiers) {
    const tier = product.unitTiers.find((t) => t.units === selectedTierUnits);
    if (tier) unitPrice = tier.price;
  }

  const totalPrice = unitPrice * quantity;

  const handleAdd = () => {
    const options: CartItemOption = {
      units: product.unitTiers ? selectedTierUnits : undefined,
      selectedColor: selectedColor || undefined,
      dedicationText: dedicationText.trim() || undefined,
      extras: [],
    };
    onAddToCart(product, quantity, options);
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end justify-center animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-white rounded-t-3xl shadow-2xl flex flex-col max-h-[88dvh] overflow-hidden animate-in slide-in-from-bottom duration-200 border-t border-[#EFE5F5]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Mobile top pill handle */}
        <div className="w-12 h-1 bg-[#E8DAF2] rounded-full mx-auto my-2 shrink-0"></div>

        {/* Top image & close button */}
        <div className="relative h-44 sm:h-48 w-full bg-[#FAF5FC] shrink-0">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
          />
          <button
            onClick={onClose}
            className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-white/90 text-stone-800 flex items-center justify-center font-bold shadow-md active:scale-95 transition-transform cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
          {product.badge && (
            <span className="absolute bottom-3 left-3 bg-[#653977] text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-xs">
              {product.badge}
            </span>
          )}
        </div>

        {/* Content Details */}
        <div className="p-4 overflow-y-auto space-y-4 flex-1">
          <div>
            <div className="flex items-baseline justify-between gap-2">
              <h2 className="text-base font-bold text-stone-900">{product.name}</h2>
              <span className="text-base font-extrabold text-[#502763] shrink-0">
                {currencySymbol} {unitPrice.toFixed(2)}
              </span>
            </div>
            <p className="text-xs text-stone-500 mt-1 leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Unit Tiers Selection */}
          {product.unitTiers && product.unitTiers.length > 0 && (
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-stone-700 block">
                Selecciona la cantidad de flores:
              </label>
              <div className="grid grid-cols-2 gap-2">
                {product.unitTiers.map((tier) => (
                  <button
                    key={tier.units}
                    type="button"
                    onClick={() => setSelectedTierUnits(tier.units)}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-between transition-all cursor-pointer ${
                      selectedTierUnits === tier.units
                        ? 'border-[#653977] bg-[#FAF3FD] text-[#502763] shadow-xs'
                        : 'border-stone-200 hover:border-[#E4D2F2] text-stone-600 bg-white'
                    }`}
                  >
                    <span>{tier.units} {tier.units === 1 ? 'Flor' : 'Flores'}</span>
                    <span className="font-extrabold text-[#653977]">
                      {currencySymbol} {tier.price.toFixed(2)}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Color Selection */}
          {product.availableColors && product.availableColors.length > 0 && (
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-stone-700 block">
                Color de flor / ramo:
              </label>
              <div className="flex flex-wrap gap-2">
                {product.availableColors.map((col) => (
                  <button
                    key={col}
                    type="button"
                    onClick={() => setSelectedColor(col)}
                    className={`py-1.5 px-3 rounded-full text-xs font-bold border transition-all cursor-pointer ${
                      selectedColor === col
                        ? 'bg-[#653977] text-white border-[#653977] shadow-xs'
                        : 'bg-stone-50 text-stone-700 border-stone-200 hover:border-[#DFC7ED]'
                    }`}
                  >
                    {col}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Dedication Textarea */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-stone-700 block flex items-center justify-between">
              <span>Dedicatoria para la tarjeta (Opcional):</span>
              <span className="text-[10px] text-stone-400 font-normal">Gratis</span>
            </label>
            <textarea
              rows={2}
              value={dedicationText}
              onChange={(e) => setDedicationText(e.target.value)}
              placeholder="Escribe el mensaje o nombre para la dedicatoria..."
              className="w-full text-xs p-2.5 rounded-xl border border-[#E9DAF2] focus:border-[#653977] focus:ring-1 focus:ring-[#653977] outline-hidden resize-none bg-[#FCFAFE]"
            />
          </div>

          {/* Quantity selector */}
          <div className="flex items-center justify-between pt-2 border-t border-[#F5EDFA]">
            <span className="text-xs font-bold text-stone-700">Cantidad de Ramos:</span>
            <div className="flex items-center gap-3 bg-[#FAF5FC] p-1 rounded-xl border border-[#EFE5F5]">
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="w-7 h-7 rounded-lg bg-white text-[#502763] flex items-center justify-center font-bold shadow-2xs active:scale-95 transition-transform cursor-pointer"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="text-xs font-black text-stone-900 w-4 text-center">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => setQuantity((q) => q + 1)}
                className="w-7 h-7 rounded-lg bg-[#653977] text-white flex items-center justify-center font-bold shadow-2xs active:scale-95 transition-transform cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5 text-purple-100" />
              </button>
            </div>
          </div>
        </div>

        {/* Bottom CTA Add Button */}
        <div className="p-4 bg-white border-t border-[#F0E4F7] shrink-0">
          <button
            onClick={handleAdd}
            className="w-full py-3.5 px-4 bg-[#653977] hover:bg-[#552965] active:bg-[#451C53] text-white font-bold text-xs sm:text-sm rounded-2xl shadow-md shadow-[#653977]/20 flex items-center justify-between transition-all active:scale-[0.98] cursor-pointer"
          >
            <span>Agregar al Carrito</span>
            <span className="bg-white/20 px-2.5 py-1 rounded-lg">
              {currencySymbol} {totalPrice.toFixed(2)}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
