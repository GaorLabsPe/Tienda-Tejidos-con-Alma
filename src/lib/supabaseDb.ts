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

let detectedSchema: 'tejidos' | 'public' | null = null;

async function queryWithFallback<T = any>(
  operation: (client: any) => Promise<{ data: T | null; error: any }>
): Promise<{ data: T | null; error: any; usedSchema: 'tejidos' | 'public' | null }> {
  if (!supabase) {
    return { data: null, error: new Error('Supabase no inicializado'), usedSchema: null };
  }

  if (detectedSchema) {
    try {
      const client = supabase.schema(detectedSchema);
      const res = await operation(client);
      if (!res.error) {
        return { data: res.data, error: null, usedSchema: detectedSchema };
      }
    } catch {}
  }

  // Probar esquema 'tejidos'
  try {
    const clientTejidos = supabase.schema('tejidos');
    const resTejidos = await operation(clientTejidos);
    if (!resTejidos.error) {
      detectedSchema = 'tejidos';
      return { data: resTejidos.data, error: null, usedSchema: 'tejidos' };
    }
  } catch {}

  // Probar esquema 'public'
  try {
    const clientPublic = supabase.schema('public');
    const resPublic = await operation(clientPublic);
    if (!resPublic.error) {
      detectedSchema = 'public';
      return { data: resPublic.data, error: null, usedSchema: 'public' };
    }
    return { data: null, error: resPublic.error, usedSchema: 'public' };
  } catch (err: any) {
    return { data: null, error: err, usedSchema: null };
  }
}

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
    // 1. Productos
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

    // 3. Categorías
    const catRes = await queryWithFallback((c) => c.from('categories').select('id'));
    if (!catRes.error) {
      report.tables.categories.exists = true;
      report.tables.categories.count = Array.isArray(catRes.data) ? catRes.data.length : 0;
    } else {
      report.tables.categories.error = catRes.error.message || String(catRes.error);
    }

    // 4. Pedidos
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

export async function fetchStoreDataFromSupabase() {
  const result = {
    products: null as Product[] | null,
    settings: null as StoreSettings | null,
    categories: null as CategoryItem[] | null,
    activeSchema: detectedSchema,
  };

  if (!supabase) return result;

  try {
    // 1. Settings
    const { data: storeSettings, error: sErr } = await queryWithFallback(
      (client) => client.from('store_settings').select('*').limit(1).maybeSingle()
    );

    if (storeSettings && !sErr) {
      result.settings = {
        storeName: storeSettings.store_name || 'Tejidos & Ramos Eternos',
        whatsappNumber: storeSettings.whatsapp_number || '51987654321',
        whatsappDisplay: storeSettings.whatsapp_display || '+51 987 654 321',
        currency: storeSettings.currency || 'PEN',
        currencySymbol: storeSettings.currency_symbol || 'S/',
        yapeNumber: storeSettings.yapeNumber || storeSettings.yape_number || '987654321',
        plinNumber: storeSettings.plinNumber || storeSettings.plin_number || '987654321',
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

    // 2. Products
    const { data: productsData, error: pErr } = await queryWithFallback(
      (client) => client.from('products').select('*').order('created_at', { ascending: false })
    );

    if (productsData && !pErr && productsData.length > 0) {
      result.products = productsData.map((p: any) => ({
        id: p.id,
        name: p.name,
        category: p.category,
        categoryLabel: p.category_label || p.categoryLabel || '',
        price: Number(p.price),
        originalPrice: p.original_price ? Number(p.original_price) : undefined,
        description: p.description || '',
        includes: Array.isArray(p.includes) ? p.includes : [],
        image: p.image || '',
        badge: p.badge || undefined,
        rating: Number(p.rating || 5.0),
        reviewCount: Number(p.review_count || 10),
        preparationTime: p.preparation_time || '24 a 48 hrs',
        isVisible: p.is_visible !== false,
      }));
    }

    // 3. Categories
    const { data: catData, error: cErr } = await queryWithFallback(
      (client) => client.from('categories').select('*').order('id')
    );

    if (catData && !cErr && catData.length > 0) {
      result.categories = catData.map((c: any) => ({
        id: c.id,
        name: c.name,
        emoji: c.emoji || c.icon || '🌸',
        subtitle: c.subtitle || c.description || '',
        image: c.image || '',
        isVisible: c.is_visible !== false,
      }));
    }

    result.activeSchema = detectedSchema;
  } catch (err) {
    console.error('Error fetching data from Supabase:', err);
  }

  return result;
}

export async function syncProductToSupabase(product: Product, action: 'insert' | 'update' | 'delete') {
  if (!supabase) return { success: false, error: 'No client' };

  try {
    const targetSchema = detectedSchema || 'tejidos';
    const client = supabase.schema(targetSchema);

    if (action === 'delete') {
      const { error } = await client.from('products').delete().eq('id', product.id);
      if (error) {
        await supabase.schema('public').from('products').delete().eq('id', product.id);
      }
      return { success: true };
    }

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

    if (action === 'insert') {
      const { error } = await client.from('products').upsert(payload);
      if (error) {
        await supabase.schema('public').from('products').upsert(payload);
      }
    } else {
      const { error } = await client.from('products').update(payload).eq('id', product.id);
      if (error) {
        await supabase.schema('public').from('products').update(payload).eq('id', product.id);
      }
    }

    return { success: true };
  } catch (err: any) {
    console.error('Error syncing product:', err);
    return { success: false, error: err.message };
  }
}

export async function syncSettingsToSupabase(settings: StoreSettings) {
  if (!supabase) return { success: false };

  try {
    const targetSchema = detectedSchema || 'tejidos';
    const client = supabase.schema(targetSchema);

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

    const { data } = await client.from('store_settings').select('id').limit(1).maybeSingle();
    if (data?.id) {
      await client.from('store_settings').update(payload).eq('id', data.id);
    } else {
      await client.from('store_settings').insert([payload]);
    }
    return { success: true };
  } catch (err) {
    console.error('Error saving settings to Supabase:', err);
    return { success: false };
  }
}

export async function pushFullCatalogToSupabase(
  products: Product[],
  categories: CategoryItem[],
  settings: StoreSettings
) {
  if (!supabase) return { success: false, message: 'Supabase no está configurado.' };

  try {
    const health = await checkSupabaseHealth();
    const targetSchema = health.activeSchema || 'tejidos';
    const client = supabase.schema(targetSchema);

    // 1. Settings
    await syncSettingsToSupabase(settings);

    // 2. Categories
    for (const cat of categories) {
      await client.from('categories').upsert({
        id: cat.id,
        name: cat.name,
        emoji: cat.emoji || '🌸',
        subtitle: cat.subtitle || null,
        image: cat.image || null,
        is_visible: cat.isVisible !== false,
      });
    }

    // 3. Products
    for (const prod of products) {
      await client.from('products').upsert({
        id: prod.id,
        name: prod.name,
        category: prod.category,
        category_label: prod.categoryLabel,
        price: prod.price,
        original_price: prod.originalPrice || null,
        description: prod.description,
        includes: prod.includes,
        image: prod.image,
        badge: prod.badge || null,
        rating: prod.rating || 5.0,
        review_count: prod.reviewCount || 10,
        preparation_time: prod.preparationTime || '24 a 48 hrs',
        is_visible: prod.isVisible !== false,
      });
    }

    return { 
      success: true, 
      message: `¡Se sincronizaron ${products.length} productos, ${categories.length} categorías y la configuración en Supabase (${targetSchema})!` 
    };
  } catch (err: any) {
    return { success: false, message: err.message || 'Error al subir catálogo.' };
  }
}
