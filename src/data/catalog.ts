import { Product, ProductExtra, StoreSettings, CategoryItem } from '../types';
import heroTulipsImg from '../assets/images/hero_crochet_tulips_1788106762067.jpg';

export const HERO_FEATURED_IMAGE = heroTulipsImg;

export const DEFAULT_STORE_SETTINGS: StoreSettings = {
  storeName: "Tejidos con Alma 💜",
  whatsappNumber: "51987654321",
  whatsappDisplay: "+51 987 654 321",
  currency: "PEN",
  currencySymbol: "S/",
  yapeNumber: "987 654 321",
  plinNumber: "987 654 321",
  deliveryCost: 8.00,
  freeDeliveryThreshold: 75.00,
  storeAddress: "Taller Artesanal - Entregas a todo Lima y Perú",
  openingHours: "Lunes a Domingo: 8:00 AM - 10:00 PM"
};

export const AVAILABLE_WRAPPINGS = [
  { id: 'coreano-blanco', name: 'Papel Coreano Blanco / Crema', description: 'Elegante y delicado con acabado satinado', extraPrice: 0 },
  { id: 'kraft-vintage', name: 'Papel Kraft Rústico', description: 'Toque natural y cálido artesanal', extraPrice: 0 },
  { id: 'negro-lujo', name: 'Papel Negro Mate Luxury', description: 'Alto contraste dramático y sofisticado', extraPrice: 2 },
  { id: 'periodico-vintage', name: 'Papel Periódico Estilo Francés', description: 'Vintage romántico clásico', extraPrice: 0 },
  { id: 'rosa-pastel', name: 'Papel Rosa Pastel & Dorado', description: 'Tierno y romántico con bordes dorados', extraPrice: 0 },
  { id: 'cono-fucsia', name: 'Cono Fucsia & Tul', description: 'Diseño moderno y alegre', extraPrice: 0 },
];

export const AVAILABLE_RIBBONS = [
  { id: 'dorado-tela', name: 'Lazo Dorado Satinado', colorHex: '#EAB308' },
  { id: 'verde-oliva', name: 'Cinta de Tela Verde Oliva', colorHex: '#65A30D' },
  { id: 'amarillo-sol', name: 'Cinta Amarilla Brillante', colorHex: '#FACC15' },
  { id: 'organza-blanco', name: 'Lazo de Organza Blanco Nieve', colorHex: '#F8FAFC' },
  { id: 'morado-lila', name: 'Cinta Morado / Lila Pastel', colorHex: '#C084FC' },
  { id: 'rojo-pasion', name: 'Lazo Rojo Carmesí', colorHex: '#EF4444' },
];

export const AVAILABLE_EXTRAS: ProductExtra[] = [
  { id: 'abejita-extra', name: 'Abejita tejida a mano 🐝', price: 5.00, description: 'Tierna abejita crochet para acompañar el ramo' },
  { id: 'mariposa-3d', name: 'Mariposa 3D Dorada / Monarca 🦋', price: 3.00, description: 'Detalle brillante decorativo en las flores' },
  { id: 'pollito-crochet', name: 'Pollito tierno tejido 🐥', price: 7.00, description: 'Amigurumi suave para un toque adorable' },
  { id: 'luces-led', name: 'Luces Hada LED Cálidas ✨', price: 6.00, description: 'Ilumina el ramo mágicamente (incluye pilas)' },
  { id: 'base-madera', name: 'Base de Madera Natural 🪵', price: 5.00, description: 'Para sostener y exhibir amigurumis o cúpulas' },
  { id: 'foto-polaroid-extra', name: 'Foto tipo Polaroid Adicional 📷', price: 3.50, description: 'Impresión en alta calidad con frase al reverso' },
  { id: 'aroma-floral', name: 'Aroma de Flor Premium Gratuito 🌸', price: 0.00, description: 'Esencia delicada suave aplicada antes del empaque' },
  { id: 'chocolates-ferrero', name: 'Mini pack Chocolates Ferrero (x3) 🍫', price: 9.00, description: 'El complemento dulce ideal para tu detalle' },
];

