import { supabase } from './supabase';
import { Product, StoreSettings, CategoryItem } from '../types';

export interface SupabaseHealthReport {
  connected: boolean;
  activeSchema: 'tejidos' | 'public' | null;
  tables: {
    products: { exists: boolean; count: number; error?: string };
    store_settings: { exists: boolean; count: number; error?: string };
    categories: { exists: boolean; count: number; error?: string };
    orders: { exists: boolean; count: number; error?: string };
  };
  storage: {
    bucket: string | null;
    accessible: boolean;
    error?: string;
  };
  overallStatus: 'ok' | 'partial' | 'error';
  errorMessage?: string;
}

let activeSchemaCache: 'tejidos' | 'public' | null = null;

/**
 * Run a query trying both 'tejidos' schema and standard default ('public') schema
 */
async function queryWithFallback<T = any>(
  operation: (client: any) => Promise<{ data: T | null; error: any }>
): Promise<{ data: T | null; error: any; usedSchema: 'tejidos' | 'public' | null }> {
  if (!supabase) {
    return { data: null, error: new Error('Supabase no inicializado'), usedSchema: null };
  }

  // 1. If we already know the working schema, try it first
  if (activeSchemaCache) {
    try {
      const client = activeSchemaCache === 'tejidos' ? supabase.schema('tejidos') : supabase;
      const res = await operation(client);
      if (!res.error && res.data !== null) {
        return { data: res.data, error: null, usedSchema: activeSchemaCache };
      }
    } catch {}
  }

  // 2. Try schema 'tejidos'
  try {
    const clientTejidos = supabase.schema('tejidos');
    const resTejidos = await operation(clientTejidos);
    if (!resTejidos.error) {
      activeSchemaCache = 'tejidos';
      return { data: resTejidos.data, error: null, usedSchema: 'tejidos' };
    }
  } catch {}

  // 3. Try default / public schema
  try {
    const clientPublic = supabase;
    const resPublic = await operation(clientPublic);
    if (!resPublic.error) {
      activeSchemaCache = 'public';
      return { data: resPublic.data, error: null, usedSchema: 'public' };
    }
    return { data: null, error: resPublic.error, usedSchema: 'public' };
  } catch (err: any) {
    return { data: null, error: err, usedSchema: null };
  }
}

/**
 * Diagnostic health check
 */
export async function checkSupabaseHealth(): Promise<SupabaseHealthReport> {
  const report: SupabaseHealthReport = {
    connected: false,
    activeSchema: null,
    tables: {
      products: { exists: false, count: 0 },
      store_settings: { exists: false, count: 0 },
      categories: { exists: false, count: 0 },
      orders: { exists: false, count: 0 },
    },
    storage: {
      bucket: null,
      accessible: false,
    },
    overallStatus: 'error',
  };

  if (!supabase) {
    report.errorMessage = 'Credenciales de Supabase no configuradas.';
    return report;
  }

  try {
    // 1. Products
    const prodRes = await queryWithFallback((c) => c.from('products').select('id'));
    if (!prodRes.error) {
      report.connected = true;
      report.activeSchema = prodRes.usedSchema;
      report.tables.products.exists = true;
      report.tables.products.count = Array.isArray(prodRes.data) ? prodRes.data.length : 0;
    } else {
      report.tables.products.error = prodRes.error.message || String(prodRes.error);
    }

    // 2. Settings
    const settingsRes = await queryWithFallback((c) => c.from('store_settings').select('id'));
    if (!settingsRes.error) {
      report.tables.store_settings.exists = true;
      report.tables.store_settings.count = Array.isArray(settingsRes.data) ? settingsRes.data.length : 0;
      if (!report.activeSchema) report.activeSchema = settingsRes.usedSchema;
      report.connected = true;
    } else {
      report.tables.store_settings.error = settingsRes.error.message || String(settingsRes.error);
    }

    // 3. Categories
    const catRes = await queryWithFallback((c) => c.from('categories').select('id'));
    if (!catRes.error) {
      report.tables.categories.exists = true;
      report.tables.categories.count = Array.isArray(catRes.data) ? catRes.data.length : 0;
    } else {
      report.tables.categories.error = catRes.error.message || String(catRes.error);
    }

    // 4. Orders
    const ordersRes = await queryWithFallback((c) => c.from('orders').select('id'));
    if (!ordersRes.error) {
      report.tables.orders.exists = true;
      report.tables.orders.count = Array.isArray(ordersRes.data) ? ordersRes.data.length : 0;
    } else {
      report.tables.orders.error = ordersRes.error.message || String(ordersRes.error);
    }

    // 5. Storage
    const bucketCandidates = ['TEJIDOS', 'tejidos'];
    for (const bName of bucketCandidates) {
      try {
        const { data: bucketList, error: bucketErr } = await supabase.storage.from(bName).list('', { limit: 1 });
        if (!bucketErr && bucketList) {
          report.storage.bucket = bName;
          report.storage.accessible = true;
          break;
        } else if (bucketErr) {
          report.storage.error = bucketErr.message;
        }
      } catch (err: any) {
        report.storage.error = err.message || String(err);
      }
    }

    if (report.connected && report.tables.products.exists) {
      report.overallStatus = 'ok';
    } else if (report.connected) {
      report.overallStatus = 'partial';
    } else {
      report.overallStatus = 'error';
    }

    return report;
  } catch (err: any) {
    report.errorMessage = err.message || String(err);
    return report;
  }
}

