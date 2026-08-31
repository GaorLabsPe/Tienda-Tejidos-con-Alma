import React, { useState, useEffect, useRef } from 'react';
import { StoreSettings, Product, CategoryItem } from '../types';
import { 
  Save, 
  X, 
  Eye, 
  EyeOff, 
  Settings, 
  Store, 
  Truck, 
  Phone, 
  DollarSign, 
  CheckCircle2, 
  Search, 
  LogOut, 
  ShieldCheck, 
  Layers,
  Lock,
  Plus,
  Pencil,
  Trash2,
  Upload,
  Image as ImageIcon,
  RotateCcw,
  Sparkles,
  Tag,
  Clock,
  Check,
  AlertTriangle,
  FolderPlus,
  Smile,
  Instagram,
  Facebook,
  Video,
  KeyRound,
  Share2
} from 'lucide-react';

const PRESET_BADGES = ['Más Vendido ⭐', 'Novedad ✨', 'Oferta 🔥', 'Exclusivo 💜', 'Popular 🌻', 'Personalizable 🎀'];
const PRESET_EMOJIS = ['🌻', '🌷', '🌹', '🌸', '💐', '✨', '🧸', '🏷️', '🎁', '🎀', '🐝', '🍓', '🪴', '💜', '💛', '🤍', '💝', '🌿'];

