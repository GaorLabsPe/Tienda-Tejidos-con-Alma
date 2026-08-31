-- ==============================================================================
-- 🌸 TEJIDOS CON ALMA - ESQUEMA SUPABASE POSTGRESQL (SCHEMA: tejidos)
-- ==============================================================================

-- 1. CREAR EL ESQUEMA 'tejidos'
CREATE SCHEMA IF NOT EXISTS tejidos;

-- Asignar permisos sobre el esquema
GRANT USAGE, CREATE ON SCHEMA tejidos TO postgres, anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA tejidos TO postgres, anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA tejidos TO postgres, anon, authenticated, service_role;
GRANT ALL ON ALL ROUTINES IN SCHEMA tejidos TO postgres, anon, authenticated, service_role;

ALTER DEFAULT PRIVILEGES IN SCHEMA tejidos GRANT ALL ON TABLES TO postgres, anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA tejidos GRANT ALL ON SEQUENCES TO postgres, anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA tejidos GRANT ALL ON ROUTINES TO postgres, anon, authenticated, service_role;

-- Función automática para actualizar 'updated_at'
CREATE OR REPLACE FUNCTION tejidos.update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ==============================================================================
-- 2. TABLA: AJUSTES DE TIENDA (tejidos.store_settings)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS tejidos.store_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    store_name VARCHAR(150) NOT NULL DEFAULT 'Tejidos con Alma',
    tagline VARCHAR(255) DEFAULT 'Flores & Ramos Eternos a Crochet',
    whatsapp_number VARCHAR(30) NOT NULL DEFAULT '51987654321',
    whatsapp_display VARCHAR(30) NOT NULL DEFAULT '+51 987 654 321',
    currency VARCHAR(10) NOT NULL DEFAULT 'PEN',
    currency_symbol VARCHAR(10) NOT NULL DEFAULT 'S/',
    yape_number VARCHAR(30) DEFAULT '987 654 321',
    yape_holder VARCHAR(150) DEFAULT 'Tejidos con Alma E.I.R.L.',
    plin_number VARCHAR(30) DEFAULT '987 654 321',
    plin_holder VARCHAR(150) DEFAULT 'Tejidos con Alma',
    delivery_cost NUMERIC(10,2) NOT NULL DEFAULT 8.00 CHECK (delivery_cost >= 0),
    free_delivery_threshold NUMERIC(10,2) NOT NULL DEFAULT 75.00 CHECK (free_delivery_threshold >= 0),
    store_address TEXT DEFAULT 'Taller Artesanal - Entregas a todo Lima y Perú',
    opening_hours VARCHAR(150) DEFAULT 'Lunes a Domingo: 8:00 AM - 10:00 PM',
    
    -- Redes Sociales & Visibilidad
    tiktok_url TEXT DEFAULT 'https://www.tiktok.com/@tejidosconalma',
    show_tiktok BOOLEAN NOT NULL DEFAULT TRUE,
    instagram_url TEXT DEFAULT 'https://www.instagram.com/tejidosconalma',
    show_instagram BOOLEAN NOT NULL DEFAULT TRUE,
    facebook_url TEXT DEFAULT 'https://www.facebook.com/tejidosconalma',
    show_facebook BOOLEAN NOT NULL DEFAULT TRUE,
    
    admin_pin VARCHAR(20) NOT NULL DEFAULT '1982',
    banner_text VARCHAR(255) DEFAULT '🌸 ¡Ramos eternos para toda la vida! Envíos a todo Lima & Perú ✨',
    banner_active BOOLEAN NOT NULL DEFAULT TRUE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- ==============================================================================
