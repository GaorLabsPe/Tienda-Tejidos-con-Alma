export interface ProductOption {
  id: string;
  name: string;
  priceDelta: number;
}

export interface ProductExtra {
  id: string;
  name: string;
  price: number;
  icon?: string;
  description?: string;
}

export interface Product {
  id: string;
  name: string;
  category: 'girasoles' | 'tulipanes' | 'clasicos' | 'especiales' | 'minis' | 'combos';
  categoryLabel: string;
  price: number;
  originalPrice?: number;
  description: string;
  includes: string[];
  image: string;
  badge?: string;
  isPopular?: boolean;
  isNew?: boolean;
  rating: number;
  reviewCount: number;
  preparationTime: string;
  availableColors?: string[];
  unitTiers?: {
    units: number;
    price: number;
    label: string;
  }[];
  customizableWrapping?: boolean;
  customizableRibbon?: boolean;
  defaultExtras?: string[];
}

export interface CartItemOption {
  units?: number;
  selectedColor?: string;
  wrapping?: string;
  ribbon?: string;
  extras: { id: string; name: string; price: number }[];
  dedicationText?: string;
  recipientName?: string;
  senderName?: string;
  deliveryDate?: string;
  deliveryTime?: string;
  photoUploaded?: boolean;
  specialInstructions?: string;
}

export interface CartItem {
  cartItemId: string;
  product: Product;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  options: CartItemOption;
}

export interface DeliveryDetails {
  customerName: string;
  customerPhone: string;
  city: string;
  type?: 'delivery' | 'pickup';
  recipientName?: string;
  recipientPhone?: string;
  address?: string;
  district?: string;
  reference?: string;
  deliveryDate?: string;
  deliveryTimeSlot?: string;
  dedicationMessage?: string;
  paymentMethod?: 'yape' | 'plin' | 'transferencia' | 'efectivo';
  includeAroma?: boolean;
  includePolaroid?: boolean;
}

export interface StoreSettings {
  storeName: string;
  whatsappNumber: string; // e.g. "51987654321"
  whatsappDisplay: string;
  currency: string;
  currencySymbol: string;
  yapeNumber: string;
  plinNumber: string;
  deliveryCost: number;
  freeDeliveryThreshold: number;
  storeAddress: string;
  openingHours: string;
}