export const DEDICATION_TEMPLATES = [
  {
    category: "Amor & Pareja",
    templates: [
      "Para la persona que ilumina cada uno de mis días. ¡Te amo con todo mi corazón! ❤️🌻",
      "Las flores naturales se marchitan, pero estas flores tejidas con amor durarán para siempre, como lo que siento por ti. ✨🌷",
      "Un rayito de sol tejido que lleva alegría a tu corazón. Gracias por existir. 💛"
    ]
  },
  {
    category: "Cumpleaños",
    templates: [
      "¡Feliz cumpleaños! Que la vida te sonría siempre y se llene de colores y momentos eternos como estas flores. 🎂🎉",
      "Celebrando tu vida y la hermosa persona que eres. ¡Que todos tus sueños se hagan realidad! 🌸✨"
    ]
  },
  {
    category: "Amistad & Agradecimiento",
    templates: [
      "Gracias por estar siempre ahí, por tus risas y tu apoyo incondicional. Eres una persona muy especial. 🐝💛",
      "Un detalle tejido con mucho cariño para alegrar tu día. ¡Te quiero mucho amiga/o! 💐"
    ]
  },
  {
    category: "Flores Amarillas (21 Sept / 21 Mar)",
    templates: [
      "Ella sabía que él sabía, que algún día pasaría, que vendría a buscarla con sus flores amarillas... 🌻💛✨",
      "Para que nunca te falte la alegría ni la magia de las flores amarillas. 💛"
    ]
  }
];