const PRESET_CATEGORY_IMAGES = [
  { label: 'Girasoles', url: 'https://images.unsplash.com/photo-1597848212624-a19eb35e2651?w=800&auto=format&fit=crop&q=80' },
  { label: 'Tulipanes', url: 'https://images.unsplash.com/photo-1526047932273-341f2a7631f9?w=800&auto=format&fit=crop&q=80' },
  { label: 'Rosas', url: 'https://images.unsplash.com/photo-1563241527-3004b7be0ffd?w=800&auto=format&fit=crop&q=80' },
  { label: 'Luces LED', url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop&q=80' },
  { label: 'Minis & Crochet', url: 'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=800&auto=format&fit=crop&q=80' },
  { label: 'Cajas & Packs', url: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=800&auto=format&fit=crop&q=80' },
];

interface AdminDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: StoreSettings;
  onSaveSettings: (newSettings: StoreSettings) => void;
  products: Product[];
  onToggleProductVisibility: (productId: string) => void;
  onAddProduct: (newProduct: Product) => void;
  onUpdateProduct: (updatedProduct: Product) => void;
  onDeleteProduct: (productId: string) => void;
  onResetProducts: () => void;
  categories: CategoryItem[];
  onToggleCategoryVisibility: (categoryId: string) => void;
  onAddCategory: (newCategory: CategoryItem) => void;
  onUpdateCategory: (updatedCategory: CategoryItem) => void;
  onDeleteCategory: (categoryId: string) => void;
  onResetCategories: () => void;
}

export const AdminDashboardModal: React.FC<AdminDashboardModalProps> = ({
  isOpen,
  onClose,
  settings,
  onSaveSettings,
  products,
  onToggleProductVisibility,
  onAddProduct,
  onUpdateProduct,
  onDeleteProduct,
  onResetProducts,
  categories,
  onToggleCategoryVisibility,
  onAddCategory,
  onUpdateCategory,
  onDeleteCategory,
  onResetCategories,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pin, setPin] = useState('');
  const [pinError, setPinError] = useState(false);
  const [activeTab, setActiveTab] = useState<'products' | 'categories' | 'settings' | 'delivery'>('products');
  const [searchTerm, setSearchTerm] = useState('');
  const [categorySearchTerm, setCategorySearchTerm] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('all');
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);
  
  // Product Edit / Create Modal State
  const [isEditingProduct, setIsEditingProduct] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Partial<Product>>({});
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);

  // Category Edit / Create Modal State
  const [isEditingCategory, setIsEditingCategory] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Partial<CategoryItem>>({});
  const [isCreatingNewCategory, setIsCreatingNewCategory] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<CategoryItem | null>(null);
  const [isResetCategoriesConfirmOpen, setIsResetCategoriesConfirmOpen] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const categoryFileInputRef = useRef<HTMLInputElement | null>(null);
  const [showSettingsPin, setShowSettingsPin] = useState(false);
  const [form, setForm] = useState<StoreSettings>({ ...settings });

  useEffect(() => {
    setForm({ ...settings });
  }, [settings]);

  if (!isOpen) return null;

  const showNotification = (msg: string) => {
    setSaveSuccess(msg);
    setTimeout(() => {
      setSaveSuccess(null);
    }, 3500);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const correctPin = (settings.adminPin || '1982').trim();
    if (pin.trim() === correctPin) {
      setIsAuthenticated(true);
      setPinError(false);
    } else {
      setPinError(true);
    }
  };

  const handleSaveSettings = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    onSaveSettings(form);
    showNotification('¡Ajustes de tienda guardados con éxito!');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setPin('');
    onClose();
  };

  // Open Edit Product Modal
  const handleOpenEdit = (product: Product) => {
    setEditingProduct({ ...product, includes: [...(product.includes || [])] });
    setIsCreatingNew(false);
    setIsEditingProduct(true);
  };

  // Open Create New Product Modal
  const handleOpenCreate = () => {
    const defaultCat = categories[0]?.id || 'girasoles';
    const defaultCatObj = categories.find(c => c.id === defaultCat);
    setEditingProduct({
      id: `ramo-custom-${Date.now()}`,
      name: '',
      category: defaultCat,
      categoryLabel: defaultCatObj?.name || 'Girasoles',
      price: 45,
      originalPrice: 55,
      description: 'Hermoso diseño artesanal tejido a mano con hilo antialérgico de alta calidad.',
      includes: ['Flores tejidas a mano', 'Envoltura coreana de regalo', 'Tarjeta con dedicatoria'],
      image: 'https://images.unsplash.com/photo-1597848212624-a19eb35e2651?w=800&auto=format&fit=crop&q=80',
      badge: 'Novedad ✨',
      rating: 5.0,
      reviewCount: 15,
      preparationTime: '24 a 48 hrs',
      isVisible: true,
    });
    setIsCreatingNew(true);
    setIsEditingProduct(true);
  };

  // Handle Photo File Upload (Convert to Base64)
  const handleImageFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setEditingProduct(prev => ({ ...prev, image: reader.result as string }));
        showNotification('Foto cargada exitosamente 📸');
      }
    };
    reader.readAsDataURL(file);
  };

  // Save Product (Create or Update)
  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct.name?.trim()) {
      alert('Por favor ingresa un nombre para el producto');
      return;
    }
    if (!editingProduct.price || editingProduct.price <= 0) {
      alert('Por favor ingresa un precio válido');
      return;
    }

    const currentCatId = editingProduct.category || categories[0]?.id || 'girasoles';
    const catOption = categories.find(c => c.id === currentCatId);
    const categoryLabel = catOption ? catOption.name : (editingProduct.category || 'Ramos');

    const fullProduct: Product = {
      id: editingProduct.id || `ramo-${Date.now()}`,
      name: editingProduct.name.trim(),
      category: currentCatId,
      categoryLabel: categoryLabel,
      price: Number(editingProduct.price),
      originalPrice: editingProduct.originalPrice ? Number(editingProduct.originalPrice) : undefined,
      description: editingProduct.description?.trim() || 'Ramo tejido a mano con amor.',
      includes: editingProduct.includes && editingProduct.includes.length > 0 
        ? editingProduct.includes 
        : ['Florería artesanal crochet', 'Tarjeta de dedicatoria de regalo'],
      image: editingProduct.image?.trim() || 'https://images.unsplash.com/photo-1597848212624-a19eb35e2651?w=800&auto=format&fit=crop&q=80',
      badge: editingProduct.badge?.trim() || undefined,
      rating: editingProduct.rating || 5.0,
      reviewCount: editingProduct.reviewCount || 10,
      preparationTime: editingProduct.preparationTime?.trim() || '24 a 48 hrs',
      isVisible: editingProduct.isVisible !== false,
    };

    if (isCreatingNew) {
      onAddProduct(fullProduct);
      showNotification(`¡Producto "${fullProduct.name}" agregado con éxito! 🎉`);
    } else {
      onUpdateProduct(fullProduct);
      showNotification(`¡Producto "${fullProduct.name}" actualizado! ✨`);
    }

    setIsEditingProduct(false);
  };

  const handleConfirmDelete = () => {
    if (productToDelete) {
      onDeleteProduct(productToDelete.id);
      showNotification(`Producto "${productToDelete.name}" eliminado`);
      setProductToDelete(null);
    }
  };

  // --- CATEGORY CRUD HANDLERS ---
  const handleOpenCreateCategory = () => {
    setEditingCategory({
      id: `categoria-${Date.now()}`,
      name: '',
      fullName: '',
      emoji: '🌸',
      subtitle: 'Detalles y flores tejidas',
      image: 'https://images.unsplash.com/photo-1597848212624-a19eb35e2651?w=800&auto=format&fit=crop&q=80',
      isVisible: true,
    });
    setIsCreatingNewCategory(true);
    setIsEditingCategory(true);
  };

  const handleOpenEditCategory = (cat: CategoryItem) => {
    setEditingCategory({ ...cat });
    setIsCreatingNewCategory(false);
    setIsEditingCategory(true);
  };

  const handleCategoryImageFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setEditingCategory(prev => ({ ...prev, image: reader.result as string }));
        showNotification('Foto de categoría cargada exitosamente 📸');
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSaveCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCategory.name?.trim()) {
      alert('Por favor ingresa un nombre para la categoría');
      return;
    }

    const baseSlug = editingCategory.name.toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');

    const finalId = editingCategory.id || baseSlug || `cat-${Date.now()}`;

    const fullCategory: CategoryItem = {
      id: finalId,
      name: editingCategory.name.trim(),
      fullName: editingCategory.fullName?.trim() || editingCategory.name.trim(),
      emoji: editingCategory.emoji?.trim() || '🌸',
      subtitle: editingCategory.subtitle?.trim() || 'Colección artesanal',
      image: editingCategory.image?.trim() || 'https://images.unsplash.com/photo-1597848212624-a19eb35e2651?w=800&auto=format&fit=crop&q=80',
      isVisible: editingCategory.isVisible !== false,
    };

    if (isCreatingNewCategory) {
      onAddCategory(fullCategory);
      showNotification(`¡Categoría "${fullCategory.name}" creada con éxito! 🎉`);
    } else {
      onUpdateCategory(fullCategory);
      showNotification(`¡Categoría "${fullCategory.name}" actualizada! ✨`);
    }

    setIsEditingCategory(false);
  };

  const handleConfirmDeleteCategory = () => {
    if (categoryToDelete) {
      onDeleteCategory(categoryToDelete.id);
      showNotification(`Categoría "${categoryToDelete.name}" eliminada`);
      setCategoryToDelete(null);
    }
  };

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.categoryLabel.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategoryFilter === 'all' || p.category === selectedCategoryFilter;
    return matchesSearch && matchesCategory;
  });

  // 1. PIN LOGIN VIEW
  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
        <div className="absolute inset-0 bg-stone-900/75 backdrop-blur-xs" onClick={onClose} />
        
        <div className="relative bg-white rounded-t-[28px] sm:rounded-3xl w-full max-w-sm shadow-2xl p-6 sm:p-7 border border-[#F0E4F7] z-10 animate-in slide-in-from-bottom duration-300">
          <div className="w-12 h-1 bg-stone-200 rounded-full mx-auto mb-4 sm:hidden" />
          
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-stone-100 hover:bg-stone-200 rounded-full text-stone-500 hover:text-stone-800 transition-colors cursor-pointer"
            aria-label="Cerrar"
          >
            <X className="w-4 h-4" />
          </button>
          
          <div className="text-center mb-6 mt-1">
            <div className="w-14 h-14 bg-[#F5EBF9] border border-[#E7D6EE] rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-xs">
              <Lock className="w-6 h-6 text-[#653977]" />
            </div>
            <h2 className="text-lg sm:text-xl font-black text-[#54286B]">Panel de Administración</h2>
            <p className="text-xs text-stone-500 mt-1 font-medium">Ingresa tu clave PIN para configurar tu tienda y catálogo</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <div className="relative">
                <input
                  type="password"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={6}
                  value={pin}
                  onChange={(e) => {
                    setPin(e.target.value);
                    if (pinError) setPinError(false);
                  }}
                  placeholder="••••"
                  className={`w-full text-center text-3xl font-black tracking-[0.4em] py-3 px-4 rounded-2xl border ${
                    pinError 
                      ? 'border-red-400 bg-red-50 text-red-700 focus:ring-2 focus:ring-red-400' 
                      : 'border-stone-200 bg-stone-50 focus:bg-white focus:border-[#653977] focus:ring-2 focus:ring-[#653977]/20 text-[#54286B]'
                  } outline-none transition-all`}
                  autoFocus
                />
              </div>
              {pinError && (
                <p className="text-red-500 text-xs text-center mt-2 font-bold flex items-center justify-center gap-1">
                  <span>⚠️ Clave PIN incorrecta. Inténtalo nuevamente.</span>
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-[#653977] hover:bg-[#532d63] active:scale-[0.98] text-white font-black text-sm rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Ingresar al Panel</span>
            </button>
            
            <p className="text-[11px] text-stone-400 text-center font-medium">
              🔒 Acceso protegido exclusivamente para el administrador
            </p>
          </form>
        </div>
      </div>
    );
  }

  // 2. MAIN ADMIN DASHBOARD
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
      <div className="absolute inset-0 bg-stone-900/75 backdrop-blur-xs" onClick={onClose} />
      
      <div className="relative w-full sm:max-w-2xl bg-stone-50 h-[95vh] sm:h-[90vh] flex flex-col rounded-t-[28px] sm:rounded-3xl shadow-2xl overflow-hidden border border-[#F0E4F7] z-10 animate-in slide-in-from-bottom duration-300">
        
        {/* Mobile Handle */}
        <div className="w-12 h-1 bg-stone-300 rounded-full mx-auto my-2 sm:hidden shrink-0" />

        {/* Top Header */}
        <div className="bg-[#653977] text-white px-4 py-3 sm:px-5 sm:py-3.5 flex items-center justify-between shadow-xs shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-white/15 flex items-center justify-center text-white border border-white/20 text-base">
              🌻
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h2 className="font-black text-sm uppercase tracking-wide text-white">Panel Administrador</h2>
                <span className="bg-emerald-400/20 text-emerald-300 text-[9px] font-bold px-1.5 py-0.5 rounded-full border border-emerald-400/30">
                  {products.length} productos
                </span>
              </div>
              <p className="text-[10px] text-purple-200 font-medium truncate max-w-[200px] sm:max-w-xs">{form.storeName}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={handleLogout}
              title="Cerrar Sesión"
              className="p-2 text-purple-200 hover:text-white hover:bg-white/10 rounded-xl transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-2 bg-white/10 hover:bg-white/20 rounded-xl text-white transition-colors cursor-pointer active:scale-95"
              aria-label="Cerrar"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Toast Message */}
        {saveSuccess && (
          <div className="bg-emerald-600 text-white text-xs font-bold px-4 py-2.5 flex items-center justify-center gap-1.5 shadow-sm animate-in slide-in-from-top duration-200 shrink-0">
            <CheckCircle2 className="w-4 h-4" />
            <span>{saveSuccess}</span>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="bg-white border-b border-stone-200 p-1.5 grid grid-cols-4 gap-1 shrink-0">
          <button 
            type="button"
            onClick={() => setActiveTab('products')}
            className={`py-2 px-1 text-[11px] sm:text-xs font-bold rounded-xl transition-all flex justify-center items-center gap-1 cursor-pointer touch-manipulation ${
              activeTab === 'products' 
                ? 'bg-[#653977] text-white shadow-xs' 
                : 'text-stone-600 hover:bg-stone-100'
            }`}
          >
            <Layers className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">Productos ({products.length})</span>
          </button>

          <button 
            type="button"
            onClick={() => setActiveTab('categories')}
            className={`py-2 px-1 text-[11px] sm:text-xs font-bold rounded-xl transition-all flex justify-center items-center gap-1 cursor-pointer touch-manipulation ${
              activeTab === 'categories' 
                ? 'bg-[#653977] text-white shadow-xs' 
                : 'text-stone-600 hover:bg-stone-100'
            }`}
          >
            <FolderPlus className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">Categorías ({categories.length})</span>
          </button>

          <button 
            type="button"
            onClick={() => setActiveTab('settings')}
            className={`py-2 px-1 text-[11px] sm:text-xs font-bold rounded-xl transition-all flex justify-center items-center gap-1 cursor-pointer touch-manipulation ${
              activeTab === 'settings' 
                ? 'bg-[#653977] text-white shadow-xs' 
                : 'text-stone-600 hover:bg-stone-100'
            }`}
          >
            <Settings className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">Tienda</span>
          </button>

          <button 
            type="button"
            onClick={() => setActiveTab('delivery')}
            className={`py-2 px-1 text-[11px] sm:text-xs font-bold rounded-xl transition-all flex justify-center items-center gap-1 cursor-pointer touch-manipulation ${
              activeTab === 'delivery' 
                ? 'bg-[#653977] text-white shadow-xs' 
                : 'text-stone-600 hover:bg-stone-100'
            }`}
          >
            <Truck className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">Envíos</span>
          </button>
        </div>

        {/* Body Content */}
        <div className="flex-1 overflow-y-auto p-3.5 sm:p-5 space-y-4">
          
          {/* TAB 1: PRODUCT MANAGEMENT (PRIMARY) */}
          {activeTab === 'products' && (
            <div className="space-y-3.5">
              
              {/* Header Actions: New Product Button */}
              <div className="flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={handleOpenCreate}
                  className="flex-1 py-3 px-4 bg-[#653977] hover:bg-[#532d63] text-white font-black text-xs sm:text-sm rounded-2xl shadow-md flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-[0.98]"
                >
                  <Plus className="w-4 h-4 stroke-[3]" />
                  <span>+ AGREGAR NUEVO RAMO / FLOR</span>
                </button>
                
                <button
                  type="button"
                  onClick={() => setIsResetConfirmOpen(true)}
                  title="Restaurar Catálogo por Defecto"
                  className="p-3 bg-stone-200 hover:bg-stone-300 text-stone-700 rounded-2xl transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>

              {/* Search & Category Filter */}
              <div className="space-y-2">
                <div className="relative">
                  <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input 
                    type="text"
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    placeholder="Buscar producto por nombre..."
                    className="w-full pl-10 pr-4 py-2.5 text-xs font-semibold bg-white border border-stone-200 rounded-xl focus:outline-none focus:border-[#653977] text-stone-800 shadow-2xs"
                  />
                  {searchTerm && (
                    <button 
                      onClick={() => setSearchTerm('')} 
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-stone-400 hover:text-stone-600"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Filter Pills */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
                  <button
                    type="button"
                    onClick={() => setSelectedCategoryFilter('all')}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold whitespace-nowrap transition-colors cursor-pointer ${
                      selectedCategoryFilter === 'all' 
                        ? 'bg-[#653977] text-white' 
                        : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-100'
                    }`}
                  >
                    Todos ({products.length})
                  </button>
                  {categories.map(cat => {
                    const count = products.filter(p => p.category === cat.id).length;
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => setSelectedCategoryFilter(cat.id)}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-bold whitespace-nowrap transition-colors cursor-pointer ${
                          selectedCategoryFilter === cat.id 
                            ? 'bg-[#653977] text-white' 
                            : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-100'
                        }`}
                      >
                        {cat.emoji} {cat.name} ({count})
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Products List Cards */}
              <div className="space-y-2.5">
                {filteredProducts.map((product) => {
                  const isVisible = product.isVisible !== false;
                  return (
                    <div 
                      key={product.id} 
                      className={`p-3 rounded-2xl border transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-2xs ${
                        isVisible 
                          ? 'bg-white border-stone-200/90' 
                          : 'bg-stone-100/90 border-stone-300 opacity-75'
                      }`}
                    >
                      {/* Product Info & Thumb */}
                      <div className="flex items-center gap-3 w-full sm:w-auto min-w-0">
                        <div className="relative shrink-0">
                          <img 
                            src={product.image} 
                            alt={product.name} 
                            className="w-14 h-14 rounded-xl object-cover bg-stone-100 border border-stone-200" 
                          />
                          {!isVisible && (
                            <span className="absolute -top-1 -right-1 bg-stone-700 text-white text-[8px] font-bold px-1 rounded-full">
                              Oculto
                            </span>
                          )}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <h4 className="text-xs sm:text-sm font-bold text-stone-800 truncate max-w-[180px] sm:max-w-xs">{product.name}</h4>
                            {product.badge && (
                              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-md bg-purple-50 text-purple-700 border border-purple-100">
                                {product.badge}
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2 text-[11px] text-stone-500 mt-0.5">
                            <span className="font-semibold text-[#653977]">{product.categoryLabel}</span>
                            <span>•</span>
                            <span className="font-black text-stone-900">{form.currencySymbol}{product.price.toFixed(2)}</span>
                            {product.originalPrice && (
                              <span className="line-through text-stone-400 text-[10px]">
                                {form.currencySymbol}{product.originalPrice.toFixed(2)}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons Toolbar */}
                      <div className="flex items-center justify-end gap-1.5 w-full sm:w-auto border-t sm:border-t-0 pt-2 sm:pt-0 border-stone-100">
                        {/* Edit Button */}
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(product)}
                          className="flex-1 sm:flex-initial py-1.5 px-3 rounded-xl bg-purple-50 hover:bg-purple-100 text-[#653977] font-bold text-xs flex items-center justify-center gap-1 border border-purple-200 transition-colors cursor-pointer touch-manipulation"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                          <span>Editar</span>
                        </button>

                        {/* Visibility Toggle */}
                        <button
                          type="button"
                          onClick={() => onToggleProductVisibility(product.id)}
                          title={isVisible ? 'Ocultar producto de la tienda' : 'Hacer visible en la tienda'}
                          className={`flex-1 sm:flex-initial py-1.5 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1 transition-all cursor-pointer touch-manipulation ${
                            isVisible 
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100' 
                              : 'bg-stone-200 text-stone-600 border border-stone-300 hover:bg-stone-300'
                          }`}
                        >
                          {isVisible ? (
                            <>
                              <Eye className="w-3.5 h-3.5 text-emerald-600" />
                              <span>Visible</span>
                            </>
                          ) : (
                            <>
                              <EyeOff className="w-3.5 h-3.5 text-stone-500" />
                              <span>Oculto</span>
                            </>
                          )}
                        </button>

                        {/* Delete Button */}
                        <button
                          type="button"
                          onClick={() => setProductToDelete(product)}
                          title="Eliminar producto"
                          className="p-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 transition-colors cursor-pointer touch-manipulation"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}

                {filteredProducts.length === 0 && (
                  <div className="text-center py-10 bg-white rounded-2xl border border-stone-200">
                    <p className="text-xs text-stone-500 font-medium">No se encontraron productos con esos filtros</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: CATEGORY MANAGEMENT (NEW) */}
          {activeTab === 'categories' && (
            <div className="space-y-3.5">
              
              {/* Header Actions: New Category Button & Reset */}
              <div className="flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={handleOpenCreateCategory}
                  className="flex-1 py-3 px-4 bg-[#653977] hover:bg-[#532d63] text-white font-black text-xs sm:text-sm rounded-2xl shadow-md flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-[0.98]"
                >
                  <Plus className="w-4 h-4 stroke-[3]" />
                  <span>+ AGREGAR NUEVA CATEGORÍA</span>
                </button>
                
                <button
                  type="button"
                  onClick={() => setIsResetCategoriesConfirmOpen(true)}
                  title="Restaurar Categorías por Defecto"
                  className="p-3 bg-stone-200 hover:bg-stone-300 text-stone-700 rounded-2xl transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>

              {/* Search Bar */}
              <div className="relative">
                <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input 
                  type="text"
                  value={categorySearchTerm}
                  onChange={e => setCategorySearchTerm(e.target.value)}
                  placeholder="Buscar categoría por nombre..."
                  className="w-full pl-10 pr-4 py-2.5 text-xs font-semibold bg-white border border-stone-200 rounded-xl focus:outline-none focus:border-[#653977] text-stone-800 shadow-2xs"
                />
                {categorySearchTerm && (
                  <button 
                    onClick={() => setCategorySearchTerm('')} 
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-stone-400 hover:text-stone-600"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Category Cards List */}
              <div className="space-y-2.5">
                {categories
                  .filter(cat => 
                    cat.name.toLowerCase().includes(categorySearchTerm.toLowerCase()) || 
                    (cat.subtitle && cat.subtitle.toLowerCase().includes(categorySearchTerm.toLowerCase()))
                  )
                  .map(cat => {
                    const assignedProductsCount = products.filter(p => p.category === cat.id).length;
                    const isVisible = cat.isVisible !== false;

                    return (
                      <div 
                        key={cat.id} 
                        className={`p-3 rounded-2xl border transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-2xs ${
                          isVisible 
                            ? 'bg-white border-stone-200/90 hover:border-[#653977]/30' 
                            : 'bg-stone-50/90 border-dashed border-stone-300 opacity-75'
                        }`}
                      >
                        {/* Left: Thumbnail & Info */}
                        <div className="flex items-center gap-3 w-full sm:w-auto min-w-0">
                          <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden bg-stone-100 shrink-0 border border-stone-200/60 shadow-2xs">
                            <img 
                              src={cat.image} 
                              alt={cat.name} 
                              className={`w-full h-full object-cover ${!isVisible ? 'grayscale-40' : ''}`} 
                              loading="lazy"
                              referrerPolicy="no-referrer"
                            />
                            <div className="absolute top-1 left-1 bg-white/90 backdrop-blur-xs text-xs px-1.5 py-0.5 rounded-md shadow-2xs">
                              {cat.emoji || '🌸'}
                            </div>
                            {!isVisible && (
                              <span className="absolute -top-1 -right-1 bg-stone-700 text-white text-[8px] font-bold px-1.5 py-0.2 rounded-full shadow-2xs">
                                Oculta
                              </span>
                            )}
                          </div>

                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <h4 className="font-black text-xs sm:text-sm text-stone-800 truncate">
                                {cat.name}
                              </h4>
                              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-purple-50 text-[#653977] border border-purple-100">
                                {assignedProductsCount} {assignedProductsCount === 1 ? 'producto' : 'productos'}
                              </span>
                              {!isVisible && (
                                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-md bg-stone-200 text-stone-600">
                                  No visible en tienda
                                </span>
                              )}
                            </div>
                            
                            <p className="text-[11px] text-stone-500 font-medium truncate mt-0.5">
                              {cat.subtitle || 'Colección artesanal'}
                            </p>
                            
                            <span className="text-[10px] font-mono text-stone-400 mt-0.5 block truncate">
                              ID: {cat.id}
                            </span>
                          </div>
                        </div>

                        {/* Right: Actions */}
                        <div className="flex items-center justify-end gap-1.5 w-full sm:w-auto shrink-0 border-t sm:border-t-0 pt-2 sm:pt-0 border-stone-100">
                          {/* Visibility Toggle */}
                          <button
                            type="button"
                            onClick={() => onToggleCategoryVisibility(cat.id)}
                            title={isVisible ? 'Ocultar categoría en la tienda' : 'Mostrar categoría en la tienda'}
                            className={`py-1.5 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1 transition-all cursor-pointer touch-manipulation ${
                              isVisible 
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100' 
                                : 'bg-stone-200 text-stone-600 border border-stone-300 hover:bg-stone-300'
                            }`}
                          >
                            {isVisible ? (
                              <>
                                <Eye className="w-3.5 h-3.5 text-emerald-600" />
                                <span>Visible</span>
                              </>
                            ) : (
                              <>
                                <EyeOff className="w-3.5 h-3.5 text-stone-500" />
                                <span>Oculta</span>
                              </>
                            )}
                          </button>

                          {/* Edit Button */}
                          <button
                            type="button"
                            onClick={() => handleOpenEditCategory(cat)}
                            title="Editar Categoría"
                            className="py-1.5 px-3 rounded-xl bg-purple-50 hover:bg-purple-100 text-[#653977] border border-purple-200 transition-colors flex items-center gap-1 text-xs font-bold cursor-pointer"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                            <span>Editar</span>
                          </button>

                          {/* Delete Button */}
                          <button
                            type="button"
                            onClick={() => setCategoryToDelete(cat)}
                            title="Eliminar Categoría"
                            className="p-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 transition-colors flex items-center justify-center text-xs font-bold cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}

                {categories.length === 0 && (
                  <div className="text-center py-10 bg-white rounded-2xl border border-stone-200">
                    <p className="text-xs text-stone-500 font-medium">No hay categorías configuradas. ¡Crea una nueva!</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: STORE SETTINGS */}
          {activeTab === 'settings' && (
            <form onSubmit={handleSaveSettings} className="space-y-4">
              
              {/* Tienda & Marca */}
              <div className="bg-white p-4 rounded-2xl border border-stone-200/90 shadow-2xs space-y-3.5">
                <div className="flex items-center gap-2 text-[#54286B] font-black text-xs uppercase tracking-wider border-b border-stone-100 pb-2">
                  <Store className="w-3.5 h-3.5 text-[#653977]" />
                  <span>Identidad de la Tienda</span>
                </div>
                
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-stone-600 uppercase tracking-wider">Nombre del Negocio</label>
                  <input 
                    type="text" 
                    value={form.storeName} 
                    onChange={e => setForm({...form, storeName: e.target.value})} 
                    className="w-full text-sm font-bold p-3 rounded-xl bg-stone-50 border border-stone-200 focus:bg-white focus:border-[#653977] outline-none text-stone-800" 
                    placeholder="Ej. Tejidos con Alma 💜"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-stone-600 uppercase tracking-wider">Moneda</label>
                    <input 
                      type="text" 
                      value={form.currency} 
                      onChange={e => setForm({...form, currency: e.target.value})} 
                      className="w-full text-sm font-bold p-3 rounded-xl bg-stone-50 border border-stone-200 focus:bg-white focus:border-[#653977] outline-none text-stone-800" 
                      placeholder="PEN"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-stone-600 uppercase tracking-wider">Símbolo</label>
                    <input 
                      type="text" 
                      value={form.currencySymbol} 
                      onChange={e => setForm({...form, currencySymbol: e.target.value})} 
                      className="w-full text-sm font-bold p-3 rounded-xl bg-stone-50 border border-stone-200 focus:bg-white focus:border-[#653977] outline-none text-stone-800" 
                      placeholder="S/"
                    />
                  </div>
                </div>
              </div>

              {/* WhatsApp & Pedidos */}
              <div className="bg-white p-4 rounded-2xl border border-stone-200/90 shadow-2xs space-y-3.5">
                <div className="flex items-center gap-2 text-emerald-800 font-black text-xs uppercase tracking-wider border-b border-stone-100 pb-2">
                  <Phone className="w-3.5 h-3.5 text-emerald-600" />
                  <span>WhatsApp para Recibir Pedidos</span>
                </div>
                
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-stone-600 uppercase tracking-wider">
                    Número WhatsApp (código país sin +)
                  </label>
                  <input 
                    type="tel" 
                    value={form.whatsappNumber} 
                    onChange={e => setForm({...form, whatsappNumber: e.target.value})} 
                    className="w-full text-sm font-bold p-3 rounded-xl bg-stone-50 border border-stone-200 focus:bg-white focus:border-emerald-500 outline-none text-stone-800" 
                    placeholder="Ej. 51987654321" 
                  />
                  <p className="text-[10px] text-stone-400">Los clientes enviarán sus carritos a este número.</p>
                </div>
                
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-stone-600 uppercase tracking-wider">Texto a Mostrar</label>
                  <input 
                    type="text" 
                    value={form.whatsappDisplay} 
                    onChange={e => setForm({...form, whatsappDisplay: e.target.value})} 
                    className="w-full text-sm font-bold p-3 rounded-xl bg-stone-50 border border-stone-200 focus:bg-white focus:border-emerald-500 outline-none text-stone-800" 
                    placeholder="+51 987 654 321"
                  />
                </div>
              </div>

              {/* Pagos Digitales */}
              <div className="bg-white p-4 rounded-2xl border border-stone-200/90 shadow-2xs space-y-3.5">
                <div className="flex items-center gap-2 text-purple-900 font-black text-xs uppercase tracking-wider border-b border-stone-100 pb-2">
                  <DollarSign className="w-3.5 h-3.5 text-purple-600" />
                  <span>Cuentas de Pago (Yape / Plin)</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-stone-600 uppercase tracking-wider">Número Yape</label>
                    <input 
                      type="tel" 
                      value={form.yapeNumber} 
                      onChange={e => setForm({...form, yapeNumber: e.target.value})} 
                      className="w-full text-sm font-bold p-3 rounded-xl bg-stone-50 border border-stone-200 focus:bg-white focus:border-purple-500 outline-none text-stone-800" 
                      placeholder="987 654 321"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-stone-600 uppercase tracking-wider">Número Plin</label>
                    <input 
                      type="tel" 
                      value={form.plinNumber} 
                      onChange={e => setForm({...form, plinNumber: e.target.value})} 
                      className="w-full text-sm font-bold p-3 rounded-xl bg-stone-50 border border-stone-200 focus:bg-white focus:border-cyan-500 outline-none text-stone-800" 
                      placeholder="987 654 321"
                    />
                  </div>
                </div>
              </div>

              {/* Redes Sociales Oficiales */}
              <div className="bg-white p-4 rounded-2xl border border-stone-200/90 shadow-2xs space-y-3.5">
                <div className="flex items-center justify-between border-b border-stone-100 pb-2">
                  <div className="flex items-center gap-2 text-[#54286B] font-black text-xs uppercase tracking-wider">
                    <Share2 className="w-3.5 h-3.5 text-[#653977]" />
                    <span>Redes Sociales en Pie de Página</span>
                  </div>
                  <span className="text-[10px] text-stone-400 font-medium">Activa u oculta cada red</span>
                </div>

                {/* TikTok Card */}
                <div className={`p-3 rounded-xl border transition-all space-y-2 ${
                  form.showTiktok !== false 
                    ? 'bg-stone-50/70 border-stone-200' 
                    : 'bg-stone-100/60 border-dashed border-stone-300 opacity-80'
                }`}>
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] font-bold text-stone-700 uppercase tracking-wider flex items-center gap-1.5">
                      <Video className="w-3.5 h-3.5 text-stone-900" />
                      <span>TikTok</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => setForm({...form, showTiktok: form.showTiktok === false ? true : false})}
                      className={`px-2.5 py-1 rounded-lg font-bold text-[10px] flex items-center gap-1 transition-all cursor-pointer ${
                        form.showTiktok !== false
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          : 'bg-stone-200 text-stone-600 border border-stone-300'
                      }`}
                    >
                      {form.showTiktok !== false ? (
                        <>
                          <Eye className="w-3 h-3 text-emerald-700" />
                          <span>Visible</span>
                        </>
                      ) : (
                        <>
                          <EyeOff className="w-3 h-3 text-stone-500" />
                          <span>Oculto</span>
                        </>
                      )}
                    </button>
                  </div>
                  <div className="relative">
                    <input 
                      type="url" 
                      value={form.tiktokUrl || ''} 
                      onChange={e => setForm({...form, tiktokUrl: e.target.value})} 
                      className="w-full text-xs font-bold p-2.5 pr-16 rounded-xl bg-white border border-stone-200 focus:border-stone-900 outline-none text-stone-800" 
                      placeholder="https://www.tiktok.com/@tu_cuenta"
                    />
                    {form.tiktokUrl && (
                      <a 
                        href={form.tiktokUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] font-bold text-purple-700 bg-purple-50 hover:bg-purple-100 px-2 py-1 rounded-lg"
                      >
                        Probar ↗
                      </a>
                    )}
                  </div>
                </div>

                {/* Instagram Card */}
                <div className={`p-3 rounded-xl border transition-all space-y-2 ${
                  form.showInstagram !== false 
                    ? 'bg-stone-50/70 border-stone-200' 
                    : 'bg-stone-100/60 border-dashed border-stone-300 opacity-80'
                }`}>
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] font-bold text-stone-700 uppercase tracking-wider flex items-center gap-1.5">
                      <Instagram className="w-3.5 h-3.5 text-pink-600" />
                      <span>Instagram</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => setForm({...form, showInstagram: form.showInstagram === false ? true : false})}
                      className={`px-2.5 py-1 rounded-lg font-bold text-[10px] flex items-center gap-1 transition-all cursor-pointer ${
                        form.showInstagram !== false
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          : 'bg-stone-200 text-stone-600 border border-stone-300'
                      }`}
                    >
                      {form.showInstagram !== false ? (
                        <>
                          <Eye className="w-3 h-3 text-emerald-700" />
                          <span>Visible</span>
                        </>
                      ) : (
                        <>
                          <EyeOff className="w-3 h-3 text-stone-500" />
                          <span>Oculto</span>
                        </>
                      )}
                    </button>
                  </div>
                  <div className="relative">
                    <input 
                      type="url" 
                      value={form.instagramUrl || ''} 
                      onChange={e => setForm({...form, instagramUrl: e.target.value})} 
                      className="w-full text-xs font-bold p-2.5 pr-16 rounded-xl bg-white border border-stone-200 focus:border-pink-500 outline-none text-stone-800" 
                      placeholder="https://www.instagram.com/tu_cuenta"
                    />
                    {form.instagramUrl && (
                      <a 
                        href={form.instagramUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] font-bold text-pink-700 bg-pink-50 hover:bg-pink-100 px-2 py-1 rounded-lg"
                      >
                        Probar ↗
                      </a>
                    )}
                  </div>
                </div>

                {/* Facebook Card */}
                <div className={`p-3 rounded-xl border transition-all space-y-2 ${
                  form.showFacebook !== false 
                    ? 'bg-stone-50/70 border-stone-200' 
                    : 'bg-stone-100/60 border-dashed border-stone-300 opacity-80'
                }`}>
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] font-bold text-stone-700 uppercase tracking-wider flex items-center gap-1.5">
                      <Facebook className="w-3.5 h-3.5 text-blue-600" />
                      <span>Facebook</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => setForm({...form, showFacebook: form.showFacebook === false ? true : false})}
                      className={`px-2.5 py-1 rounded-lg font-bold text-[10px] flex items-center gap-1 transition-all cursor-pointer ${
                        form.showFacebook !== false
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          : 'bg-stone-200 text-stone-600 border border-stone-300'
                      }`}
                    >
                      {form.showFacebook !== false ? (
                        <>
                          <Eye className="w-3 h-3 text-emerald-700" />
                          <span>Visible</span>
                        </>
                      ) : (
                        <>
                          <EyeOff className="w-3 h-3 text-stone-500" />
                          <span>Oculto</span>
                        </>
                      )}
                    </button>
                  </div>
                  <div className="relative">
                    <input 
                      type="url" 
                      value={form.facebookUrl || ''} 
                      onChange={e => setForm({...form, facebookUrl: e.target.value})} 
                      className="w-full text-xs font-bold p-2.5 pr-16 rounded-xl bg-white border border-stone-200 focus:border-blue-600 outline-none text-stone-800" 
                      placeholder="https://www.facebook.com/tu_pagina"
                    />
                    {form.facebookUrl && (
                      <a 
                        href={form.facebookUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 px-2 py-1 rounded-lg"
                      >
                        Probar ↗
                      </a>
                    )}
                  </div>
                </div>
              </div>

              {/* Seguridad y Clave PIN de Acceso */}
              <div className="bg-white p-4 rounded-2xl border border-stone-200/90 shadow-2xs space-y-3.5">
                <div className="flex items-center gap-2 text-purple-900 font-black text-xs uppercase tracking-wider border-b border-stone-100 pb-2">
                  <KeyRound className="w-3.5 h-3.5 text-purple-700" />
                  <span>Seguridad & Clave PIN del Administrador</span>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-stone-700 uppercase tracking-wider flex items-center justify-between">
                    <span>Clave PIN de Acceso</span>
                    <span className="text-[10px] text-stone-400 font-normal">Privada y confidencial</span>
                  </label>
                  <div className="relative">
                    <input 
                      type={showSettingsPin ? 'text' : 'password'}
                      value={form.adminPin || '1982'} 
                      onChange={e => setForm({...form, adminPin: e.target.value})} 
                      className="w-full text-sm font-black tracking-widest p-3 pr-12 rounded-xl bg-stone-50 border border-stone-200 focus:bg-white focus:border-[#653977] outline-none text-stone-800" 
                      placeholder="••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowSettingsPin(!showSettingsPin)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 p-1 cursor-pointer"
                      title={showSettingsPin ? 'Ocultar clave' : 'Mostrar clave'}
                    >
                      {showSettingsPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  <p className="text-[10px] text-stone-500 font-medium">
                    🔒 Esta es la clave requerida para entrar a este panel. Nunca se muestra en la pantalla de inicio de sesión.
                  </p>
                </div>
              </div>

            </form>
          )}

          {/* TAB 3: DELIVERY SETTINGS */}
          {activeTab === 'delivery' && (
            <div className="space-y-4">
              <div className="bg-white p-4 rounded-2xl border border-stone-200/90 shadow-2xs space-y-3.5">
                <div className="flex items-center gap-2 text-[#54286B] font-black text-xs uppercase tracking-wider border-b border-stone-100 pb-2">
                  <Truck className="w-3.5 h-3.5 text-[#653977]" />
                  <span>Tarifas de Envíos</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-stone-600 uppercase tracking-wider">
                      Costo Fijo de Delivery ({form.currencySymbol})
                    </label>
                    <input 
                      type="number" 
                      step="0.5"
                      value={form.deliveryCost} 
                      onChange={e => setForm({...form, deliveryCost: Number(e.target.value) || 0})} 
                      className="w-full text-sm font-bold p-3 rounded-xl bg-stone-50 border border-stone-200 focus:bg-white focus:border-[#653977] outline-none text-stone-800" 
                      placeholder="12.00"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-stone-600 uppercase tracking-wider">
                      Envío Gratis a partir de ({form.currencySymbol})
                    </label>
                    <input 
                      type="number" 
                      step="1"
                      value={form.freeDeliveryThreshold} 
                      onChange={e => setForm({...form, freeDeliveryThreshold: Number(e.target.value) || 0})} 
                      className="w-full text-sm font-bold p-3 rounded-xl bg-stone-50 border border-stone-200 focus:bg-white focus:border-[#653977] outline-none text-stone-800" 
                      placeholder="120"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-stone-200/90 shadow-2xs space-y-3.5">
                <div className="flex items-center gap-2 text-[#54286B] font-black text-xs uppercase tracking-wider border-b border-stone-100 pb-2">
                  <Store className="w-3.5 h-3.5 text-[#653977]" />
                  <span>Taller & Horarios</span>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-stone-600 uppercase tracking-wider">Dirección de Retiro</label>
                  <input 
                    type="text" 
                    value={form.storeAddress} 
                    onChange={e => setForm({...form, storeAddress: e.target.value})} 
                    className="w-full text-sm font-bold p-3 rounded-xl bg-stone-50 border border-stone-200 focus:bg-white focus:border-[#653977] outline-none text-stone-800" 
                    placeholder="Taller San Miguel (Previa coordinación)"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-stone-600 uppercase tracking-wider">Horario de Atención</label>
                  <input 
                    type="text" 
                    value={form.openingHours} 
                    onChange={e => setForm({...form, openingHours: e.target.value})} 
                    className="w-full text-sm font-bold p-3 rounded-xl bg-stone-50 border border-stone-200 focus:bg-white focus:border-[#653977] outline-none text-stone-800" 
                    placeholder="Lunes a Sábado: 9:00 AM - 7:00 PM"
                  />
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Sticky Bottom Save Action Bar for Settings / Delivery */}
        {(activeTab === 'settings' || activeTab === 'delivery') && (
          <div className="bg-white border-t border-stone-200 p-3 sm:p-4 shrink-0 shadow-lg">
            <button
              type="button"
              onClick={() => handleSaveSettings()}
              className="w-full py-3.5 sm:py-4 bg-[#653977] hover:bg-[#532d63] active:scale-[0.98] text-white font-black text-sm rounded-2xl shadow-md transition-all flex justify-center items-center gap-2 cursor-pointer touch-manipulation"
            >
              <Save className="w-4 h-4" />
              <span>GUARDAR CONFIGURACIÓN</span>
            </button>
          </div>
        )}

      </div>

      {/* ========================================================================= */}
      {/* 3. PRODUCT EDIT / CREATE SUB-MODAL (MOBILE FULL-SCREEN DRAWER) */}
      {/* ========================================================================= */}
      {isEditingProduct && (
        <div className="fixed inset-0 z-60 flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-150">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-xs" onClick={() => setIsEditingProduct(false)} />
          
          <div className="relative w-full sm:max-w-xl bg-white h-[95vh] sm:h-[88vh] flex flex-col rounded-t-[28px] sm:rounded-3xl shadow-2xl overflow-hidden z-20 animate-in slide-in-from-bottom duration-250">
            
            {/* Header */}
            <div className="bg-[#653977] text-white px-4 py-3.5 flex items-center justify-between shadow-xs shrink-0">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-white/15 flex items-center justify-center">
                  {isCreatingNew ? <Plus className="w-4 h-4" /> : <Pencil className="w-4 h-4" />}
                </div>
                <div>
                  <h3 className="font-black text-sm uppercase text-white">
                    {isCreatingNew ? 'Nuevo Producto / Ramo' : 'Editar Producto'}
                  </h3>
                  <p className="text-[10px] text-purple-200">Completa los datos del catálogo</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsEditingProduct(false)}
                className="p-1.5 bg-white/10 hover:bg-white/20 rounded-xl text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Scrollable Form */}
            <form onSubmit={handleSaveProduct} id="product-editor-form" className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
              
              {/* Product Photo Upload Section */}
              <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200 space-y-3">
                <label className="text-[11px] font-black text-[#54286B] uppercase tracking-wider flex items-center gap-1.5">
                  <ImageIcon className="w-3.5 h-3.5 text-[#653977]" />
                  <span>Foto del Producto</span>
                </label>

                <div className="flex items-center gap-3">
                  <img 
                    src={editingProduct.image || 'https://images.unsplash.com/photo-1597848212624-a19eb35e2651?w=800&auto=format&fit=crop&q=80'} 
                    alt="Preview" 
                    className="w-20 h-20 rounded-2xl object-cover bg-white border-2 border-[#E9DAF2] shadow-xs shrink-0" 
                  />

                  <div className="flex-1 space-y-2">
                    <input 
                      type="file" 
                      accept="image/*" 
                      ref={fileInputRef} 
                      onChange={handleImageFileUpload} 
                      className="hidden" 
                    />
                    
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full py-2.5 px-3 bg-[#653977] hover:bg-[#532d63] text-white font-bold text-xs rounded-xl shadow-xs flex items-center justify-center gap-1.5 cursor-pointer touch-manipulation active:scale-95 transition-all"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>Subir Foto del Celular</span>
                    </button>
                    
                    <input 
                      type="url"
                      value={editingProduct.image || ''}
                      onChange={e => setEditingProduct({ ...editingProduct, image: e.target.value })}
                      placeholder="O pega link de imagen (URL)"
                      className="w-full text-xs p-2 rounded-xl bg-white border border-stone-200 focus:outline-none focus:border-[#653977] text-stone-700"
                    />
                  </div>
                </div>
              </div>

              {/* Basic Details */}
              <div className="space-y-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-stone-600 uppercase tracking-wider">
                    Nombre del Producto *
                  </label>
                  <input 
                    type="text" 
                    required
                    value={editingProduct.name || ''} 
                    onChange={e => setEditingProduct({ ...editingProduct, name: e.target.value })} 
                    className="w-full text-sm font-bold p-3 rounded-xl bg-stone-50 border border-stone-200 focus:bg-white focus:border-[#653977] outline-none text-stone-800" 
                    placeholder="Ej. Ramo Sol Radiante de 3 Girasoles"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-stone-600 uppercase tracking-wider">
                      Categoría
                    </label>
                    <select
                      value={editingProduct.category || categories[0]?.id || 'girasoles'}
                      onChange={e => {
                        const newCat = e.target.value;
                        const found = categories.find(c => c.id === newCat);
                        setEditingProduct({ 
                          ...editingProduct, 
                          category: newCat,
                          categoryLabel: found?.name || newCat
                        });
                      }}
                      className="w-full text-xs font-bold p-3 rounded-xl bg-stone-50 border border-stone-200 focus:bg-white focus:border-[#653977] outline-none text-stone-800"
                    >
                      {categories.map(c => (
                        <option key={c.id} value={c.id}>
                          {c.emoji} {c.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-stone-600 uppercase tracking-wider">
                      Etiqueta / Badge
                    </label>
                    <input 
                      type="text" 
                      value={editingProduct.badge || ''} 
                      onChange={e => setEditingProduct({ ...editingProduct, badge: e.target.value })} 
                      className="w-full text-xs font-bold p-3 rounded-xl bg-stone-50 border border-stone-200 focus:bg-white focus:border-[#653977] outline-none text-stone-800" 
                      placeholder="Ej. Más Vendido ⭐"
                    />
                  </div>
                </div>

                {/* Preset Badges Quick Picker */}
                <div className="flex items-center gap-1 overflow-x-auto pb-1 no-scrollbar">
                  {PRESET_BADGES.map(badge => (
                    <button
                      key={badge}
                      type="button"
                      onClick={() => setEditingProduct({ ...editingProduct, badge: editingProduct.badge === badge ? '' : badge })}
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-md border whitespace-nowrap transition-colors cursor-pointer ${
                        editingProduct.badge === badge 
                          ? 'bg-purple-600 text-white border-purple-600' 
                          : 'bg-stone-100 text-stone-600 border-stone-200 hover:bg-stone-200'
                      }`}
                    >
                      {badge}
                    </button>
                  ))}
                </div>

                {/* Pricing & Time */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-stone-600 uppercase tracking-wider">
                      Precio ({form.currencySymbol}) *
                    </label>
                    <input 
                      type="number" 
                      step="0.5"
                      required
                      value={editingProduct.price ?? ''} 
                      onChange={e => setEditingProduct({ ...editingProduct, price: parseFloat(e.target.value) || 0 })} 
                      className="w-full text-sm font-black p-3 rounded-xl bg-stone-50 border border-stone-200 focus:bg-white focus:border-[#653977] outline-none text-emerald-800" 
                      placeholder="45.00"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-stone-600 uppercase tracking-wider">
                      Precio Antes / Tachado
                    </label>
                    <input 
                      type="number" 
                      step="0.5"
                      value={editingProduct.originalPrice ?? ''} 
                      onChange={e => setEditingProduct({ ...editingProduct, originalPrice: e.target.value ? parseFloat(e.target.value) : undefined })} 
                      className="w-full text-sm font-bold p-3 rounded-xl bg-stone-50 border border-stone-200 focus:bg-white focus:border-[#653977] outline-none text-stone-500" 
                      placeholder="55.00 (Opcional)"
                    />
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-stone-600 uppercase tracking-wider">
                    Descripción del Ramo
                  </label>
                  <textarea 
                    rows={2}
                    value={editingProduct.description || ''} 
                    onChange={e => setEditingProduct({ ...editingProduct, description: e.target.value })} 
                    className="w-full text-xs font-medium p-3 rounded-xl bg-stone-50 border border-stone-200 focus:bg-white focus:border-[#653977] outline-none text-stone-800" 
                    placeholder="Detalles sobre las flores, materiales antialérgicos y aroma..."
                  />
                </div>

                {/* Includes Items */}
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-stone-600 uppercase tracking-wider">
                    Qué incluye (separar con comas o líneas)
                  </label>
                  <textarea 
                    rows={2}
                    value={(editingProduct.includes || []).join('\n')} 
                    onChange={e => {
                      const items = e.target.value.split('\n').filter(i => i.trim().length > 0);
                      setEditingProduct({ ...editingProduct, includes: items });
                    }} 
                    className="w-full text-xs font-medium p-3 rounded-xl bg-stone-50 border border-stone-200 focus:bg-white focus:border-[#653977] outline-none text-stone-800" 
                    placeholder="1 Girasol tejido&#10;Envoltura de regalo&#10;Tarjeta con dedicatoria"
                  />
                </div>

                {/* Preparation Time & Visibility Toggle */}
                <div className="grid grid-cols-2 gap-3 items-center pt-1">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-stone-600 uppercase tracking-wider">
                      Tiempo Confección
                    </label>
                    <input 
                      type="text" 
                      value={editingProduct.preparationTime || '24 a 48 hrs'} 
                      onChange={e => setEditingProduct({ ...editingProduct, preparationTime: e.target.value })} 
                      className="w-full text-xs font-bold p-3 rounded-xl bg-stone-50 border border-stone-200 focus:bg-white focus:border-[#653977] outline-none text-stone-800" 
                      placeholder="24 a 48 hrs"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-stone-600 uppercase tracking-wider">
                      Estado en Tienda
                    </label>
                    <button
                      type="button"
                      onClick={() => setEditingProduct({ ...editingProduct, isVisible: editingProduct.isVisible === false ? true : false })}
                      className={`w-full py-3 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                        editingProduct.isVisible !== false 
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' 
                          : 'bg-stone-200 text-stone-600 border border-stone-300'
                      }`}
                    >
                      {editingProduct.isVisible !== false ? (
                        <>
                          <Check className="w-4 h-4 text-emerald-700" />
                          <span>Visible al Público</span>
                        </>
                      ) : (
                        <>
                          <EyeOff className="w-4 h-4 text-stone-500" />
                          <span>Oculto (Pausado)</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

              </div>

            </form>

            {/* Bottom Actions */}
            <div className="bg-white border-t border-stone-200 p-3 sm:p-4 flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => setIsEditingProduct(false)}
                className="py-3 px-4 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-600 font-bold text-xs cursor-pointer transition-colors"
              >
                Cancelar
              </button>

              <button
                type="submit"
                form="product-editor-form"
                className="flex-1 py-3 px-4 rounded-xl bg-[#653977] hover:bg-[#532d63] text-white font-black text-xs sm:text-sm shadow-md flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-[0.98]"
              >
                <Save className="w-4 h-4" />
                <span>{isCreatingNew ? 'GUARDAR Y AGREGAR AL CATÁLOGO' : 'GUARDAR CAMBIOS DEL PRODUCTO'}</span>
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. CONFIRM DELETE MODAL */}
      {/* ========================================================================= */}
      {productToDelete && (
        <div className="fixed inset-0 z-70 flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-xs" onClick={() => setProductToDelete(null)} />
          <div className="relative bg-white rounded-2xl p-5 max-w-sm w-full shadow-2xl space-y-4 border border-rose-100 z-10 animate-in zoom-in-95">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <div className="text-center">
              <h4 className="text-base font-black text-stone-800">¿Eliminar este producto?</h4>
              <p className="text-xs text-stone-500 mt-1">
                Se eliminará <strong>"{productToDelete.name}"</strong> del catálogo visible.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setProductToDelete(null)}
                className="flex-1 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-sm cursor-pointer"
              >
                Sí, Eliminar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. CONFIRM RESET CATALOG MODAL */}
      {/* ========================================================================= */}
      {isResetConfirmOpen && (
        <div className="fixed inset-0 z-70 flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-xs" onClick={() => setIsResetConfirmOpen(false)} />
          <div className="relative bg-white rounded-2xl p-5 max-w-sm w-full shadow-2xl space-y-4 border border-amber-100 z-10 animate-in zoom-in-95">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div className="text-center">
              <h4 className="text-base font-black text-stone-800">¿Restaurar catálogo inicial?</h4>
              <p className="text-xs text-stone-500 mt-1">
                Esto restablecerá la lista completa de productos al catálogo artesanal por defecto.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsResetConfirmOpen(false)}
                className="flex-1 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={() => {
                  onResetProducts();
                  setIsResetConfirmOpen(false);
                  showNotification('Catálogo restaurado por defecto');
                }}
                className="flex-1 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-sm cursor-pointer"
              >
                Restaurar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 6. CATEGORY EDIT / CREATE SUB-MODAL (MOBILE FULL-SCREEN DRAWER) */}
      {/* ========================================================================= */}
      {isEditingCategory && (
        <div className="fixed inset-0 z-60 flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-150">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-xs" onClick={() => setIsEditingCategory(false)} />
          
          <div className="relative w-full sm:max-w-xl bg-white h-[95vh] sm:h-[88vh] flex flex-col rounded-t-[28px] sm:rounded-3xl shadow-2xl overflow-hidden z-20 animate-in slide-in-from-bottom duration-250">
            
            {/* Header */}
            <div className="bg-[#653977] text-white px-4 py-3.5 flex items-center justify-between shadow-xs shrink-0">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-white/15 flex items-center justify-center">
                  {isCreatingNewCategory ? <FolderPlus className="w-4 h-4" /> : <Pencil className="w-4 h-4" />}
                </div>
                <div>
                  <h3 className="font-black text-sm uppercase text-white">
                    {isCreatingNewCategory ? 'Nueva Categoría' : 'Editar Categoría'}
                  </h3>
                  <p className="text-[10px] text-purple-200">Personaliza la sección de tu catálogo</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsEditingCategory(false)}
                className="p-1.5 bg-white/10 hover:bg-white/20 rounded-xl text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Scrollable Form */}
            <form onSubmit={handleSaveCategory} id="category-editor-form" className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
              
              {/* Photo Section */}
              <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200/80 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-bold text-stone-700 uppercase tracking-wider flex items-center gap-1.5">
                    <ImageIcon className="w-3.5 h-3.5 text-[#653977]" />
                    <span>Foto de la Categoría</span>
                  </label>
                  <span className="text-[10px] text-stone-400 font-medium">Recomendado 800x800</span>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-3.5">
                  <div className="relative w-28 h-28 rounded-2xl overflow-hidden bg-stone-200 border-2 border-stone-300 shrink-0 shadow-inner group">
                    {editingCategory.image ? (
                      <img 
                        src={editingCategory.image} 
                        alt="Preview" 
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-stone-400">
                        <ImageIcon className="w-8 h-8 stroke-1" />
                        <span className="text-[10px]">Sin foto</span>
                      </div>
                    )}
                    <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-xs text-sm px-2 py-0.5 rounded-lg shadow-sm">
                      {editingCategory.emoji || '🌸'}
                    </div>
                  </div>

                  <div className="flex-1 space-y-2 w-full">
                    <input 
                      type="file" 
                      ref={categoryFileInputRef} 
                      onChange={handleCategoryImageFileUpload} 
                      accept="image/*" 
                      className="hidden" 
                    />
                    
                    <button
                      type="button"
                      onClick={() => categoryFileInputRef.current?.click()}
                      className="w-full py-2.5 px-3 bg-purple-100 hover:bg-purple-200 text-[#653977] font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>Subir Foto desde Celular / Galería</span>
                    </button>

                    <div className="space-y-1">
                      <label className="text-[10px] font-semibold text-stone-500">O pegar enlace directo URL:</label>
                      <input 
                        type="url" 
                        value={editingCategory.image || ''} 
                        onChange={e => setEditingCategory({ ...editingCategory, image: e.target.value })} 
                        className="w-full text-xs p-2 rounded-xl bg-white border border-stone-200 focus:border-[#653977] outline-none text-stone-700" 
                        placeholder="https://images.unsplash.com/..."
                      />
                    </div>
                  </div>
                </div>

                {/* Preset Category Images */}
                <div className="pt-2 border-t border-stone-200/60">
                  <span className="text-[10px] font-bold text-stone-500 block mb-1.5">O elige una foto sugerida:</span>
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5">
                    {PRESET_CATEGORY_IMAGES.map((preset, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setEditingCategory({ ...editingCategory, image: preset.url })}
                        className="relative h-12 rounded-lg overflow-hidden border border-stone-200 hover:border-[#653977] transition-all cursor-pointer group"
                      >
                        <img src={preset.url} alt={preset.label} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                        <span className="absolute inset-x-0 bottom-0 bg-black/60 text-white text-[9px] font-bold py-0.5 truncate text-center">
                          {preset.label}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Category Name & Emoji */}
              <div className="space-y-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-stone-600 uppercase tracking-wider">
                    Nombre de la Categoría *
                  </label>
                  <input 
                    type="text" 
                    required
                    value={editingCategory.name || ''} 
                    onChange={e => setEditingCategory({ ...editingCategory, name: e.target.value, fullName: e.target.value })} 
                    className="w-full text-sm font-bold p-3 rounded-xl bg-stone-50 border border-stone-200 focus:bg-white focus:border-[#653977] outline-none text-stone-800" 
                    placeholder="Ej. Rosas Eternas, Orquídeas, Amigurumis"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-stone-600 uppercase tracking-wider">
                      Emoji Representativo
                    </label>
                    <input 
                      type="text" 
                      value={editingCategory.emoji || ''} 
                      onChange={e => setEditingCategory({ ...editingCategory, emoji: e.target.value })} 
                      className="w-full text-sm font-bold p-3 rounded-xl bg-stone-50 border border-stone-200 focus:bg-white focus:border-[#653977] outline-none text-stone-800 text-center" 
                      placeholder="🌻"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-stone-600 uppercase tracking-wider">
                      Identificador / Slug
                    </label>
                    <input 
                      type="text" 
                      disabled={!isCreatingNewCategory}
                      value={editingCategory.id || ''} 
                      onChange={e => setEditingCategory({ ...editingCategory, id: e.target.value })} 
                      className="w-full text-xs font-mono p-3 rounded-xl bg-stone-100 border border-stone-200 focus:bg-white focus:border-[#653977] outline-none text-stone-700" 
                      placeholder="ej. rosas-eternas"
                    />
                  </div>
                </div>

                {/* Emoji Quick Picker */}
                <div className="space-y-1">
                  <span className="text-[10px] font-semibold text-stone-500">Selecciona un emoji rápido:</span>
                  <div className="flex flex-wrap gap-1">
                    {PRESET_EMOJIS.map((emoji) => (
                      <button
                        key={emoji}
                        type="button"
                        onClick={() => setEditingCategory({ ...editingCategory, emoji })}
                        className={`w-8 h-8 rounded-lg text-sm flex items-center justify-center transition-all cursor-pointer ${
                          editingCategory.emoji === emoji 
                            ? 'bg-[#653977] text-white shadow-xs scale-110' 
                            : 'bg-stone-100 hover:bg-stone-200'
                        }`}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-stone-600 uppercase tracking-wider">
                    Subtítulo / Descripción Corta
                  </label>
                  <input 
                    type="text" 
                    value={editingCategory.subtitle || ''} 
                    onChange={e => setEditingCategory({ ...editingCategory, subtitle: e.target.value })} 
                    className="w-full text-xs font-bold p-3 rounded-xl bg-stone-50 border border-stone-200 focus:bg-white focus:border-[#653977] outline-none text-stone-800" 
                    placeholder="Ej. Eternas & con luz LED, Variedad de colores"
                  />
                </div>

                {/* Visibility Toggle Switch */}
                <div className="pt-2 border-t border-stone-200/80">
                  <div className="flex items-center justify-between p-3 bg-stone-50 rounded-2xl border border-stone-200">
                    <div>
                      <span className="text-xs font-bold text-stone-800 block">
                        Visibilidad en la Tienda
                      </span>
                      <span className="text-[10px] text-stone-500 block">
                        {editingCategory.isVisible !== false ? 'Visible para los clientes en catálogo' : 'Oculta (no se muestra en catálogo)'}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => setEditingCategory({ ...editingCategory, isVisible: editingCategory.isVisible === false ? true : false })}
                      className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
                        editingCategory.isVisible !== false
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          : 'bg-stone-200 text-stone-600 border border-stone-300'
                      }`}
                    >
                      {editingCategory.isVisible !== false ? (
                        <>
                          <Eye className="w-3.5 h-3.5 text-emerald-700" />
                          <span>Visible</span>
                        </>
                      ) : (
                        <>
                          <EyeOff className="w-3.5 h-3.5 text-stone-500" />
                          <span>Oculta</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>

            </form>

            {/* Bottom Actions */}
            <div className="bg-white border-t border-stone-200 p-3 sm:p-4 flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => setIsEditingCategory(false)}
                className="py-3 px-4 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-600 font-bold text-xs cursor-pointer transition-colors"
              >
                Cancelar
              </button>

              <button
                type="submit"
                form="category-editor-form"
                className="flex-1 py-3 px-4 rounded-xl bg-[#653977] hover:bg-[#532d63] text-white font-black text-xs sm:text-sm shadow-md flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-[0.98]"
              >
                <Save className="w-4 h-4" />
                <span>{isCreatingNewCategory ? 'GUARDAR Y CREAR CATEGORÍA' : 'GUARDAR CAMBIOS'}</span>
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 7. CONFIRM DELETE CATEGORY MODAL */}
      {/* ========================================================================= */}
      {categoryToDelete && (
        <div className="fixed inset-0 z-70 flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-xs" onClick={() => setCategoryToDelete(null)} />
          <div className="relative bg-white rounded-2xl p-5 max-w-sm w-full shadow-2xl space-y-4 border border-rose-100 z-10 animate-in zoom-in-95">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <div className="text-center">
              <h4 className="text-base font-black text-stone-800">¿Eliminar esta categoría?</h4>
              <p className="text-xs text-stone-500 mt-1">
                Se eliminará la categoría <strong>"{categoryToDelete.name}"</strong> ({categoryToDelete.emoji}).
              </p>
              {products.filter(p => p.category === categoryToDelete.id).length > 0 && (
                <div className="mt-2.5 p-2.5 bg-amber-50 rounded-xl border border-amber-200 text-left">
                  <p className="text-[11px] text-amber-800 font-bold flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                    <span>Hay {products.filter(p => p.category === categoryToDelete.id).length} productos asignados a esta categoría.</span>
                  </p>
                  <p className="text-[10px] text-amber-700 mt-0.5">
                    Seguirán existiendo en tu catálogo pero deberás reasignarlos a otra categoría.
                  </p>
                </div>
              )}
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setCategoryToDelete(null)}
                className="flex-1 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleConfirmDeleteCategory}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-sm cursor-pointer"
              >
                Sí, Eliminar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 8. CONFIRM RESET CATEGORIES MODAL */}
      {/* ========================================================================= */}
      {isResetCategoriesConfirmOpen && (
        <div className="fixed inset-0 z-70 flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-xs" onClick={() => setIsResetCategoriesConfirmOpen(false)} />
          <div className="relative bg-white rounded-2xl p-5 max-w-sm w-full shadow-2xl space-y-4 border border-amber-100 z-10 animate-in zoom-in-95">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div className="text-center">
              <h4 className="text-base font-black text-stone-800">¿Restaurar categorías iniciales?</h4>
              <p className="text-xs text-stone-500 mt-1">
                Esto restablecerá la lista completa de categorías a las predeterminadas (Girasoles, Tulipanes, Clásicos, etc.).
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsResetCategoriesConfirmOpen(false)}
                className="flex-1 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={() => {
                  onResetCategories();
                  setIsResetCategoriesConfirmOpen(false);
                  showNotification('Categorías restauradas por defecto');
                }}
                className="flex-1 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-sm cursor-pointer"
              >
                Restaurar
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