/**
 * Fetch all store data from Supabase
 */
export async function fetchStoreDataFromSupabase() {
  const result = {
    products: null as Product[] | null,
    settings: null as StoreSettings | null,
    categories: null as CategoryItem[] | null,
    activeSchema: activeSchemaCache,
  };

  if (!supabase) return result;

  try {
    // 1. Settings
    const { data: storeSettings, error: sErr } = await queryWithFallback(
      (client) => client.from('store_settings').select('*').limit(1).maybeSingle()
    );

    if (storeSettings && !sErr) {
      result.settings = {
        storeName: storeSettings.store_name || storeSettings.storeName || 'Tejidos & Ramos Eternos',
        whatsappNumber: storeSettings.whatsapp_number || storeSettings.whatsappNumber || '51987654321',
        whatsappDisplay: storeSettings.whatsapp_display || storeSettings.whatsappDisplay || '+51 987 654 321',
        currency: storeSettings.currency || 'PEN',
        currencySymbol: storeSettings.currency_symbol || storeSettings.currencySymbol || 'S/',
        yapeNumber: storeSettings.yape_number || storeSettings.yapeNumber || '987654321',
        plinNumber: storeSettings.plin_number || storeSettings.plinNumber || '987654321',
        deliveryCost: Number(storeSettings.delivery_cost ?? storeSettings.deliveryCost ?? 10),
        freeDeliveryThreshold: Number(storeSettings.free_delivery_threshold ?? storeSettings.freeDeliveryThreshold ?? 120),
        storeAddress: storeSettings.store_address || storeSettings.storeAddress || 'Av. Las Flores 123, Miraflores',
        openingHours: storeSettings.opening_hours || storeSettings.openingHours || 'Lun - Sáb: 9:00 AM - 8:00 PM',
        tiktokUrl: storeSettings.tiktok_url || storeSettings.tiktokUrl || '',
        showTiktok: storeSettings.show_tiktok ?? storeSettings.showTiktok ?? true,
        instagramUrl: storeSettings.instagram_url || storeSettings.instagramUrl || '',
        showInstagram: storeSettings.show_instagram ?? storeSettings.showInstagram ?? true,
        facebookUrl: storeSettings.facebook_url || storeSettings.facebookUrl || '',
        showFacebook: storeSettings.show_facebook ?? storeSettings.showFacebook ?? true,
        adminPin: storeSettings.admin_pin || storeSettings.adminPin || '1982',
      };
    }

    // 2. Products (Query without strictly requiring created_at to avoid column mismatch)
    const { data: productsData, error: pErr } = await queryWithFallback(
      (client) => client.from('products').select('*')
    );

    if (productsData && !pErr && productsData.length > 0) {
      result.products = productsData.map((p: any) => ({
        id: String(p.id),
        name: String(p.name || 'Ramo'),
        category: String(p.category || 'girasoles'),
        categoryLabel: String(p.category_label || p.categoryLabel || 'Ramos'),
        price: Number(p.price || 0),
        originalPrice: p.original_price ? Number(p.original_price) : (p.originalPrice ? Number(p.originalPrice) : undefined),
        description: String(p.description || ''),
        includes: Array.isArray(p.includes) ? p.includes : (typeof p.includes === 'string' ? JSON.parse(p.includes || '[]') : []),
        image: String(p.image || ''),
        badge: p.badge ? String(p.badge) : undefined,
        rating: Number(p.rating || 5.0),
        reviewCount: Number(p.review_count || p.reviewCount || 10),
        preparationTime: String(p.preparation_time || p.preparationTime || '24 a 48 hrs'),
        isVisible: p.is_visible !== false && p.isVisible !== false,
      }));
    }

    // 3. Categories
    const { data: catData, error: cErr } = await queryWithFallback(
      (client) => client.from('categories').select('*')
    );

    if (catData && !cErr && catData.length > 0) {
      result.categories = catData.map((c: any) => ({
        id: String(c.id),
        name: String(c.name),
        emoji: String(c.emoji || c.icon || '🌸'),
        subtitle: String(c.subtitle || c.description || ''),
        image: String(c.image || ''),
        isVisible: c.is_visible !== false && c.isVisible !== false,
      }));
    }

    result.activeSchema = activeSchemaCache;
  } catch (err) {
    console.error('Error fetching data from Supabase:', err);
  }

  return result;
}