export const PRODUCTS: Product[] = [
  {
    id: 'ramo-tulipanes-amarillos-glow',
    name: 'Ramo Tulipanes Amarillos Glow',
    category: 'tulipanes',
    categoryLabel: 'Tulipanes',
    price: 38.00,
    originalPrice: 45.00,
    description: 'Ramo artesanal de 6 tulipanes amarillos tejidos a crochet con hojas de hilo verde, envuelto en fino papel coreano rosa pastel con lazo de organza y mariposa 3D dorada.',
    includes: [
      '6 Tulipanes amarillos tejidos a crochet',
      'Hojas verdes con tallos moldeables',
      'Papel coreano rosa pastel premium',
      'Lazo de organza transparente delicado',
      'Mariposa 3D dorada decorativa',
      'Tarjeta dedicatoria + Foto Polaroid gratis'
    ],
    image: heroTulipsImg,
    badge: 'Destacado de Portada 🌻',
    isPopular: true,
    isNew: true,
    rating: 5.0,
    reviewCount: 84,
    preparationTime: 'Stock disponible / Entrega Hoy',
    customizableWrapping: true,
    customizableRibbon: true,
    unitTiers: [
      { units: 3, price: 25.00, label: '3 Tulipanes' },
      { units: 6, price: 38.00, label: '6 Tulipanes' },
      { units: 10, price: 58.00, label: '10 Tulipanes' },
    ],
    availableColors: ['Amarillo Sol', 'Rosa Pastel', 'Lila', 'Rojo Pasión', 'Blanco Puro'],
    defaultExtras: ['Tarjeta dedicatoria', 'Foto polaroid', 'Aroma floral']
  },
  {
    id: 'girasol-abejita',
    name: 'Ramo Girasol Abejita',
    category: 'girasoles',
    categoryLabel: 'Girasoles',
    price: 37.00,
    originalPrice: 42.00,
    description: 'Ramo de 2 girasoles grandes tejidos a crochet junto con 2 margaritas medianas y una abejita pequeña. Envuelto en papel coreano con lazo de cinta de tela satinada.',
    includes: [
      '2 Girasoles tejidos antialérgicos',
      '2 Margaritas medianas',
      '1 Abejita tejida 3D',
      'Papel coreano premium',
      'Tarjeta dedicatoria + Foto Polaroid gratis',
      'Lazo de cinta de tela (verde o amarilla)'
    ],
    image: 'https://images.unsplash.com/photo-1597848212624-a19eb35e2651?auto=format&fit=crop&w=800&q=80',
    badge: 'Más Vendido 🌟',
    isPopular: true,
    rating: 4.9,
    reviewCount: 68,
    preparationTime: 'Listo para hoy / 24 hrs',
    customizableWrapping: true,
    customizableRibbon: true,
    defaultExtras: ['Tarjeta dedicatoria', 'Foto polaroid', 'Aroma de flor']
  },
  {
    id: 'snoopy-crochet',
    name: 'Snoopy Crochet con Mini Ramo',
    category: 'especiales',
    categoryLabel: 'Especiales',
    price: 40.00,
    originalPrice: 45.00,
    description: 'Tierno Snoopy de 13 cm tejido artesanalmente con hilo chenille ultrasuave antialérgico, sosteniendo su mini ramito de girasoles tejidos.',
    includes: [
      'Snoopy 13cm tejido en chenille suave',
      'Mini ramito de girasoles a crochet',
      'Tarjeta dedicatoria personalizada + Foto',
      'Opción de base de madera (+S/5.00)'
    ],
    image: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=800&q=80',
    badge: 'Edición Ternura 🐶',
    isPopular: true,
    isNew: true,
    rating: 5.0,
    reviewCount: 42,
    preparationTime: '24 a 48 hrs',
    customizableWrapping: false,
    customizableRibbon: true
  },
  {
    id: 'rayito-de-amor',
    name: 'Ramo Rayito de Amor',
    category: 'girasoles',
    categoryLabel: 'Girasoles',
    price: 40.00,
    description: 'Ramo de 3 girasoles grandes y 2 margaritas medianas envueltos en papel coreano color blanco y tul emperlado. Incluye tarjeta con dedicatoria y foto.',
    includes: [
      '3 Girasoles grandes tejidos',
      '2 Margaritas medianas',
      'Papel coreano blanco y tul emperlado',
      'Tarjeta de dedicatoria + Foto Polaroid',
      'Lazo de cinta de tela'
    ],
    image: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=800&q=80',
    badge: 'Favorito 💛',
    isPopular: true,
    rating: 4.9,
    reviewCount: 54,
    preparationTime: 'Entrega hoy o programada',
    customizableWrapping: true,
    customizableRibbon: true
  },
  {
    id: 'girasol-encapsulado',
    name: 'Girasol Encapsulado con Luces LED',
    category: 'especiales',
    categoryLabel: 'Especiales',
    price: 30.00,
    originalPrice: 35.00,
    description: 'Girasol clásico de 15cm tejido a crochet dentro de una cúpula acrílica transparente con base y guirnalda de luces LED hada cálidas.',
    includes: [
      'Girasol tejido de 15cm',
      'Cúpula acrílica protectora transparente',
      'Luces LED hada cálidas (pilas incluidas)',
      'Tarjeta de dedicatoria + Foto Polaroid'
    ],
    image: 'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?auto=format&fit=crop&w=800&q=80',
    badge: 'Incluye Luces ✨',
    isPopular: true,
    rating: 4.9,
    reviewCount: 39,
    preparationTime: 'Stock inmediato',
    customizableWrapping: false,
    customizableRibbon: true
  },
  {
    id: 'ramo-duo-abejita',
    name: 'Ramo Dúo con Abejita & Mini Girasoles',
    category: 'clasicos',
    categoryLabel: 'Ramos Clásicos',
    price: 28.00,
    description: 'Tulipanes clásicos combinados con una tierna abejita tejida y 3 mini girasoles, envueltos en papel coreano con luces y lazo satinado.',
    includes: [
      'Tulipanes clásicos a crochet',
      '1 Abejita pequeña tejida',
      '3 Mini girasoles',
      'Luces decorativas',
      'Tarjeta de dedicatoria + Foto'
    ],
    image: 'https://images.unsplash.com/photo-1526047932273-341f2a7631f9?auto=format&fit=crop&w=800&q=80',
    badge: 'Económico & Lindo 🐝',
    rating: 4.8,
    reviewCount: 31,
    preparationTime: '24 hrs',
    customizableWrapping: true,
    customizableRibbon: true
  },
  {
    id: 'mi-dulce-margarita',
    name: 'Ramo Mi Dulce Margarita',
    category: 'tulipanes',
    categoryLabel: 'Tulipanes',
    price: 39.50,
    description: '“Un rayo de sol tejido que lleva alegría a tu corazón.” 2 tulipanes amarillos, 1 margarita central, mariposa 3D dorada, tarjeta dedicatoria y envoltura coreana.',
    includes: [
      '2 Tulipanes tejidos amarillos',
      '1 Margarita central',
      'Mariposa dorada decorativa',
      'Tarjeta dedicatoria',
      'Envoltura coreana pastel'
    ],
    image: 'https://images.unsplash.com/photo-1582794543139-8ac9cb0f7b11?auto=format&fit=crop&w=800&q=80',
    badge: 'Top Regalos 🌼',
    rating: 4.9,
    reviewCount: 47,
    preparationTime: 'Listo en 24h',
    customizableWrapping: true,
    customizableRibbon: true
  },
  {
    id: 'ramo-tulip-deluxe',
    name: 'Ramo Tulip con Mini Margaritas',
    category: 'tulipanes',
    categoryLabel: 'Tulipanes',
    price: 44.50,
    description: 'Hermoso ramo compuesto por 3 tulipanes amarillos radiantes y 3 mini margaritas blancas con follaje verde, envoltura coreana o cajita con lazo.',
    includes: [
      '3 Tulipanes tejidos',
      '3 Mini margaritas blancas',
      '1 Tarjeta dedicatoria',
      'Envoltura coreana o cajita de regalo'
    ],
    image: 'https://images.unsplash.com/photo-1520763185298-1b434c919102?auto=format&fit=crop&w=800&q=80',
    badge: 'Recomendado 🌷',
    rating: 4.9,
    reviewCount: 36,
    preparationTime: 'Entrega hoy o 24 hrs',
    customizableWrapping: true,
    customizableRibbon: true
  },
  {
    id: 'bouquet-negro-premium',
    name: 'Bouquet Negro Mate Luxury Girasol & Tulipanes',
    category: 'especiales',
    categoryLabel: 'Especiales',
    price: 55.00,
    originalPrice: 62.00,
    description: 'Diseño de alto impacto: 1 girasol central de 15cm rodeado de 4 tulipanes amarillos, 2 abejitas flotantes y margaritas en abanico de papel negro mate con lazo blanco de satén.',
    includes: [
      '1 Girasol central grande',
      '4 Tulipanes amarillos',
      '2 Abejitas tejidas',
      'Margaritas de relleno',
      'Papel negro mate de lujo en capas',
      'Lazo blanco de satén',
      'Tarjeta dedicatoria + Foto Polaroid'
    ],
    image: 'https://images.unsplash.com/photo-1508610048659-a06b669e3321?auto=format&fit=crop&w=800&q=80',
    badge: 'Diseño Exclusivo 🖤',
    isPopular: true,
    rating: 5.0,
    reviewCount: 58,
    preparationTime: '24 a 48 hrs',
    customizableWrapping: true,
    customizableRibbon: true
  },
  {
    id: 'ramo-5-tulipanes',
    name: 'Ramo 5 Tulipanes con Mariposa Dorada',
    category: 'tulipanes',
    categoryLabel: 'Tulipanes',
    price: 50.00,
    description: 'Ramillete de 5 tulipanes amarillos tejidos a crochet con delicadas hojas verdes, envueltos en papel rosa pastel con mariposa calada dorada y lazo de organza.',
    includes: [
      '5 Tulipanes tejidos',
      'Hojas verdes crochet',
      'Mariposa dorada calada 3D',
      'Papel coreano rosa pastel',
      'Lazo de organza transparente',
      'Tarjeta de dedicatoria'
    ],
    image: 'https://images.unsplash.com/photo-1589244159943-460088ed5c92?auto=format&fit=crop&w=800&q=80',
    badge: 'Elegante 🦋',
    rating: 4.9,
    reviewCount: 29,
    preparationTime: '24 hrs',
    customizableWrapping: true,
    customizableRibbon: true
  },
  {
    id: 'ramo-girasol-pollito',
    name: 'Ramo Girasoles con Pollito & Abejitas',
    category: 'especiales',
    categoryLabel: 'Especiales',
    price: 48.00,
    description: 'Ramo alegre con 2 girasoles grandes, 1 adorable pollito amigurumi tejido, 1 abejita y mariposas monarca en papel amarillo con lazo dorado.',
    includes: [
      '2 Girasoles grandes a crochet',
      '1 Pollito amigurumi tejido',
      '1 Abejita tejida',
      '2 Mariposas monarca',
      'Papel envoltorio con diseño floral/amarillo',
      'Lazo satinado dorado'
    ],
    image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80',
    badge: 'Super Tierno 🐥',
    rating: 5.0,
    reviewCount: 23,
    preparationTime: '24 hrs',
    customizableWrapping: true,
    customizableRibbon: true
  },
  {
    id: 'ramo-girasol-tulipanes-lila',
    name: 'Ramo Romance Girasol & Tulipanes Lila',
    category: 'clasicos',
    categoryLabel: 'Ramos Clásicos',
    price: 40.00,
    description: '1 girasol brillante con 2 tulipanes en tonos lila y rosa palo, envueltos en cono fucsia con borde dorado y hermoso lazo morado.',
    includes: [
      '1 Girasol mediano tejido',
      '1 Tulipán lila pastel',
      '1 Tulipán rosa tierno',
      'Cono fucsia con marco dorado',
      'Lazo de cinta morada',
      'Tarjeta dedicatoria'
    ],
    image: 'https://images.unsplash.com/photo-1561181286-d3fee7d55364?auto=format&fit=crop&w=800&q=80',
    badge: 'Colores Pasteles 💜',
    rating: 4.8,
    reviewCount: 21,
    preparationTime: '24 hrs',
    customizableWrapping: true,
    customizableRibbon: true
  },
  {
    id: 'ramo-tulipanes-vintage',
    name: 'Ramo 3 Tulipanes Vintage Periódico',
    category: 'tulipanes',
    categoryLabel: 'Tulipanes',
    price: 40.00,
    description: '3 tulipanes en degradé amarillo, crema y ocre, envueltos en papel periódico estilo francés con mariposa dorada y cinta dorada.',
    includes: [
      '3 Tulipanes en tonos cálidos/crema',
      'Papel periódico literario vintage',
      'Mariposa dorada 3D',
      'Lazo dorado de satén',
      'Tarjeta dedicatoria'
    ],
    image: 'https://images.unsplash.com/photo-1587314168485-3236d6710814?auto=format&fit=crop&w=800&q=80',
    badge: 'Estilo Francés 📰',
    rating: 4.9,
    reviewCount: 33,
    preparationTime: 'Stock listo para hoy',
    customizableWrapping: true,
    customizableRibbon: true
  },
  {
    id: 'ramo-1-tulipan',
    name: 'Ramo Individual de 1 Tulipán (20cm)',
    category: 'tulipanes',
    categoryLabel: 'Tulipanes',
    price: 18.00,
    description: '1 tulipán de 20cm tejido con hilo antialérgico, envoltura cono coreano con mariposa brillante, tarjeta dedicatoria y aroma floral.',
    includes: [
      '1 Tulipán de 20 cm',
      'Envoltorio cono elegante',
      'Mariposa decorativa',
      'Tarjeta dedicatoria',
      'Aroma de flor'
    ],
    image: 'https://images.unsplash.com/photo-1527061011665-3652c757a4d4?auto=format&fit=crop&w=800&q=80',
    badge: 'Detalle Perfecto 🌷',
    rating: 4.9,
    reviewCount: 52,
    preparationTime: 'Stock inmediato',
    availableColors: ['Amarillo Sol', 'Rojo Pasión', 'Lila Suave', 'Rosa Pastel', 'Crema Vainilla'],
    customizableWrapping: true,
    customizableRibbon: true
  },
  {
    id: 'ramo-1-girasol',
    name: 'Ramo Individual de 1 Girasol (20cm)',
    category: 'girasoles',
    categoryLabel: 'Girasoles',
    price: 23.00,
    description: '1 girasol de 20cm tejido con hilo antialérgico, envoltura coreana con lazo amarillo, tarjeta dedicatoria y aroma de flor.',
    includes: [
      '1 Girasol de 20 cm',
      'Envoltorio coreano en capas',
      'Tarjeta dedicatoria',
      'Aroma de flor',
      'Lazo amarillo o verde'
    ],
    image: 'https://images.unsplash.com/photo-1597848212624-a19eb35e2651?auto=format&fit=crop&w=800&q=80',
    badge: 'Luz & Alegría 🌻',
    rating: 4.9,
    reviewCount: 45,
    preparationTime: 'Stock inmediato',
    customizableWrapping: true,
    customizableRibbon: true
  },
  {
    id: 'ramo-1-mini-tulipan',
    name: 'Ramo 1 Mini Tulipán (10cm)',
    category: 'minis',
    categoryLabel: 'Minis & Llaveros',
    price: 8.00,
    description: 'Tierno mini tulipán de 10cm tejido a crochet, presentado en cono miniatura con tarjeta dedicatoria y aroma de flor.',
    includes: [
      '1 Mini tulipán de 10 cm',
      'Tarjeta dedicatoria pequeña',
      'Envoltorio mini cono',
      'Aroma de flor'
    ],
    image: 'https://images.unsplash.com/photo-1520763185298-1b434c919102?auto=format&fit=crop&w=800&q=80',
    badge: 'Super Económico 🌸',
    rating: 4.8,
    reviewCount: 64,
    preparationTime: 'Stock inmediato',
    availableColors: ['Rosa', 'Amarillo', 'Rojo', 'Lila', 'Azul'],
    customizableWrapping: false,
    customizableRibbon: true
  },
  {
    id: 'ramo-1-mini-girasol',
    name: 'Ramo 1 Mini Girasol (10cm)',
    category: 'minis',
    categoryLabel: 'Minis & Llaveros',
    price: 10.00,
    description: 'Mini girasol tejido de 10cm en arpillera y papel con lazo rojo o amarillo. Incluye tarjeta dedicatoria pequeña y aroma floral.',
    includes: [
      '1 Mini girasol de 10 cm',
      'Tarjeta dedicatoria pequeña',
      'Envoltura rústica / coreana',
      'Aroma de flor'
    ],
    image: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=800&q=80',
    badge: 'Mini Detalle 🌻',
    rating: 4.8,
    reviewCount: 51,
    preparationTime: 'Stock inmediato',
    customizableWrapping: false,
    customizableRibbon: true
  },
  {
    id: 'ramo-flor-lewisia',
    name: 'Ramo Flor Lewisia a Crochet',
    category: 'clasicos',
    categoryLabel: 'Ramos Clásicos',
    price: 15.00,
    description: 'Arreglo vibrante con flor exótica Lewisia tejida a crochet con pétalos amarillos y centro blanco, envuelto en papel coreano con dedicatoria.',
    includes: [
      '1 Flor Lewisia tejida a mano',
      'Hojas verdes crochet',
      'Envoltorio coreano con dibujos',
      'Tarjeta dedicatoria',
      'Lazo de cinta de tela'
    ],
    image: 'https://images.unsplash.com/photo-1533616688419-b7a585564566?auto=format&fit=crop&w=800&q=80',
    badge: 'Flor Especial 🌼',
    rating: 4.9,
    reviewCount: 19,
    preparationTime: '24 hrs',
    customizableWrapping: true,
    customizableRibbon: true
  },
  {
    id: 'pack-tulipanes-por-unidad',
    name: 'Ramo de Tulipanes (Personaliza Cantidad)',
    category: 'combos',
    categoryLabel: 'Combos & Packs',
    price: 15.00,
    description: 'Tulipanes tejidos a crochet con colores a tu elección. Elige la cantidad que prefieras con precio especial por pack.',
    includes: [
      'Tulipanes tejidos a mano',
      'Colores a elección (amarillo, rojo, rosa, lila)',
      'Envoltura coreana con lazo satinado',
      'Tarjeta de dedicatoria'
    ],
    image: 'https://images.unsplash.com/photo-1589244159943-460088ed5c92?auto=format&fit=crop&w=800&q=80',
    badge: 'Descuento por Pack 🏷️',
    rating: 4.9,
    reviewCount: 77,
    preparationTime: '24 hrs',
    unitTiers: [
      { units: 1, price: 15.00, label: '1 Unidad (S/ 15.00)' },
      { units: 3, price: 35.00, label: '3 Unidades (S/ 35.00 - Ahorras S/10)' },
      { units: 6, price: 65.00, label: '6 Unidades (S/ 65.00 - Ahorras S/25)' }
    ],
    availableColors: ['Amarillo Radiante', 'Rojo Pasión', 'Rosa Bebé', 'Lila Suave', 'Crema'],
    customizableWrapping: true,
    customizableRibbon: true
  },
  {
    id: 'pack-rosas-crochet',
    name: 'Ramo de Rosas Tejidas (Personaliza Cantidad)',
    category: 'combos',
    categoryLabel: 'Combos & Packs',
    price: 20.00,
    description: 'Elegantes rosas tejidas a crochet con pétalos detallados en capas. Disponible en amarillo sol, rojo carmesí, blanco o rosado.',
    includes: [
      'Rosas a crochet con pétalos en relieve',
      'Tallo con hojas verdes',
      'Envoltura de lujo con lazo de satén',
      'Tarjeta de dedicatoria personalizada'
    ],
    image: 'https://images.unsplash.com/photo-1559563458-527698bf5295?auto=format&fit=crop&w=800&q=80',
    badge: 'Rosas Eternas 🌹',
    rating: 5.0,
    reviewCount: 63,
    preparationTime: '24 a 48 hrs',
    unitTiers: [
      { units: 1, price: 20.00, label: '1 Unidad (S/ 20.00)' },
      { units: 3, price: 50.00, label: '3 Unidades (S/ 50.00 - Ahorras S/10)' },
      { units: 6, price: 90.00, label: '6 Unidades (S/ 90.00 - Ahorras S/30)' }
    ],
    availableColors: ['Rojo Clásico', 'Amarillo Sol', 'Rosa Pastel', 'Blanco Puro'],
    customizableWrapping: true,
    customizableRibbon: true
  },
  {
    id: 'pack-girasoles-por-unidad',
    name: 'Ramo de Girasoles (Personaliza Cantidad)',
    category: 'combos',
    categoryLabel: 'Combos & Packs',
    price: 20.00,
    description: 'Girasoles tejidos de alta calidad con pétalos texturizados y centro bordado. Arma ramos de 1, 3 o 6 girasoles.',
    includes: [
      'Girasoles grandes tejidos',
      'Envoltura coreana con lazo de tela',
      'Tarjeta dedicatoria + Foto Polaroid',
      'Aroma floral'
    ],
    image: 'https://images.unsplash.com/photo-1597848212624-a19eb35e2651?auto=format&fit=crop&w=800&q=80',
    badge: 'Favorito Clásico 🌻',
    rating: 5.0,
    reviewCount: 84,
    preparationTime: 'Stock / 24 hrs',
    unitTiers: [
      { units: 1, price: 20.00, label: '1 Girasol (S/ 20.00)' },
      { units: 3, price: 50.00, label: '3 Girasoles (S/ 50.00 - Ahorras S/10)' },
      { units: 6, price: 90.00, label: '6 Girasoles (S/ 90.00 - Ahorras S/30)' }
    ],
    customizableWrapping: true,
    customizableRibbon: true
  }
];

