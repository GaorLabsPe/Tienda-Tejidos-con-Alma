import { CartItem, DeliveryDetails, StoreSettings } from '../types';

export function formatWhatsAppMessage(
  cart: CartItem[],
  delivery: DeliveryDetails,
  settings: StoreSettings
): string {
  const subtotal = cart.reduce((sum, item) => sum + item.totalPrice, 0);
  const deliveryCost = delivery.type === 'delivery' ? (subtotal >= settings.freeDeliveryThreshold ? 0 : settings.deliveryCost) : 0;
  const grandTotal = subtotal + deliveryCost;

  const orderId = 'FLOR-' + Math.floor(1000 + Math.random() * 9000);
  const dateStr = new Date().toLocaleDateString('es-PE', { day: '2-digit', month: 'short', year: 'numeric' });

  let text = `🌻 *¡HOLA! DESEO REALIZAR UN PEDIDO EN ${settings.storeName.toUpperCase()}* 🧶✨\n`;
  text += `━━━━━━━━━━━━━━━━━━━━━\n`;
  text += `📋 *Pedido:* #${orderId} | *Fecha:* ${dateStr}\n\n`;

  text += `🛍️ *PRODUCTOS SELECCIONADOS:*\n`;
  cart.forEach((item, index) => {
    text += `\n*${index + 1}. ${item.product.name}* (x${item.quantity})\n`;
    
    if (item.options.units && item.options.units > 1) {
      text += `   ▫️ *Cantidad:* ${item.options.units} flores\n`;
    }
    if (item.options.selectedColor) {
      text += `   ▫️ *Color:* ${item.options.selectedColor}\n`;
    }
    if (item.options.dedicationText && item.options.dedicationText.trim() !== '') {
      text += `   ▫️ *Dedicatoria:* "${item.options.dedicationText.trim()}"\n`;
    }
    if (item.options.specialInstructions && item.options.specialInstructions.trim() !== '') {
      text += `   ▫️ *Nota:* ${item.options.specialInstructions.trim()}\n`;
    }
    text += `   ▫️ *Subtotal:* ${settings.currencySymbol} ${item.totalPrice.toFixed(2)}\n`;
  });

  text += `\n━━━━━━━━━━━━━━━━━━━━━\n`;
  text += `👤 *DATOS DE ENTREGA:*\n`;
  text += `• *Cliente:* ${delivery.customerName || 'No especificado'}\n`;
  text += `• *WhatsApp:* ${delivery.customerPhone || 'No especificado'}\n`;
  text += `• *Modalidad:* ${delivery.type === 'delivery' ? '🛵 Envío a domicilio' : '🏬 Retiro en Taller'}\n`;
  if (delivery.type === 'delivery' && delivery.address) {
    text += `• *Dirección:* ${delivery.address}\n`;
  }
  if (delivery.deliveryDate) {
    text += `• *Fecha Deseada:* ${delivery.deliveryDate}\n`;
  }
  if (delivery.dedicationMessage) {
    text += `• *Notas:* ${delivery.dedicationMessage}\n`;
  }

  text += `\n━━━━━━━━━━━━━━━━━━━━━\n`;
  text += `💰 *TOTAL A PAGAR:*\n`;
  text += `*TOTAL FINAL: ${settings.currencySymbol} ${grandTotal.toFixed(2)}*\n\n`;
  text += `🌸 *Por favor confirmar disponibilidad y enviarme los datos de pago (Yape / Transferencia). ¡Muchas gracias!* 💕`;

  return text;
}

export function generateWhatsAppLink(
  phoneNumber: string,
  message: string
): string {
  const cleanPhone = phoneNumber.replace(/\D/g, '');
  const encodedText = encodeURIComponent(message);
  return `https://wa.me/${cleanPhone}?text=${encodedText}`;
}
