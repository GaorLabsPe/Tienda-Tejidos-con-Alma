import React, { useState, useEffect, useMemo } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Product, CartItem, CartItemOption, StoreSettings, CategoryItem } from './types';
import { PRODUCTS, DEFAULT_STORE_SETTINGS, DEFAULT_CATEGORIES } from './data/catalog';
import { supabase } from './lib/supabase';
import { Header } from './components/Header';
import { ProductCard } from './components/ProductCard';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CartDrawer } from './components/CartDrawer';
import { OrderSuccessModal } from './components/OrderSuccessModal';
import { AdminDashboardModal } from './components/AdminDashboardModal';
import { Footer } from './components/Footer';
import { HeroEntrance } from './components/HeroEntrance';
import { BottomNavBar, TabType } from './components/BottomNavBar';
import { FavoritesView } from './components/FavoritesView';
import { MostOrderedSection } from './components/MostOrderedSection';
import { PromotionsSection } from './components/PromotionsSection';
import { CategoryGridSection } from './components/CategoryGridSection';
import { ArrowRight } from 'lucide-react';
import { useSecretAdminTrigger } from './utils/secretTrigger';

export default function App() {
  const [settings, setSettings] = useState<StoreSettings>(() => {
    try {
      const saved = localStorage.getItem('tejidos_con_alma_v1');
      return saved ? { ...DEFAULT_STORE_SETTINGS, ...JSON.parse(saved) } : DEFAULT_STORE_SETTINGS;
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

  const handleSecretAdmin = useSecretAdminTrigger(() => setIsAdminOpen(true));

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [isAdminOpen, setIsAdminOpen] = useState<boolean>(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState<boolean>(false);
  const [lastOrderMessage, setLastOrderMessage] = useState<string>('');
  const [lastWhatsappUrl, setLastWhatsappUrl] = useState<string>('');

  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('tejidos_con_alma_products');
      return saved ? JSON.parse(saved) : PRODUCTS;
    } catch {
      return PRODUCTS;
    }
  });

  useEffect(() => {
    localStorage.setItem('tejidos_con_alma_products', JSON.stringify(products));
  }, [products]);

  const [categories, setCategories] = useState<CategoryItem[]>(() => {
    try {
      const saved = localStorage.getItem('tejidos_con_alma_categories');
      return saved ? JSON.parse(saved) : DEFAULT_CATEGORIES;
    } catch {
      return DEFAULT_CATEGORIES;
    }
  });

  useEffect(() => {
    localStorage.setItem('tejidos_con_alma_categories', JSON.stringify(categories));
  }, [categories]);

  const toggleCategoryVisibility = (categoryId: string) => {
    setCategories(prev => prev.map(c => {
      if (c.id === categoryId) {
        return { ...c, isVisible: c.isVisible === false ? true : false };
      }
      return c;
    }));
  };

  const handleAddCategory = (newCategory: CategoryItem) => {
    setCategories(prev => [...prev, newCategory]);
  };

  const handleUpdateCategory = (updatedCategory: CategoryItem) => {
    setCategories(prev => prev.map(c => c.id === updatedCategory.id ? updatedCategory : c));
  };

  const handleDeleteCategory = (categoryId: string) => {
    setCategories(prev => prev.filter(c => c.id !== categoryId));
  };

  const handleResetCategories = () => {
    setCategories(DEFAULT_CATEGORIES);
    localStorage.setItem('tejidos_con_alma_categories', JSON.stringify(DEFAULT_CATEGORIES));
  };

  const toggleProductVisibility = async (productId: string) => {
    const updatedProducts = products.map(p => {
      if (p.id === productId) {
        const newVisible = p.isVisible === false ? true : false;
        
        // Background sync to supabase
        if (supabase) {
          supabase.from('products').update({ is_visible: newVisible }).eq('id', productId).then();
        }

        return { ...p, isVisible: newVisible };
      }
      return p;
    });
    setProducts(updatedProducts);
  };

  const handleAddProduct = (newProduct: Product) => {
    setProducts(prev => [newProduct, ...prev]);
    if (supabase) {
      supabase.from('products').insert({
        id: newProduct.id,
        name: newProduct.name,
        category: newProduct.category,
        category_label: newProduct.categoryLabel,
        price: newProduct.price,
        description: newProduct.description,
        includes: newProduct.includes,
        image: newProduct.image,
        badge: newProduct.badge || null,
        rating: newProduct.rating || 5.0,
        review_count: newProduct.reviewCount || 10,
        preparation_time: newProduct.preparationTime || '24 a 48 hrs',
        is_visible: newProduct.isVisible !== false,
      }).then();
    }
  };

  const handleUpdateProduct = (updatedProduct: Product) => {
    setProducts(prev => prev.map(p => p.id === updatedProduct.id ? updatedProduct : p));
    if (supabase) {
      supabase.from('products').update({
        name: updatedProduct.name,
        category: updatedProduct.category,
        category_label: updatedProduct.categoryLabel,
        price: updatedProduct.price,
        description: updatedProduct.description,
        includes: updatedProduct.includes,
        image: updatedProduct.image,
        badge: updatedProduct.badge || null,
        is_visible: updatedProduct.isVisible !== false,
        preparation_time: updatedProduct.preparationTime,
      }).eq('id', updatedProduct.id).then();
    }
  };

  const handleDeleteProduct = (productId: string) => {
    setProducts(prev => prev.filter(p => p.id !== productId));
    if (supabase) {
      supabase.from('products').delete().eq('id', productId).then();
    }
  };

  const handleResetProducts = () => {
    setProducts(PRODUCTS);
    localStorage.setItem('tejidos_con_alma_products', JSON.stringify(PRODUCTS));
  };

  const handleSaveSettings = async (newSettings: StoreSettings) => {
    setSettings(newSettings);
    if (supabase) {
      const { data } = await supabase.from('store_settings').select('id').limit(1).single();
      if (data?.id) {
        await supabase.from('store_settings').update({
          store_name: newSettings.storeName,
          whatsapp_number: newSettings.whatsappNumber,
          whatsapp_display: newSettings.whatsappDisplay,
          currency: newSettings.currency,
          currency_symbol: newSettings.currencySymbol,
          yape_number: newSettings.yapeNumber,
          plin_number: newSettings.plinNumber,
          delivery_cost: newSettings.deliveryCost,
          free_delivery_threshold: newSettings.freeDeliveryThreshold,
          store_address: newSettings.storeAddress,
          opening_hours: newSettings.openingHours,
          tiktok_url: newSettings.tiktokUrl,
          show_tiktok: newSettings.showTiktok,
          instagram_url: newSettings.instagramUrl,
          show_instagram: newSettings.showInstagram,
          facebook_url: newSettings.facebookUrl,
          show_facebook: newSettings.showFacebook,
          admin_pin: newSettings.adminPin,
        }).eq('id', data.id);
      }
    }
  };

  useEffect(() => {
    if (!supabase) return;
    
    const fetchSupabaseData = async () => {
      try {
        const { data: storeSettings, error: settingsError } = await supabase
          .from('store_settings')
          .select('*')
          .limit(1)
          .single();
          
        if (storeSettings && !settingsError) {
          setSettings(prev => ({
            ...prev,
            storeName: storeSettings.store_name || prev.storeName,
            whatsappNumber: storeSettings.whatsapp_number || prev.whatsappNumber,
            whatsappDisplay: storeSettings.whatsapp_display || prev.whatsappDisplay,
            currency: storeSettings.currency || prev.currency,
            currencySymbol: storeSettings.currency_symbol || prev.currencySymbol,
            yapeNumber: storeSettings.yape_number || prev.yapeNumber,
            plinNumber: storeSettings.plin_number || prev.plinNumber,
            deliveryCost: storeSettings.delivery_cost ?? prev.deliveryCost,
            freeDeliveryThreshold: storeSettings.free_delivery_threshold ?? prev.freeDeliveryThreshold,
            storeAddress: storeSettings.store_address || prev.storeAddress,
            openingHours: storeSettings.opening_hours || prev.openingHours,
            tiktokUrl: storeSettings.tiktok_url ?? prev.tiktokUrl,
            showTiktok: storeSettings.show_tiktok ?? prev.showTiktok,
            instagramUrl: storeSettings.instagram_url ?? prev.instagramUrl,
            showInstagram: storeSettings.show_instagram ?? prev.showInstagram,
            facebookUrl: storeSettings.facebook_url ?? prev.facebookUrl,
            showFacebook: storeSettings.show_facebook ?? prev.showFacebook,
            adminPin: storeSettings.admin_pin || prev.adminPin,
          }));
        }

        const { data: productsData, error: productsError } = await supabase
          .from('products')
          .select('*');
          
        if (productsData && !productsError && productsData.length > 0) {
          // Map DB keys to app keys
          const mappedProducts = productsData.map(p => ({
            id: p.id,
            name: p.name,
            category: p.category,
            categoryLabel: p.category_label,
            price: p.price,
            description: p.description,
            includes: p.includes,
            image: p.image,
            badge: p.badge,
            rating: p.rating,
            reviewCount: p.review_count,
            preparationTime: p.preparation_time,
            isVisible: p.is_visible
          })) as Product[];
          
          setProducts(mappedProducts);
        }
      } catch (e) {
        console.error("Error fetching from Supabase:", e);
      }
    };
    
    fetchSupabaseData();
  }, []);

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
    return products.filter((product) => {
      const isCategoryMatch = selectedCategory === 'todos' || product.category === selectedCategory;
      return isCategoryMatch && product.isVisible !== false;
    });
  }, [products, selectedCategory]);

  const favoriteProductsList = useMemo(() => {
    return products.filter((product) => favorites.includes(product.id) && product.isVisible !== false);
  }, [favorites, products]);

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
            onOpenAdmin={() => setIsAdminOpen(true)}
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
                onOpenSettings={() => setIsAdminOpen(true)}
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
                    products={products.filter(p => p.isVisible !== false)}
                    currencySymbol={settings.currencySymbol}
                    onSelectProduct={(p) => setSelectedProduct(p)}
                    favorites={favorites}
                    onToggleFavorite={toggleFavorite}
                    onViewAll={() => setSelectedCategory('combos')}
                  />

                  {/* 3. "Categorías" 2-Column Photo Cards Grid */}
                  <CategoryGridSection
                    categories={categories}
                    products={products}
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
                    {selectedCategory === 'todos' 
                      ? 'Todos los Modelos' 
                      : `Colección: ${categories.find(c => c.id === selectedCategory)?.name || selectedCategory}`}
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
              <Footer 
                settings={settings}
                onOpenAdmin={() => setIsAdminOpen(true)}
                onOpenCustomBuilder={() => {
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              />
            </main>
          </div>
        )}

        {/* VIEW 3: FAVORITOS */}
        {activeTab === 'favoritos' && (
          <div className="flex-1 flex flex-col pb-6">
            <div className="bg-[#653977] text-white p-3.5 shadow-sm flex items-center justify-between sticky top-0 z-30">
              <div className="flex items-center gap-2 text-left">
                <button
                  type="button"
                  onClick={() => handleTabChange('inicio')}
                  className="text-xl cursor-pointer hover:scale-110 active:scale-95 transition-transform"
                  title="Volver a Inicio"
                >
                  🌻
                </button>
                <div>
                  <h1 className="text-xs font-black uppercase tracking-wider text-white flex items-center gap-1">
                    <span 
                      onClick={() => handleTabChange('inicio')} 
                      className="cursor-pointer hover:underline"
                    >
                      {settings.storeName.replace('💜', '').trim()}
                    </span>
                    <span
                      onClick={handleSecretAdmin}
                      title="💜"
                      className="cursor-pointer select-none text-purple-200 hover:scale-125 active:scale-150 transition-transform touch-manipulation px-0.5 inline-block"
                    >
                      💜
                    </span>
                  </h1>
                  <button 
                    onClick={() => handleTabChange('inicio')}
                    className="text-[10px] text-purple-100 font-bold block hover:underline text-left cursor-pointer"
                  >
                    ← Volver al Inicio
                  </button>
                </div>
              </div>
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

        {/* Admin Dashboard Modal */}
        <AdminDashboardModal
          isOpen={isAdminOpen}
          onClose={() => setIsAdminOpen(false)}
          settings={settings}
          onSaveSettings={handleSaveSettings}
          products={products}
          onToggleProductVisibility={toggleProductVisibility}
          onAddProduct={handleAddProduct}
          onUpdateProduct={handleUpdateProduct}
          onDeleteProduct={handleDeleteProduct}
          onResetProducts={handleResetProducts}
          categories={categories}
          onToggleCategoryVisibility={toggleCategoryVisibility}
          onAddCategory={handleAddCategory}
          onUpdateCategory={handleUpdateCategory}
          onDeleteCategory={handleDeleteCategory}
          onResetCategories={handleResetCategories}
        />
      </div>
    </div>
  );
}