export const DEFAULT_CATEGORIES: CategoryItem[] = [
  { 
    id: 'girasoles', 
    name: 'Girasoles', 
    fullName: 'Ramos con Girasol',
    emoji: '🌻', 
    subtitle: 'Eternos & luz',
    image: 'https://images.unsplash.com/photo-1597848212624-a19eb35e2651?auto=format&fit=crop&w=800&q=80',
  },
  { 
    id: 'tulipanes', 
    name: 'Tulipanes', 
    fullName: 'Tulipanes Crochet',
    emoji: '🌷', 
    subtitle: 'Variedad de colores',
    image: heroTulipsImg,
  },
  { 
    id: 'clasicos', 
    name: 'Ramos Clásicos', 
    fullName: 'Rosas & Ramos Clásicos',
    emoji: '💐', 
    subtitle: 'Elegantes & eternos',
    image: 'https://images.unsplash.com/photo-1563241527-3004b7be0ffd?auto=format&fit=crop&w=800&q=80',
  },
  { 
    id: 'especiales', 
    name: 'Con Luces LED', 
    fullName: 'Especiales & Cúpulas LED',
    emoji: '✨', 
    subtitle: 'Brillo mágico',
    image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80',
  },
  { 
    id: 'minis', 
    name: 'Minis & Llaveros', 
    fullName: 'Minis & Amigurumis',
    emoji: '🌸', 
    subtitle: 'Detalles tiernos',
    image: 'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&w=800&q=80',
  },
  { 
    id: 'combos', 
    name: 'Packs x Cantidad', 
    fullName: 'Packs x 1, 3 o 6 Unid.',
    emoji: '🏷️', 
    subtitle: 'Precios especiales',
    image: 'https://images.unsplash.com/photo-1526047932273-341f2a7631f9?auto=format&fit=crop&w=800&q=80',
  },
];