/**
 * Universal upsert/delete for a product that writes to both 'tejidos' and 'public'
 */
export async function syncProductToSupabase(product: Product, action: 'insert' | 'update' | 'delete') {
  if (!supabase) return { success: false, error: 'No client' };

  try {
    const payload = {
      id: product.id,
      name: product.name,
      category: product.category,
      category_label: product.categoryLabel,
      price: product.price,
      original_price: product.originalPrice || null,
      description: product.description,
      includes: product.includes,
      image: product.image,
      badge: product.badge || null,
      rating: product.rating || 5.0,
      review_count: product.reviewCount || 10,
      preparation_time: product.preparationTime || '24 a 48 hrs',
      is_visible: product.isVisible !== false,
    };

    if (action === 'delete') {
      try {
        await supabase.schema('tejidos').from('products').delete().eq('id', product.id);
      } catch {}
      try {
        await supabase.from('products').delete().eq('id', product.id);
      } catch {}
      return { success: true };
    }

    // Try schema 'tejidos' first
    let saved = false;
    try {
      const { error: errTejidos } = await supabase.schema('tejidos').from('products').upsert(payload, { onConflict: 'id' });
      if (!errTejidos) {
        saved = true;
        activeSchemaCache = 'tejidos';
      }
    } catch {}

    // Also try/fallback to default 'public' schema
    try {
      const { error: errPublic } = await supabase.from('products').upsert(payload, { onConflict: 'id' });
      if (!errPublic) {
        saved = true;
        if (!activeSchemaCache) activeSchemaCache = 'public';
      }
    } catch {}

    return { success: saved };
  } catch (err: any) {
    console.error('Error in syncProductToSupabase:', err);
    return { success: false, error: err.message };
  }
}

/**
 * Universal sync for Store Settings
 */
export async function syncSettingsToSupabase(settings: StoreSettings) {
  if (!supabase) return { success: false };

  try {
    const payload = {
      store_name: settings.storeName,
      whatsapp_number: settings.whatsappNumber,
      whatsapp_display: settings.whatsappDisplay,
      currency: settings.currency,
      currency_symbol: settings.currencySymbol,
      yape_number: settings.yapeNumber,
      plin_number: settings.plinNumber,
      delivery_cost: settings.deliveryCost,
      free_delivery_threshold: settings.freeDeliveryThreshold,
      store_address: settings.storeAddress,
      opening_hours: settings.openingHours,
      tiktok_url: settings.tiktokUrl,
      show_tiktok: settings.showTiktok,
      instagram_url: settings.instagramUrl,
      show_instagram: settings.showInstagram,
      facebook_url: settings.facebookUrl,
      show_facebook: settings.showFacebook,
      admin_pin: settings.adminPin,
    };

    // Try 'tejidos' schema
    try {
      const { data: existTejidos } = await supabase.schema('tejidos').from('store_settings').select('id').limit(1).maybeSingle();
      if (existTejidos?.id) {
        await supabase.schema('tejidos').from('store_settings').update(payload).eq('id', existTejidos.id);
      } else {
        await supabase.schema('tejidos').from('store_settings').insert([payload]);
      }
    } catch {}

    // Try default schema
    try {
      const { data: existPublic } = await supabase.from('store_settings').select('id').limit(1).maybeSingle();
      if (existPublic?.id) {
        await supabase.from('store_settings').update(payload).eq('id', existPublic.id);
      } else {
        await supabase.from('store_settings').insert([payload]);
      }
    } catch {}

    return { success: true };
  } catch (err) {
    console.error('Error saving settings to Supabase:', err);
    return { success: false };
  }
}

/**
 * Push full current catalog to Supabase
 */
export async function pushFullCatalogToSupabase(
  products: Product[],
  categories: CategoryItem[],
  settings: StoreSettings
) {
  if (!supabase) return { success: false, message: 'Supabase no está configurado.' };

  try {
    // 1. Settings
    await syncSettingsToSupabase(settings);

    // 2. Categories
    for (const cat of categories) {
      const catPayload = {
        id: cat.id,
        name: cat.name,
        emoji: cat.emoji || '🌸',
        subtitle: cat.subtitle || null,
        image: cat.image || null,
        is_visible: cat.isVisible !== false,
      };
      try {
        await supabase.schema('tejidos').from('categories').upsert(catPayload, { onConflict: 'id' });
      } catch {}
      try {
        await supabase.from('categories').upsert(catPayload, { onConflict: 'id' });
      } catch {}
    }

    // 3. Products
    for (const prod of products) {
      await syncProductToSupabase(prod, 'update');
    }

    return { 
      success: true, 
      message: `¡Se sincronizaron ${products.length} productos, ${categories.length} categorías y la configuración en Supabase!` 
    };
  } catch (err: any) {
    return { success: false, message: err.message || 'Error al subir catálogo.' };
  }
}
