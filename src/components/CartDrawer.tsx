import React, { useState } from 'react';
import { CartItem, DeliveryDetails, StoreSettings } from '../types';
import { formatWhatsAppMessage, generateWhatsAppLink } from '../utils/whatsapp';
import { X, Trash2, Plus, Minus, Send, MapPin, User, Phone, Calendar } from 'lucide-react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onUpdateQuantity: (cartItemId: string, newQuantity: number) => void;
  onRemoveItem: (cartItemId: string) => void;
  onClearCart: () => void;
  settings: StoreSettings;
  deliveryType: 'delivery' | 'pickup';
  onDeliveryTypeChange: (type: 'delivery' | 'pickup') => void;
  onOrderSuccess: (message: string, whatsappUrl: string) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cart,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  settings,
  deliveryType,
  onDeliveryTypeChange,
  onOrderSuccess,
}) => {
  const [customerName, setCustomerName] = useState<string>('');
  const [customerPhone, setCustomerPhone] = useState<string>('');
  const [deliveryAddress, setDeliveryAddress] = useState<string>('');
  const [desiredDate, setDesiredDate] = useState<string>('');
  const [generalNotes, setGeneralNotes] = useState<string>('');

  if (!isOpen) return null;

  const subtotal = cart.reduce((sum, item) => sum + item.totalPrice, 0);

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;

    const deliveryDetails: DeliveryDetails = {
      customerName,
      customerPhone,
      city: 'Lima',
      type: deliveryType,
      address: deliveryAddress,
      deliveryDate: desiredDate,
      dedicationMessage: generalNotes,
    };

    const message = formatWhatsAppMessage(cart, deliveryDetails, settings);
    const whatsappUrl = generateWhatsAppLink(settings.whatsappNumber, message);
    onOrderSuccess(message, whatsappUrl);
  };

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col max-h-[92dvh] overflow-hidden animate-in slide-in-from-bottom duration-200 border border-[#EFE5F5]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="bg-[#653977] p-3.5 sm:p-4 text-white flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-2">
            <span className="text-xl">🛍️</span>
            <div>
              <h2 className="text-sm sm:text-base font-black tracking-wide uppercase">
                Tu Pedido
              </h2>
              <p className="text-[10px] text-purple-100 font-medium">
                {cart.length} {cart.length === 1 ? 'modelo seleccionado' : 'modelos seleccionados'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/15 hover:bg-white/25 text-white flex items-center justify-center font-bold transition-transform active:scale-95 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {cart.length === 0 ? (
          <div className="p-8 text-center space-y-3 my-auto">
            <div className="text-4xl">🌻</div>
            <h3 className="font-bold text-sm text-stone-800">
              Tu carrito está vacío
            </h3>
            <p className="text-xs text-stone-500 max-w-xs mx-auto">
              Añade hermosos ramos a crochet para completar tu pedido especial por WhatsApp.
            </p>
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-[#653977] text-white text-xs font-bold shadow-md hover:bg-[#552965] active:scale-95 cursor-pointer"
            >
              Ver Catálogo
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmitOrder} className="flex flex-col flex-1 overflow-hidden">
            {/* Items List */}
            <div className="p-3.5 overflow-y-auto flex-1 space-y-3 bg-[#FCFAFE]">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-stone-700">Productos ({cart.length})</span>
                <button
                  type="button"
                  onClick={onClearCart}
                  className="text-[11px] font-bold text-red-500 hover:text-red-700 cursor-pointer"
                >
                  Vaciar todo
                </button>
              </div>

              {cart.map((item) => (
                <div
                  key={item.cartItemId}
                  className="bg-white p-3 rounded-2xl border border-[#EFE5F5] shadow-2xs flex gap-2.5 items-center"
                >
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-14 h-14 rounded-xl object-cover shrink-0 bg-[#FAF5FC]"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-xs text-stone-900 truncate">
                      {item.product.name}
                    </h4>
                    <p className="text-[10px] text-stone-500 font-medium truncate">
                      {item.options.units ? `${item.options.units} flores` : ''}
                      {item.options.selectedColor ? ` • ${item.options.selectedColor}` : ''}
                    </p>
                    {item.options.dedicationText && (
                      <p className="text-[10px] text-[#653977] italic truncate">
                        "{item.options.dedicationText}"
                      </p>
                    )}
                    <span className="text-xs font-extrabold text-[#502763] block mt-0.5">
                      {settings.currencySymbol} {item.totalPrice.toFixed(2)}
                    </span>
                  </div>

                  {/* Quantity and Delete */}
                  <div className="flex flex-col items-end gap-1.5 shrink-0">
                    <button
                      type="button"
                      onClick={() => onRemoveItem(item.cartItemId)}
                      className="text-stone-400 hover:text-red-500 transition-colors p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                    <div className="flex items-center gap-1.5 bg-[#FAF5FC] p-0.5 rounded-lg border border-[#EFE5F5]">
                      <button
                        type="button"
                        onClick={() => onUpdateQuantity(item.cartItemId, item.quantity - 1)}
                        className="w-5 h-5 rounded bg-white text-[#502763] flex items-center justify-center text-xs font-bold shadow-2xs"
                      >
                        <Minus className="w-2.5 h-2.5" />
                      </button>
                      <span className="text-xs font-bold w-4 text-center">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => onUpdateQuantity(item.cartItemId, item.quantity + 1)}
                        className="w-5 h-5 rounded bg-[#653977] text-white flex items-center justify-center text-xs font-bold shadow-2xs"
                      >
                        <Plus className="w-2.5 h-2.5 text-purple-100" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {/* Delivery info form */}
              <div className="bg-white p-3 rounded-2xl border border-[#EFE5F5] space-y-2.5 mt-3">
                <div className="flex items-center justify-between pb-1.5 border-b border-[#F5EDFA]">
                  <span className="text-xs font-bold text-stone-800">
                    Método de Entrega
                  </span>
                  <div className="flex gap-1">
                    <button
                      type="button"
                      onClick={() => onDeliveryTypeChange('delivery')}
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-lg transition-colors cursor-pointer ${
                        deliveryType === 'delivery'
                          ? 'bg-[#653977] text-white'
                          : 'bg-stone-100 text-stone-600'
                      }`}
                    >
                      Delivery
                    </button>
                    <button
                      type="button"
                      onClick={() => onDeliveryTypeChange('pickup')}
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-lg transition-colors cursor-pointer ${
                        deliveryType === 'pickup'
                          ? 'bg-[#653977] text-white'
                          : 'bg-stone-100 text-stone-600'
                      }`}
                    >
                      Recojo
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-0.5">
                    <label className="text-[10px] font-bold text-stone-600 flex items-center gap-1">
                      <User className="w-3 h-3 text-[#653977]" />
                      <span>Tu Nombre *</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="Ej. María López"
                      className="w-full text-xs p-2 rounded-xl border border-[#EADBEE] focus:border-[#653977] outline-hidden bg-[#FAF7FC]"
                    />
                  </div>

                  <div className="space-y-0.5">
                    <label className="text-[10px] font-bold text-stone-600 flex items-center gap-1">
                      <Phone className="w-3 h-3 text-[#653977]" />
                      <span>Teléfono / WhatsApp</span>
                    </label>
                    <input
                      type="tel"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      placeholder="987654321"
                      className="w-full text-xs p-2 rounded-xl border border-[#EADBEE] focus:border-[#653977] outline-hidden bg-[#FAF7FC]"
                    />
                  </div>
                </div>

                {deliveryType === 'delivery' && (
                  <div className="space-y-0.5">
                    <label className="text-[10px] font-bold text-stone-600 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-[#653977]" />
                      <span>Dirección de Entrega y Referencia *</span>
                    </label>
                    <input
                      type="text"
                      required={deliveryType === 'delivery'}
                      value={deliveryAddress}
                      onChange={(e) => setDeliveryAddress(e.target.value)}
                      placeholder="Calle, Número, Distrito..."
                      className="w-full text-xs p-2 rounded-xl border border-[#EADBEE] focus:border-[#653977] outline-hidden bg-[#FAF7FC]"
                    />
                  </div>
                )}

                <div className="space-y-0.5">
                  <label className="text-[10px] font-bold text-stone-600 flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-[#653977]" />
                    <span>Fecha deseada de entrega</span>
                  </label>
                  <input
                    type="text"
                    value={desiredDate}
                    onChange={(e) => setDesiredDate(e.target.value)}
                    placeholder="Ej. Hoy por la tarde / Mañana"
                    className="w-full text-xs p-2 rounded-xl border border-[#EADBEE] focus:border-[#653977] outline-hidden bg-[#FAF7FC]"
                  />
                </div>

                <div className="space-y-0.5">
                  <label className="text-[10px] font-bold text-stone-600">
                    Notas adicionales (Opcional)
                  </label>
                  <textarea
                    rows={1}
                    value={generalNotes}
                    onChange={(e) => setGeneralNotes(e.target.value)}
                    placeholder="Instrucciones para el paquete o entrega..."
                    className="w-full text-xs p-2 rounded-xl border border-[#EADBEE] focus:border-[#653977] outline-hidden bg-[#FAF7FC] resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Bottom Checkout Action */}
            <div className="p-3.5 bg-white border-t border-[#F0E4F7] shadow-lg shrink-0 space-y-2">
              <div className="flex items-center justify-between text-xs sm:text-sm">
                <span className="font-bold text-stone-600">Total a Pagar:</span>
                <span className="font-black text-base sm:text-lg text-[#502763]">
                  {settings.currencySymbol} {subtotal.toFixed(2)}
                </span>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 px-4 bg-[#653977] hover:bg-[#552965] active:bg-[#451C53] text-white font-black text-xs sm:text-sm rounded-2xl shadow-lg shadow-[#653977]/25 flex items-center justify-center gap-2 active:scale-[0.98] transition-all cursor-pointer"
              >
                <Send className="w-4 h-4 text-purple-100" />
                <span>Confirmar y Enviar Pedido</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