export const CATEGORIES = [
  { 
    id: 'todos', 
    name: 'Todos', 
    fullName: 'Todos los Ramos',
    emoji: '✨', 
    subtitle: 'Catálogo completo',
    image: heroTulipsImg,
    count: PRODUCTS.length 
  },
  ...DEFAULT_CATEGORIES
];

export const REVIEWS = [
  {
    id: '1',
    author: 'Luciana M.',
    rating: 5,
    date: 'Ayer',
    productName: 'Ramo Girasol Abejita',
    comment: '¡Quedó bellísimo! Se lo regalé a mi novia por su aniversario y lloró de la emoción. La abejita tejida es un detalle súper tierno y el pedido por WhatsApp fue rapidísimo.',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80'
  },
  {
    id: '2',
    author: 'Carlos G.',
    rating: 5,
    date: 'Hace 3 días',
    productName: 'Snoopy Crochet con Mini Ramo',
    comment: 'El material chenille es ultra suave y la tarjetita con la foto Polaroid personalizada quedó perfecta. 100% recomendado.',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80'
  },
  {
    id: '3',
    author: 'Valeria R.',
    rating: 5,
    date: 'Hace 5 días',
    productName: 'Bouquet Negro Mate Luxury',
    comment: 'El contraste de los girasoles amarillos con el papel negro y las luces led es una obra de arte. Me llegó en menos de 24 horas.',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80'
  }
];

