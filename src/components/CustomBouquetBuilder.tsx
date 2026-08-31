import React, { useState } from 'react';
import { Product, CartItemOption } from '../types';
import {
  AVAILABLE_WRAPPINGS,
  AVAILABLE_RIBBONS,
  AVAILABLE_EXTRAS,
} from '../data/catalog';
import {
  Sparkles,
  Plus,
  Minus,
  Check,
  X,
  Wand2,
  Flower2,
  Heart,
} from 'lucide-react';

interface CustomBouquetBuilderProps {
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (product: Product, quantity: number, options: CartItemOption) => void;
  currencySymbol: string;
}

interface FlowerSelection {
  type: 'girasol' | 'tulipan' | 'rosa' | 'margarita' | 'lewisia';
  name: string;
  pricePerUnit: number;
  icon: string;
  count: number;
  color: string;
  availableColors: string[];
}

export const CustomBouquetBuilder: React.FC<CustomBouquetBuilderProps> = ({
  isOpen,
  onClose,
  onAddToCart,
  currencySymbol,
}) => {
  const [flowers, setFlowers] = useState<FlowerSelection[]>([
    {
      type: 'girasol',
      name: 'Girasol Tejido Grande',
      pricePerUnit: 12.00,
      icon: '🌻',
      count: 2,
      color: 'Amarillo Clásico',
      availableColors: ['Amarillo Clásico', 'Amarillo Dorado'],
    },
    {
      type: 'tulipan',
      name: 'Tulipán Tejido',
      pricePerUnit: 10.00,
      icon: '🌷',
      count: 2,
      color: 'Amarillo Sol',
      availableColors: ['Amarillo Sol', 'Rojo Pasión', 'Rosa Pastel', 'Lila Suave', 'Crema'],
    },
    {
      type: 'rosa',
      name: 'Rosa de Crochet',
      pricePerUnit: 14.00,
      icon: '🌹',
      count: 0,
      color: 'Rojo Carmesí',
      availableColors: ['Rojo Carmesí', 'Rosa Bebé', 'Blanco Puro', 'Amarillo'],
    },
    {
      type: 'margarita',
      name: 'Margarita Blanca',
      pricePerUnit: 7.00,
      icon: '🌼',
      count: 2,
      color: 'Blanco & Amarillo',
      availableColors: ['Blanco & Amarillo', 'Amarillo Pastel'],
    },
    {
      type: 'lewisia',
      name: 'Flor Lewisia Exótica',
      pricePerUnit: 11.00,
      icon: '🌸',
      count: 0,
      color: 'Amarillo Brillante',
      availableColors: ['Amarillo Brillante', 'Rosa & Crema'],
    },
  ]);

  const [selectedWrapping, setSelectedWrapping] = useState<string>(
    AVAILABLE_WRAPPINGS[0].name
  );
  const [selectedRibbon, setSelectedRibbon] = useState<string>(
    AVAILABLE_RIBBONS[0].name
  );
  const [selectedExtras, setSelectedExtras] = useState<string[]>(['luces-led']);
  const [dedicationText, setDedicationText] = useState<string>('');
  const [recipientName, setRecipientName] = useState<string>('');

  const updateFlowerCount = (type: string, delta: number) => {
    setFlowers((prev) =>
      prev.map((f) => {
        if (f.type === type) {
          const newCount = Math.max(0, f.count + delta);
          return { ...f, count: newCount };
        }
        return f;
      })
    );
  };

  const updateFlowerColor = (type: string, color: string) => {
    setFlowers((prev) =>
      prev.map((f) => (f.type === type ? { ...f, color } : f))
    );
  };

  const toggleExtra = (id: string) => {
    setSelectedExtras((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Calculations
  const totalFlowerCount = flowers.reduce((sum, f) => sum + f.count, 0);
  const flowersPrice = flowers.reduce((sum, f) => sum + f.count * f.pricePerUnit, 0);

  const wrappingObj = AVAILABLE_WRAPPINGS.find((w) => w.name === selectedWrapping);
  const wrappingPrice = wrappingObj ? wrappingObj.extraPrice : 0;

  const extrasObjects = AVAILABLE_EXTRAS.filter((e) => selectedExtras.includes(e.id));
  const extrasPrice = extrasObjects.reduce((sum, e) => sum + e.price, 0);

  // Base assemble & arrangement fee: S/ 10 (or 0 if over 4 flowers)
  const assemblyFee = totalFlowerCount > 0 ? (totalFlowerCount >= 3 ? 5.00 : 8.00) : 0;
  const totalPrice = flowersPrice + wrappingPrice + extrasPrice + assemblyFee;

  const handleFinishCustomBouquet = () => {
    if (totalFlowerCount === 0) {
      alert('Por favor selecciona al menos 1 flor para tu ramo personalizado.');
      return;
    }

    const flowerSummary = flowers
      .filter((f) => f.count > 0)
      .map((f) => `${f.count}x ${f.name} (${f.color})`)
      .join(', ');

    const customProduct: Product = {
      id: `custom-bouquet-${Date.now()}`,
      name: `Ramo Personalizado (${totalFlowerCount} Flores Tejidas)`,
      category: 'especiales',
      categoryLabel: 'Ramo a Medida',
      price: totalPrice,
      description: `Ramo único diseñado a medida: ${flowerSummary}. Envuelto en ${selectedWrapping} con ${selectedRibbon}.`,
      includes: [
        `${totalFlowerCount} Flores seleccionadas a mano`,
        flowerSummary,
        `Envoltura: ${selectedWrapping}`,
        `Lazo: ${selectedRibbon}`,
        'Tarjeta dedicatoria + Foto Polaroid',
        'Aroma floral aplicado'
      ],
      image: 'https://images.unsplash.com/photo-1597848212624-a19eb35e2651?auto=format&fit=crop&w=800&q=80',
      badge: 'Ramo Exclusivo 🎨',
      rating: 5.0,
      reviewCount: 1,
      preparationTime: '24 a 48 hrs'
    };

    const options: CartItemOption = {
      units: totalFlowerCount,
      wrapping: selectedWrapping,
      ribbon: selectedRibbon,
      extras: extrasObjects.map((e) => ({ id: e.id, name: e.name, price: e.price })),
      dedicationText: dedicationText.trim() || undefined,
      recipientName: recipientName.trim() || undefined,
      specialInstructions: `Composición personalizada: ${flowerSummary}`,
    };

    onAddToCart(customProduct, 1, options);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4">
      <div
        className="relative w-full max-w-3xl bg-[#FCF9F2] rounded-3xl shadow-2xl border border-amber-200 overflow-hidden flex flex-col max-h-[92vh] animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-400 p-4 sm:p-6 text-amber-950 flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-950/10 flex items-center justify-center text-2xl shadow-inner">
              🎨
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-black tracking-tight">
                  Taller: Arma tu Ramo Crochet
                </h2>
                <span className="bg-amber-950 text-amber-100 text-[10px] font-black px-2 py-0.5 rounded-full">
                  100% Personalizado
                </span>
              </div>
              <p className="text-xs text-amber-950/80 font-medium">
                Combina flores, colores, accesorios y envoltorios a tu gusto
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-amber-950/10 hover:bg-amber-950/20 text-amber-950 flex items-center justify-center font-bold"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Customizer Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6 flex-1">
          
          {/* Live Bouquet Visual Preview Bar */}
          <div className="bg-gradient-to-r from-amber-100/90 to-orange-100/90 p-4 rounded-3xl border border-amber-300/80 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-2xs">
            <div className="flex items-center gap-3">
              <div className="flex -space-x-2 text-3xl">
                {flowers
                  .filter((f) => f.count > 0)
                  .map((f) => (
                    <span key={f.type} title={`${f.count} ${f.name}`} className="hover:scale-125 transition-transform drop-shadow-xs">
                      {f.icon}
                    </span>
                  ))}
                {totalFlowerCount === 0 && <span className="text-2xl">🌱</span>}
              </div>
              <div>
                <h4 className="text-sm font-black text-amber-950">
                  {totalFlowerCount === 0
                    ? 'Selecciona tus flores abajo 👇'
                    : `${totalFlowerCount} ${totalFlowerCount === 1 ? 'flor' : 'flores'} en tu ramo`}
                </h4>
                <p className="text-xs text-amber-800 font-medium">
                  {flowers
                    .filter((f) => f.count > 0)
                    .map((f) => `${f.count} ${f.name.split(' ')[0]}`)
                    .join(' + ') || 'Aún no has agregado flores'}
                </p>
              </div>
            </div>

            <div className="text-right shrink-0 bg-white/80 px-4 py-2 rounded-2xl border border-amber-200">
              <span className="text-[11px] font-bold text-amber-800 uppercase block">Total Ramo</span>
              <span className="text-xl font-black text-amber-950">
                {currencySymbol} {totalPrice.toFixed(2)}
              </span>
            </div>
          </div>

          {/* STEP 1: Choose Flowers & Quantities */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-black text-amber-950 uppercase tracking-wider flex items-center gap-1.5">
                <Flower2 className="w-4 h-4 text-amber-700" />
                <span>Paso 1: Elige las flores y cantidades</span>
              </h3>
              <span className="text-xs font-bold text-amber-800">
                {totalFlowerCount} seleccionadas
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {flowers.map((flower) => (
                <div
                  key={flower.type}
                  className={`p-3.5 rounded-2xl border-2 transition-all flex flex-col justify-between gap-2.5 ${
                    flower.count > 0
                      ? 'border-amber-400 bg-amber-50/90 shadow-xs'
                      : 'border-amber-200/80 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <span className="text-2xl">{flower.icon}</span>
                      <div>
                        <h4 className="text-xs sm:text-sm font-extrabold text-amber-950">
                          {flower.name}
                        </h4>
                        <p className="text-[11px] font-bold text-amber-800">
                          {currencySymbol} {flower.pricePerUnit.toFixed(2)} c/u
                        </p>
                      </div>
                    </div>

                    {/* Counter */}
                    <div className="flex items-center bg-white rounded-xl border border-amber-200 p-0.5 shadow-2xs">
                      <button
                        onClick={() => updateFlowerCount(flower.type, -1)}
                        disabled={flower.count <= 0}
                        className="w-7 h-7 rounded-lg hover:bg-amber-100 text-amber-950 flex items-center justify-center font-bold disabled:opacity-30"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="w-7 text-center text-xs font-black text-amber-950">
                        {flower.count}
                      </span>
                      <button
                        onClick={() => updateFlowerCount(flower.type, 1)}
                        className="w-7 h-7 rounded-lg hover:bg-amber-100 text-amber-950 flex items-center justify-center font-bold"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Color chooser if count > 0 */}
                  {flower.count > 0 && (
                    <div className="pt-2 border-t border-amber-200/60 flex items-center justify-between gap-2">
                      <span className="text-[10px] font-bold text-amber-900">Color:</span>
                      <select
                        value={flower.color}
                        onChange={(e) => updateFlowerColor(flower.type, e.target.value)}
                        className="text-xs bg-white text-amber-950 rounded-lg px-2 py-1 border border-amber-300 font-semibold focus:outline-none focus:ring-1 focus:ring-amber-400"
                      >
                        {flower.availableColors.map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* STEP 2: Wrapping Style */}
          <div className="space-y-3">
            <h3 className="text-xs font-black text-amber-950 uppercase tracking-wider">
              Paso 2: Elige el Papel y Envoltura Coreana
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {AVAILABLE_WRAPPINGS.map((wrap) => {
                const isSelected = selectedWrapping === wrap.name;
                return (
                  <button
                    key={wrap.id}
                    onClick={() => setSelectedWrapping(wrap.name)}
                    className={`p-3 rounded-2xl text-left border-2 transition-all flex items-start justify-between ${
                      isSelected
                        ? 'border-amber-500 bg-amber-100 text-amber-950 shadow-xs'
                        : 'border-amber-200 bg-white hover:bg-amber-50 text-amber-900'
                    }`}
                  >
                    <div>
                      <p className="font-extrabold text-xs">{wrap.name}</p>
                      <p className="text-[11px] text-amber-800/70">{wrap.description}</p>
                    </div>
                    {wrap.extraPrice > 0 ? (
                      <span className="text-[10px] font-bold text-amber-800 bg-amber-200 px-1.5 py-0.5 rounded-md">
                        +{currencySymbol} {wrap.extraPrice.toFixed(2)}
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold text-emerald-700">Incluido</span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* STEP 3: Ribbon */}
          <div className="space-y-3">
            <h3 className="text-xs font-black text-amber-950 uppercase tracking-wider">
              Paso 3: Elige el Color del Lazo Satinado
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {AVAILABLE_RIBBONS.map((ribbon) => {
                const isSelected = selectedRibbon === ribbon.name;
                return (
                  <button
                    key={ribbon.id}
                    onClick={() => setSelectedRibbon(ribbon.name)}
                    className={`p-2 rounded-xl text-left border transition-all flex items-center gap-2 ${
                      isSelected
                        ? 'border-amber-500 bg-amber-100 text-amber-950 font-black'
                        : 'border-amber-200 bg-white text-amber-900'
                    }`}
                  >
                    <span
                      className="w-4 h-4 rounded-full border border-black/20 shrink-0"
                      style={{ backgroundColor: ribbon.colorHex }}
                    />
                    <span className="text-xs font-semibold truncate">{ribbon.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* STEP 4: Embellishments & Extras */}
          <div className="space-y-3">
            <h3 className="text-xs font-black text-amber-950 uppercase tracking-wider">
              Paso 4: Adicionales y Detalles Especiales
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {AVAILABLE_EXTRAS.map((extra) => {
                const isSelected = selectedExtras.includes(extra.id);
                return (
                  <div
                    key={extra.id}
                    onClick={() => toggleExtra(extra.id)}
                    className={`p-2.5 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between ${
                      isSelected
                        ? 'border-amber-500 bg-amber-100/90 text-amber-950'
                        : 'border-amber-200 bg-white hover:bg-amber-50 text-amber-900'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-4 h-4 rounded border flex items-center justify-center ${
                          isSelected
                            ? 'bg-amber-500 border-amber-600 text-amber-950'
                            : 'border-amber-300 bg-white'
                        }`}
                      >
                        {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                      <span className="text-xs font-bold">{extra.name}</span>
                    </div>
                    <span className="text-xs font-black text-amber-900">
                      {extra.price > 0
                        ? `+${currencySymbol} ${extra.price.toFixed(2)}`
                        : '¡GRATIS!'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* STEP 5: Dedication */}
          <div className="p-4 rounded-2xl bg-amber-100/60 border border-amber-200 space-y-2">
            <h4 className="text-xs font-black text-amber-950 uppercase">
              Paso 5: Tarjeta con Dedicatoria & Nombre (Gratis) 💌
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <input
                type="text"
                value={recipientName}
                onChange={(e) => setRecipientName(e.target.value)}
                placeholder="Nombre de la persona (Ej: Camila)"
                className="p-2 text-xs bg-white rounded-xl border border-amber-200 focus:outline-none focus:ring-1 focus:ring-amber-400 font-medium"
              />
              <input
                type="text"
                value={dedicationText}
                onChange={(e) => setDedicationText(e.target.value)}
                placeholder="Mensaje de la tarjeta (Ej: ¡Te amo mucho!)"
                className="p-2 text-xs bg-white rounded-xl border border-amber-200 focus:outline-none focus:ring-1 focus:ring-amber-400 font-medium"
              />
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 sm:p-5 bg-white border-t border-amber-200 flex items-center justify-between gap-3 shadow-lg">
          <div className="flex flex-col">
            <span className="text-xs font-bold text-amber-800">
              {totalFlowerCount} flores tejidas
            </span>
            <span className="text-xl sm:text-2xl font-black text-amber-950">
              {currencySymbol} {totalPrice.toFixed(2)}
            </span>
          </div>

          <button
            onClick={handleFinishCustomBouquet}
            disabled={totalFlowerCount === 0}
            className="flex-1 max-w-xs flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-amber-950 font-black text-sm shadow-md hover:shadow-lg transition-all disabled:opacity-50"
          >
            <Sparkles className="w-4 h-4" />
            <span>Agregar Ramo al Pedido</span>
          </button>
        </div>
      </div>
    </div>
  );
};
