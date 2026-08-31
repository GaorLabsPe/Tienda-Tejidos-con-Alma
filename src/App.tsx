import React, { useState, useEffect, useMemo } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Product, CartItem, CartItemOption, StoreSettings } from './types';
import { PRODUCTS, DEFAULT_STORE_SETTINGS } from './data/catalog';
import { Header } from './components/Header';
import { ProductCard } from './components/ProductCard';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CartDrawer } from './components/CartDrawer';
import { OrderSuccessModal } from './components/OrderSuccessModal';
import { StoreSettingsModal } from './components/StoreSettingsModal';
import { HeroEntrance } from './components/HeroEntrance';
import { BottomNavBar, TabType } from './components/BottomNavBar';
import { FavoritesView } from './components/FavoritesView';
import { MostOrderedSection } from './components/MostOrderedSection';
import { PromotionsSection } from './components/PromotionsSection';
import { CategoryGridSection } from './components/CategoryGridSection';
import { ArrowRight } from 'lucide-react';

export default function App() {
  const [settings, setSettings] = useState<StoreSettings>(() => {
    try {
      const saved = localStorage.getItem('tejidos_con_alma_v1');
      return saved ? JSON.parse(saved) : DEFAULT_STORE_SETTINGS;
    } catch {
      return DEFAULT_STORE_SETTINGS;
    }
  });

  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('crochet_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('crochet_favorites');
      return saved ? JSON.parse(saved) : ['ramo-tulipanes-amarillos-glow', 'girasol-abejita'];
    } catch {
      return ['ramo-tulipanes-amarillos-glow', 'girasol-abejita'];
    }
  });

  const [activeTab, setActiveTab] = useState<TabType>('inicio');
  const [deliveryType, setDeliveryType] = useState<'delivery' | 'pickup'>('delivery');
  const [selectedCategory, setSelectedCategory] = useState<string>('todos');

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState<boolean>(false);
  const [lastOrderMessage, setLastOrderMessage] = useState<string>('');
  const [lastWhatsappUrl, setLastWhatsappUrl] = useState<string>('');

  useEffect(() => {
    try {
      localStorage.setItem('tejidos_con_alma_v1', JSON.stringify(settings));
    } catch (e) {
      console.error(e);
    }
  }, [settings]);

  useEffect(() => {
    try {
      localStorage.setItem('crochet_cart', JSON.stringify(cart));
    } catch (e) {
      console.error(e);
    }
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem('crochet_favorites', JSON.stringify(favorites));
    } catch (e) {
      console.error(e);
    }
  }, [favorites]);

  const toggleFavorite = (productId: string) => {
    setFavorites((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  const handleAddToCart = (
    product: Product,
    quantity: number,
    options: CartItemOption
  ) => {
    let unitPrice = product.price;
    if (options.units && product.unitTiers) {
      const tier = product.unitTiers.find((t) => t.units === options.units);
      if (tier) unitPrice = tier.price;
    }

    const totalPrice = unitPrice * quantity;

    const newCartItem: CartItem = {
      cartItemId: `${product.id}-${Date.now()}-${Math.random()}`,
      product,
      quantity,
      unitPrice,
      totalPrice,
      options,
    };

    setCart((prev) => [...prev, newCartItem]);
  };

  const handleUpdateQuantity = (cartItemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      handleRemoveItem(cartItemId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => {
        if (item.cartItemId === cartItemId) {
          const singleItemPrice = item.totalPrice / item.quantity;
          return {
            ...item,
            quantity: newQuantity,
            totalPrice: singleItemPrice * newQuantity,
          };
        }
        return item;
      })
    );
  };

  const handleRemoveItem = (cartItemId: string) => {
    setCart((prev) => prev.filter((item) => item.cartItemId !== cartItemId));
  };

  const handleClearCart = () => {
    setCart([]);
  };

  const handleOrderSuccess = (message: string, whatsappUrl: string) => {
    setLastOrderMessage(message);
    setLastWhatsappUrl(whatsappUrl);
    setIsCartOpen(false);
    setIsSuccessModalOpen(true);
    setCart([]);
  };

  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter((product) => {
      return selectedCategory === 'todos' || product.category === selectedCategory;
    });
  }, [selectedCategory]);

  const favoriteProductsList = useMemo(() => {
    return PRODUCTS.filter((product) => favorites.includes(product.id));
  }, [favorites]);

  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartSubtotal = cart.reduce((sum, item) => sum + item.totalPrice, 0);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    if (document.documentElement) document.documentElement.scrollTop = 0;
    if (document.body) document.body.scrollTop = 0;
  }, [activeTab]);

  const handleTabChange = (tab: TabType) => {
    if (tab === 'carrito') {
      setIsCartOpen(true);
    } else {
      setActiveTab(tab);
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      if (document.documentElement) document.documentElement.scrollTop = 0;
      if (document.body) document.body.scrollTop = 0;
    }
  };

  return (
    <div className="min-h-[100dvh] bg-[#F7F3FB] flex justify-center text-stone-900 select-none">
      {/* 100% Mobile centered container */}
      <div className="w-full max-w-md bg-white min-h-[100dvh] flex flex-col shadow-2xl relative border-x border-[#EFE5F5] overflow-x-hidden">
        
        {/* VIEW 1: INICIO (HOME HERO ENTRANCE) */}
        {activeTab === 'inicio' && (
          <HeroEntrance
            settings={settings}
            deliveryType={deliveryType}
            onDeliveryTypeChange={setDeliveryType}
            onExploreCatalog={() => setActiveTab('catalogo')}
          />
        )}

        {/* VIEW 2: CATÁLOGO DE PRODUCTOS */}
        {activeTab === 'catalogo' && (
          <div className="flex-1 flex flex-col pb-4">
            {/* Sticky Header */}
            <div className="sticky top-0 z-30 bg-white shadow-2xs">
              <Header
                settings={settings}
                deliveryType={deliveryType}
                onDeliveryTypeChange={setDeliveryType}
                onOpenSettings={() => setIsSettingsOpen(true)}
                onGoHome={() => handleTabChange('inicio')}
              />
            </div>

            {/* Product Catalog Grid */}
            <main className="flex-1 p-3 pb-24">
              {/* If "todos" is selected, show full discovery feed (Lo más pedido + Promociones + Categorías en cajas + Catálogo) */}
              {selectedCategory === 'todos' && (
                <>
                  {/* 1. "Lo más pedido" Carousel Section */}
                  <MostOrderedSection
                    products={PRODUCTS}
                    currencySymbol={settings.currencySymbol}
                    onSelectProduct={(p) => setSelectedProduct(p)}
                    favorites={favorites}
                    onToggleFavorite={toggleFavorite}
                    onViewAll={() => setSelectedCategory('todos')}
                  />

                  {/* 2. "Promociones" Carousel Section */}
                  <PromotionsSection
                    products={PRODUCTS}
                    currencySymbol={settings.currencySymbol}
                    onSelectProduct={(p) => setSelectedProduct(p)}
                    favorites={favorites}
                    onToggleFavorite={toggleFavorite}
                    onViewAll={() => setSelectedCategory('combos')}
                  />

                  {/* 3. "Categorías" 2-Column Photo Cards Grid */}
                  <CategoryGridSection
                    selectedCategory={selectedCategory}
                    onSelectCategory={(catId) => setSelectedCategory(catId)}
                  />
                </>
              )}

              {/* Specific Category Header or All items header */}
              <div className="flex items-center justify-between mb-2.5 px-0.5 pt-1">
                <div className="flex items-center gap-2">
                  {selectedCategory !== 'todos' && (
                    <button
                      onClick={() => setSelectedCategory('todos')}
                      className="text-xs font-bold text-[#502763] bg-[#F5ECF9] hover:bg-[#EDE0F6] px-2.5 py-1 rounded-lg active:scale-95 transition-transform cursor-pointer"
                    >
                      ← Todos
                    </button>
                  )}
                  <h2 className="text-xs sm:text-sm font-black text-[#54286B] uppercase tracking-wider">
                    {selectedCategory === 'todos' ? 'Todos los Modelos' : `Colección: ${selectedCategory}`}
                  </h2>
                </div>

                <span className="text-[11px] font-bold text-[#502763] bg-[#F5ECF9] px-2.5 py-0.5 rounded-full">
                  {filteredProducts.length} {filteredProducts.length === 1 ? 'modelo' : 'modelos'}
                </span>
              </div>

              {filteredProducts.length > 0 ? (
                <motion.div
                  key={selectedCategory}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.2 }}
                  className="grid grid-cols-2 gap-2.5"
                >
                  <AnimatePresence mode="popLayout">
                    {filteredProducts.map((product, idx) => (
                      <ProductCard
                        key={product.id}
                        index={idx}
                        product={product}
                        onSelectProduct={(p) => setSelectedProduct(p)}
                        currencySymbol={settings.currencySymbol}
                        isFavorite={favorites.includes(product.id)}
                        onToggleFavorite={toggleFavorite}
                      />
                    ))}
                  </AnimatePresence>
                </motion.div>
              ) : (
                <div className="p-8 text-center bg-white rounded-2xl border border-[#EFE5F5] mt-4 space-y-2">
                  <div className="text-3xl">🌻</div>
                  <h3 className="font-bold text-xs text-stone-800">
                    No hay productos en esta categoría
                  </h3>
                  <button
                    onClick={() => setSelectedCategory('todos')}
                    className="px-3 py-1.5 rounded-xl bg-[#653977] text-white font-bold text-xs active:scale-95 cursor-pointer"
                  >
                    Ver todos los ramos
                  </button>
                </div>
              )}
            </main>
          </div>
        )}

        {/* VIEW 3: FAVORITOS */}
        {activeTab === 'favoritos' && (
          <div className="flex-1 flex flex-col pb-6">
            <div className="bg-[#653977] text-white p-3.5 shadow-sm flex items-center justify-between sticky top-0 z-30">
              <button
                type="button"
                onClick={() => handleTabChange('inicio')}
                className="flex items-center gap-2 text-left cursor-pointer hover:opacity-90 active:scale-95 transition-all"
                title="Volver a Inicio"
              >
                <span className="text-xl">🌻</span>
                <div>
                  <h1 className="text-xs font-black uppercase tracking-wider text-white">
                    {settings.storeName}
                  </h1>
                  <span className="text-[10px] text-purple-100 font-bold">← Volver al Inicio</span>
                </div>
              </button>
              <button
                type="button"
                onClick={() => handleTabChange('catalogo')}
                className="text-xs text-purple-100 hover:text-white font-bold bg-white/15 hover:bg-white/25 active:scale-95 px-2.5 py-1.5 rounded-xl transition-all cursor-pointer border border-white/15"
              >
                Ver Catálogo
              </button>
            </div>
            <FavoritesView
              favoriteProducts={favoriteProductsList}
              onSelectProduct={(p) => setSelectedProduct(p)}
              currencySymbol={settings.currencySymbol}
              onExploreCatalog={() => setActiveTab('catalogo')}
            />
          </div>
        )}

        {/* Mobile Fixed Floating Cart Bar */}
        {totalCartCount > 0 && !isCartOpen && (
          <div className="fixed bottom-[4.25rem] sm:bottom-[4.5rem] inset-x-0 max-w-md mx-auto px-3.5 z-40 pointer-events-none animate-in slide-in-from-bottom-4 duration-200">
            <button
              onClick={() => setIsCartOpen(true)}
              className="pointer-events-auto w-full flex items-center justify-between py-3.5 px-4 bg-[#653977] hover:bg-[#552965] active:bg-[#451C53] active:scale-[0.98] text-white rounded-2xl shadow-xl shadow-[#653977]/25 border border-[#DFC9EE] font-bold text-xs transition-all cursor-pointer"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-6 h-6 rounded-lg bg-white text-[#502763] flex items-center justify-center text-xs font-black shrink-0 shadow-xs">
                  {totalCartCount}
                </div>
                <span className="text-xs sm:text-sm font-bold truncate">Ver Mi Pedido</span>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span className="text-xs sm:text-sm font-bold bg-white/20 px-2 py-0.5 rounded-lg">
                  {settings.currencySymbol} {cartSubtotal.toFixed(2)}
                </span>
                <ArrowRight className="w-4 h-4 text-purple-100 stroke-[2.5]" />
              </div>
            </button>
          </div>
        )}

        {/* Persistent Bottom Navigation Bar */}
        <BottomNavBar
          activeTab={activeTab}
          onTabChange={handleTabChange}
          cartCount={totalCartCount}
          favoriteCount={favorites.length}
        />

        {/* Product Detail Modal */}
        <ProductDetailModal
          product={selectedProduct}
          isOpen={Boolean(selectedProduct)}
          onClose={() => setSelectedProduct(null)}
          onAddToCart={handleAddToCart}
          currencySymbol={settings.currencySymbol}
        />

        {/* Slide-over Cart & Checkout Drawer */}
        <CartDrawer
          isOpen={isCartOpen}
          onClose={() => setIsCartOpen(false)}
          cart={cart}
          onUpdateQuantity={handleUpdateQuantity}
          onRemoveItem={handleRemoveItem}
          onClearCart={handleClearCart}
          settings={settings}
          deliveryType={deliveryType}
          onDeliveryTypeChange={setDeliveryType}
          onOrderSuccess={handleOrderSuccess}
        />

        {/* Order Success / WhatsApp Confirmation Modal */}
        <OrderSuccessModal
          isOpen={isSuccessModalOpen}
          onClose={() => setIsSuccessModalOpen(false)}
          orderMessage={lastOrderMessage}
          whatsappUrl={lastWhatsappUrl}
        />

        {/* Store Settings Modal */}
        <StoreSettingsModal
          isOpen={isSettingsOpen}
          onClose={() => setIsSettingsOpen(false)}
          settings={settings}
          onSaveSettings={setSettings}
        />
      </div>
    </div>
  );
}