export const FAQS = [
  {
    question: '¿Por qué elegir flores tejidas a crochet?',
    answer: 'Nuestras flores son eternas: nunca se marchitan ni pierden su forma ni color. Además son tejidas 100% a mano con hilos antialérgicos de primera calidad y llevan un agradable aroma floral duradero.'
  },
  {
    question: '¿Cómo funciona el pedido directo a WhatsApp?',
    answer: 'Agregas tus flores favoritas al carrito o armas tu ramo personalizado, eliges el papel, lazo y dedicatoria con foto. Al presionar "Hacer Pedido por WhatsApp", se abre un chat listo con todos los datos detallados para coordinar el pago por Yape, Plin o transferencia y la entrega.'
  },
  {
    question: '¿Con cuánta anticipación debo realizar mi pedido?',
    answer: 'Tenemos modelos en stock para entrega el mismo día (express). Para pedidos personalizados con amigurumis o colores específicos, recomendamos pedir con 24 a 48 horas de anticipación.'
  },
  {
    question: '¿Qué incluye la dedicatoria y foto polaroid?',
    answer: 'Todos los ramos medianos y grandes incluyen GRATIS una tarjeta impresa con el mensaje que elijas y una mini foto estilo Polaroid para que tu detalle sea inolvidable.'
  },
  {
    question: '¿Cuáles son los métodos de pago aceptados?',
    answer: 'Aceptamos Yape, Plin, Transferencias bancarias BCP, BBVA, Interbank y pago contraentrega en puntos céntricos coordinados.'
  }
];
