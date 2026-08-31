-- SUPABASE SCHEMA SETUP
-- Ejecuta este script en tu SQL Editor de Supabase

-- 1. CREAR TABLA DE AJUSTES (SETTINGS)
CREATE TABLE IF NOT EXISTS public.store_settings (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  store_name text NOT NULL DEFAULT 'Tejidos con Alma 💜',
  whatsapp_number text NOT NULL,
  whatsapp_display text NOT NULL,
  currency text NOT NULL DEFAULT 'PEN',
  currency_symbol text NOT NULL DEFAULT 'S/',
  yape_number text,
  plin_number text,
  delivery_cost numeric NOT NULL DEFAULT 8.00,
  free_delivery_threshold numeric NOT NULL DEFAULT 75.00,
  instagram_url text,
  facebook_url text,
  tiktok_url text,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Insertar configuración inicial si no existe
INSERT INTO public.store_settings (whatsapp_number, whatsapp_display, yape_number, plin_number)
SELECT '51987654321', '+51 987 654 321', '987 654 321', '987 654 321'
WHERE NOT EXISTS (SELECT 1 FROM public.store_settings);

-- 2. CREAR TABLA DE PRODUCTOS
CREATE TABLE IF NOT EXISTS public.products (
  id text PRIMARY KEY,
  name text NOT NULL,
  category text NOT NULL,
  category_label text,
  price numeric NOT NULL,
  description text NOT NULL,
  includes text[], -- Array of strings (features included)
  image text,
  badge text,
  rating numeric DEFAULT 5.0,
  review_count integer DEFAULT 0,
  preparation_time text,
  is_visible boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Configurar Storage (Stage para fotos)
-- Crear un bucket llamado "productos" (asegúrate de que sea público en el Dashboard)
INSERT INTO storage.buckets (id, name, public) VALUES ('productos', 'productos', true)
ON CONFLICT (id) DO NOTHING;

-- Políticas de seguridad (RLS) para permitir lectura pública y escritura anonima (para simplificar en tu app)
-- ¡Importante! En producción, deberías restringir la escritura a usuarios autenticados.
-- O como usarás una clave local en la app (1982), dejaremos el acceso por API abierto por ahora,
-- pero idealmente se usaría Auth de Supabase.

ALTER TABLE public.store_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Lectura pública de ajustes" ON public.store_settings FOR SELECT USING (true);
CREATE POLICY "Escritura de ajustes" ON public.store_settings FOR ALL USING (true); -- Permitimos todo por ahora para sincronizar desde la app admin

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Lectura pública de productos" ON public.products FOR SELECT USING (true);
CREATE POLICY "Escritura de productos" ON public.products FOR ALL USING (true);

-- Política para el storage (Permitir que cualquiera vea y suba imágenes - ¡Asegurar después!)
CREATE POLICY "Imágenes públicas" ON storage.objects FOR SELECT USING (bucket_id = 'productos');
CREATE POLICY "Subida de imágenes" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'productos');
CREATE POLICY "Edición de imágenes" ON storage.objects FOR UPDATE USING (bucket_id = 'productos');
CREATE POLICY "Borrado de imágenes" ON storage.objects FOR DELETE USING (bucket_id = 'productos');

-- NOTA: Como la contraseña '1982' la vas a manejar en el frontend, 
-- hemos abierto las políticas RLS a true (ALL) para que la app pueda actualizar sin login.
-- Si quieres mayor seguridad, deberías requerir Auth JWT.