-- 3. TABLA: CATEGORÍAS (tejidos.categories)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS tejidos.categories (
    id VARCHAR(80) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    full_name VARCHAR(150),
    emoji VARCHAR(20) DEFAULT '🌸',
    subtitle VARCHAR(150),
    image_url TEXT NOT NULL,
    sort_order INT DEFAULT 0,
    is_visible BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- ==============================================================================
-- 4. TABLA: PRODUCTOS (tejidos.products)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS tejidos.products (
    id VARCHAR(80) PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    category_id VARCHAR(80) NOT NULL REFERENCES tejidos.categories(id) ON UPDATE CASCADE ON DELETE RESTRICT,
    category_label VARCHAR(100) NOT NULL,
    price NUMERIC(10,2) NOT NULL CHECK (price >= 0),
    original_price NUMERIC(10,2) CHECK (original_price IS NULL OR original_price >= price),
    description TEXT NOT NULL,
    includes JSONB NOT NULL DEFAULT '[]'::jsonb,
    image_url TEXT NOT NULL,
    badge VARCHAR(50),
    is_popular BOOLEAN NOT NULL DEFAULT FALSE,
    is_new BOOLEAN NOT NULL DEFAULT FALSE,
    rating NUMERIC(3,2) DEFAULT 5.00 CHECK (rating >= 0 AND rating <= 5),
    review_count INT DEFAULT 0,
    preparation_time VARCHAR(100) DEFAULT 'Listo para entrega inmediata / 24 hrs',
    is_visible BOOLEAN NOT NULL DEFAULT TRUE,
    stock INT DEFAULT 999 CHECK (stock >= 0),
    available_colors JSONB DEFAULT '[]'::jsonb,
    unit_tiers JSONB DEFAULT '[]'::jsonb,
    customizable_wrapping BOOLEAN NOT NULL DEFAULT TRUE,
    customizable_ribbon BOOLEAN NOT NULL DEFAULT TRUE,
    default_extras JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- ==============================================================================
-- 5. TABLA: ENVOLTURAS (tejidos.wrappings)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS tejidos.wrappings (
    id VARCHAR(80) PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    description TEXT,
    extra_price NUMERIC(10,2) NOT NULL DEFAULT 0.00 CHECK (extra_price >= 0),
    image_url TEXT,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- ==============================================================================
-- 6. TABLA: LAZOS Y CINTAS (tejidos.ribbons)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS tejidos.ribbons (
    id VARCHAR(80) PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    color_hex VARCHAR(25) NOT NULL DEFAULT '#653977',
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- ==============================================================================
-- 7. TABLA: ADICIONALES Y EXTRAS (tejidos.product_extras)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS tejidos.product_extras (
    id VARCHAR(80) PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    price NUMERIC(10,2) NOT NULL DEFAULT 0.00 CHECK (price >= 0),
    icon VARCHAR(20) DEFAULT '✨',
    description TEXT,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- ==============================================================================
-- 8. TABLA: FLORES PERSONALIZADAS (tejidos.custom_flower_options)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS tejidos.custom_flower_options (
    id VARCHAR(80) PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    price_per_unit NUMERIC(10,2) NOT NULL CHECK (price_per_unit >= 0),
    icon VARCHAR(20) DEFAULT '🌻',
    available_colors JSONB NOT NULL DEFAULT '[]'::jsonb,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- ==============================================================================
-- 9. TABLA: CUPONES (tejidos.coupons)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS tejidos.coupons (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(50) UNIQUE NOT NULL,
    discount_type VARCHAR(20) NOT NULL DEFAULT 'percentage' CHECK (discount_type IN ('percentage', 'fixed')),
    discount_value NUMERIC(10,2) NOT NULL CHECK (discount_value > 0),
    min_spend NUMERIC(10,2) DEFAULT 0.00,
    max_discount NUMERIC(10,2),
    valid_from TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
    valid_until TIMESTAMP WITH TIME ZONE,
    usage_limit INT,
    times_used INT DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- ==============================================================================
-- 10. TABLA: CLIENTES (tejidos.customers)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS tejidos.customers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name VARCHAR(150) NOT NULL,
    phone VARCHAR(30) NOT NULL,
    email VARCHAR(150),
    default_city VARCHAR(80) DEFAULT 'Lima',
    default_district VARCHAR(100),
    default_address TEXT,
    default_reference TEXT,
    total_orders INT DEFAULT 0,
    total_spent NUMERIC(12,2) DEFAULT 0.00,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- ==============================================================================
-- 11. TABLA: PEDIDOS (tejidos.orders)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS tejidos.orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_code VARCHAR(40) UNIQUE NOT NULL,
    customer_id UUID REFERENCES tejidos.customers(id) ON DELETE SET NULL,
    customer_name VARCHAR(150) NOT NULL,
    customer_phone VARCHAR(30) NOT NULL,
    customer_email VARCHAR(150),
    delivery_type VARCHAR(20) NOT NULL DEFAULT 'delivery' CHECK (delivery_type IN ('delivery', 'pickup')),
    recipient_name VARCHAR(150),
    recipient_phone VARCHAR(30),
    delivery_city VARCHAR(80) DEFAULT 'Lima',
    delivery_district VARCHAR(100),
    delivery_address TEXT,
    delivery_reference TEXT,
    delivery_date DATE,
    delivery_time_slot VARCHAR(80),
    dedication_message TEXT,
    include_aroma BOOLEAN DEFAULT TRUE,
    include_polaroid BOOLEAN DEFAULT FALSE,
    polaroid_image_url TEXT,
    payment_method VARCHAR(30) NOT NULL DEFAULT 'yape' CHECK (payment_method IN ('yape', 'plin', 'transferencia', 'efectivo', 'tarjeta')),
    payment_status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'verified', 'rejected', 'refunded')),
    payment_voucher_url TEXT,
    subtotal NUMERIC(10,2) NOT NULL CHECK (subtotal >= 0),
    delivery_fee NUMERIC(10,2) NOT NULL DEFAULT 0.00 CHECK (delivery_fee >= 0),
    discount NUMERIC(10,2) NOT NULL DEFAULT 0.00 CHECK (discount >= 0),
    coupon_code VARCHAR(50),
    total_amount NUMERIC(10,2) NOT NULL CHECK (total_amount >= 0),
    order_status VARCHAR(30) NOT NULL DEFAULT 'pending' CHECK (order_status IN ('pending', 'confirmed', 'in_production', 'ready', 'in_delivery', 'delivered', 'cancelled')),
    customer_notes TEXT,
    admin_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- ==============================================================================
-- 12. TABLA: DETALLES DE PEDIDO (tejidos.order_items)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS tejidos.order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES tejidos.orders(id) ON DELETE CASCADE,
    product_id VARCHAR(80) REFERENCES tejidos.products(id) ON DELETE SET NULL,
    product_name VARCHAR(200) NOT NULL,
    product_image TEXT,
    quantity INT NOT NULL CHECK (quantity > 0),
    unit_price NUMERIC(10,2) NOT NULL CHECK (unit_price >= 0),
    total_price NUMERIC(10,2) NOT NULL CHECK (total_price >= 0),
    selected_color VARCHAR(100),
    selected_units INT,
    selected_wrapping VARCHAR(150),
    selected_ribbon VARCHAR(150),
    selected_extras JSONB DEFAULT '[]'::jsonb,
    custom_flowers_breakdown JSONB DEFAULT '[]'::jsonb,
    item_dedication_text TEXT,
    special_instructions TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- ==============================================================================
-- 13. TRIGGERS DE ACTUALIZACIÓN
-- ==============================================================================
DROP TRIGGER IF EXISTS tr_settings_upd ON tejidos.store_settings;
CREATE TRIGGER tr_settings_upd BEFORE UPDATE ON tejidos.store_settings FOR EACH ROW EXECUTE FUNCTION tejidos.update_timestamp();

DROP TRIGGER IF EXISTS tr_cat_upd ON tejidos.categories;
CREATE TRIGGER tr_cat_upd BEFORE UPDATE ON tejidos.categories FOR EACH ROW EXECUTE FUNCTION tejidos.update_timestamp();

DROP TRIGGER IF EXISTS tr_prod_upd ON tejidos.products;
CREATE TRIGGER tr_prod_upd BEFORE UPDATE ON tejidos.products FOR EACH ROW EXECUTE FUNCTION tejidos.update_timestamp();

DROP TRIGGER IF EXISTS tr_cust_upd ON tejidos.customers;
CREATE TRIGGER tr_cust_upd BEFORE UPDATE ON tejidos.customers FOR EACH ROW EXECUTE FUNCTION tejidos.update_timestamp();

DROP TRIGGER IF EXISTS tr_ord_upd ON tejidos.orders;
CREATE TRIGGER tr_ord_upd BEFORE UPDATE ON tejidos.orders FOR EACH ROW EXECUTE FUNCTION tejidos.update_timestamp();

-- ==============================================================================
-- 14. POLÍTICAS DE SEGURIDAD (RLS)
-- ==============================================================================
ALTER TABLE tejidos.store_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE tejidos.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE tejidos.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE tejidos.wrappings ENABLE ROW LEVEL SECURITY;
ALTER TABLE tejidos.ribbons ENABLE ROW LEVEL SECURITY;
ALTER TABLE tejidos.product_extras ENABLE ROW LEVEL SECURITY;
ALTER TABLE tejidos.custom_flower_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE tejidos.coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE tejidos.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE tejidos.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE tejidos.order_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "pub_read_settings" ON tejidos.store_settings FOR SELECT USING (true);
CREATE POLICY "pub_read_categories" ON tejidos.categories FOR SELECT USING (is_visible = true);
CREATE POLICY "pub_read_products" ON tejidos.products FOR SELECT USING (is_visible = true);
CREATE POLICY "pub_read_wrappings" ON tejidos.wrappings FOR SELECT USING (is_active = true);
CREATE POLICY "pub_read_ribbons" ON tejidos.ribbons FOR SELECT USING (is_active = true);
CREATE POLICY "pub_read_extras" ON tejidos.product_extras FOR SELECT USING (is_active = true);
CREATE POLICY "pub_read_flowers" ON tejidos.custom_flower_options FOR SELECT USING (is_active = true);
CREATE POLICY "pub_read_coupons" ON tejidos.coupons FOR SELECT USING (is_active = true);

CREATE POLICY "pub_insert_orders" ON tejidos.orders FOR INSERT WITH CHECK (true);
CREATE POLICY "pub_insert_order_items" ON tejidos.order_items FOR INSERT WITH CHECK (true);
CREATE POLICY "pub_all_customers" ON tejidos.customers FOR ALL USING (true);

CREATE POLICY "adm_settings" ON tejidos.store_settings FOR ALL USING (true);
CREATE POLICY "adm_categories" ON tejidos.categories FOR ALL USING (true);
CREATE POLICY "adm_products" ON tejidos.products FOR ALL USING (true);
CREATE POLICY "adm_wrappings" ON tejidos.wrappings FOR ALL USING (true);
CREATE POLICY "adm_ribbons" ON tejidos.ribbons FOR ALL USING (true);
CREATE POLICY "adm_extras" ON tejidos.product_extras FOR ALL USING (true);
CREATE POLICY "adm_flowers" ON tejidos.custom_flower_options FOR ALL USING (true);
CREATE POLICY "adm_coupons" ON tejidos.coupons FOR ALL USING (true);
CREATE POLICY "adm_orders" ON tejidos.orders FOR ALL USING (true);
CREATE POLICY "adm_order_items" ON tejidos.order_items FOR ALL USING (true);

-- ==============================================================================
-- 15. DATOS INICIALES DE EJEMPLO
-- ==============================================================================
INSERT INTO tejidos.store_settings (
    store_name, whatsapp_number, whatsapp_display, yape_number, yape_holder,
    delivery_cost, free_delivery_threshold, tiktok_url, show_tiktok, instagram_url, show_instagram,
    facebook_url, show_facebook, admin_pin
) VALUES (
    'Tejidos con Alma', '51987654321', '+51 987 654 321', '987 654 321', 'Tejidos con Alma E.I.R.L.',
    8.00, 75.00, 'https://www.tiktok.com/@tejidosconalma', true,
    'https://www.instagram.com/tejidosconalma', true,
    'https://www.facebook.com/tejidosconalma', true, '1982'
) ON CONFLICT DO NOTHING;

INSERT INTO tejidos.categories (id, name, full_name, emoji, subtitle, image_url, sort_order, is_visible) VALUES
('girasoles', 'Girasoles', 'Ramos con Girasol', '🌻', 'Eternos & luz cálida', 'https://images.unsplash.com/photo-1597848212624-a19eb35e2651?w=800&auto=format&fit=crop&q=80', 1, true),
('tulipanes', 'Tulipanes', 'Tulipanes Holandeses', '🌷', 'Pasteles y luz suave', 'https://images.unsplash.com/photo-1520763185298-1b434c919102?w=800&auto=format&fit=crop&q=80', 2, true),
('rosas', 'Rosas', 'Rosas Eternas', '🌹', 'Rojo pasión y pasteles', 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop&q=80', 3, true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO tejidos.wrappings (id, name, description, extra_price, sort_order) VALUES
('coreano-blanco', 'Papel Coreano Blanco / Crema', 'Elegante y delicado con acabado satinado', 0.00, 1),
('kraft-vintage', 'Papel Kraft Rústico', 'Toque natural y cálido artesanal', 0.00, 2),
('negro-lujo', 'Papel Negro Mate Luxury', 'Alto contraste dramático y sofisticado', 2.00, 3)
ON CONFLICT (id) DO NOTHING;

INSERT INTO tejidos.ribbons (id, name, color_hex, sort_order) VALUES
('dorado-tela', 'Lazo Dorado Satinado', '#EAB308', 1),
('morado-lila', 'Cinta Morado / Lila Pastel', '#C084FC', 2),
('rojo-pasion', 'Lazo Rojo Carmesí', '#EF4444', 3)
ON CONFLICT (id) DO NOTHING;

INSERT INTO tejidos.product_extras (id, name, price, icon, description, sort_order) VALUES
('abejita-extra', 'Abejita tejida a mano 🐝', 5.00, '🐝', 'Tierna abejita crochet para acompañar el ramo', 1),
('luces-led', 'Luces Hada LED Cálidas ✨', 6.00, '✨', 'Ilumina el ramo mágicamente (incluye pilas)', 2),
('foto-polaroid-extra', 'Foto tipo Polaroid Adicional 📷', 3.50, '📷', 'Impresión en alta calidad con frase al reverso', 3)
ON CONFLICT (id) DO NOTHING;

INSERT INTO tejidos.products (
    id, name, category_id, category_label, price, original_price, description, 
    includes, image_url, badge, is_popular, is_new, rating, review_count, 
    preparation_time, available_colors, customizable_wrapping, customizable_ribbon
) VALUES
(
    'girasol-luz-individual',
    'Girasol Eterno con Luz Cálida',
    'girasoles',
    'Girasoles',
    25.00,
    30.00,
    'Hermoso girasol tejido a mano con hilo de algodón antialérgico, acompañado de luces LED micro-hada.',
    '["1 Girasol grande tejido a mano", "Guirnalda de luz LED cálida con pilas", "Envoltura coreana impermeable", "Tarjeta dedicatoria personalizada", "Esencia floral aromática"]'::jsonb,
    'https://images.unsplash.com/photo-1597848212624-a19eb35e2651?w=800&auto=format&fit=crop&q=80',
    'Más Vendido ⭐',
    true,
    false,
    5.00,
    48,
    'Listo para entrega inmediata',
    '["Amarillo Intenso", "Amarillo Pastel", "Naranja Cálido"]'::jsonb,
    true,
    true
)
ON CONFLICT (id) DO NOTHING;
