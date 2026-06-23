
-- Roles enum + table
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL DEFAULT 'user',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN LANGUAGE SQL STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

CREATE POLICY "Users can read their own roles" ON public.user_roles
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

-- Products
CREATE TABLE public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  category TEXT NOT NULL,
  description TEXT,
  short_description TEXT,
  price NUMERIC(12,2),
  material TEXT,
  dimensions TEXT,
  images TEXT[] NOT NULL DEFAULT '{}',
  featured BOOLEAN NOT NULL DEFAULT false,
  is_new BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.products TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.products TO authenticated;
GRANT ALL ON public.products TO service_role;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view products" ON public.products
  FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admins can insert products" ON public.products
  FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update products" ON public.products
  FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete products" ON public.products
  FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Enquiries
CREATE TABLE public.enquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  subject TEXT,
  message TEXT NOT NULL,
  product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
  status TEXT NOT NULL DEFAULT 'new',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT INSERT ON public.enquiries TO anon, authenticated;
GRANT SELECT, UPDATE, DELETE ON public.enquiries TO authenticated;
GRANT ALL ON public.enquiries TO service_role;
ALTER TABLE public.enquiries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit enquiries" ON public.enquiries
  FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Admins can view enquiries" ON public.enquiries
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update enquiries" ON public.enquiries
  FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete enquiries" ON public.enquiries
  FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Updated_at trigger
CREATE OR REPLACE FUNCTION public.set_updated_at() RETURNS TRIGGER
LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;
CREATE TRIGGER trg_products_updated BEFORE UPDATE ON public.products
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Seed products
INSERT INTO public.products (name, slug, category, short_description, description, price, material, dimensions, featured, is_new) VALUES
('Pallava Lounge Chair', 'pallava-lounge-chair', 'Sofa', 'Hand-rubbed teak with brass detail', 'A sculptural lounge chair crafted from solid Burmese teak and finished with hand-rubbed oils. Brass capped feet add a moment of restrained luxury.', 84000, 'Solid Burmese Teak / Brass', 'W 720 × D 820 × H 740 mm', true, true),
('Madras Refectory Table', 'madras-refectory-table', 'Dining Table', 'Solid rosewood 8-seater', 'A generous refectory table in solid rosewood. Architectural trestle legs and a finger-jointed top read as quietly monumental in any space.', 145000, 'Solid Indian Rosewood', 'L 2400 × W 1000 × H 760 mm', true, false),
('Atelier Modular Wardrobe', 'atelier-modular-wardrobe', 'Wardrobe', 'Cane weave and walnut', 'A fully modular wardrobe system. Soft-close doors, integrated lighting and a cane-weave front in walnut veneer.', 165000, 'Walnut Veneer / Cane', 'W 2400 × D 600 × H 2400 mm', true, true),
('Coromandel Platform Bed', 'coromandel-platform-bed', 'Bed', 'Low-slung king platform', 'Quiet, low-slung king bed with a softly padded headboard wrapped in natural linen. Solid teak frame beneath.', 98000, 'Linen / Solid Teak', 'L 2100 × W 2000 × H 900 mm', false, false),
('Cholamandal Executive Desk', 'cholamandal-executive-desk', 'Office Furniture', 'Architectural writing desk', 'A generous writing desk with hand-cut dovetails and a brushed brass cable channel.', 76000, 'Teak / Brushed Brass', 'L 1800 × W 800 × H 760 mm', false, true),
('Adyar Linen Sofa', 'adyar-linen-sofa', 'Sofa', 'Three-seat island sofa', 'Deep-seated three-seat sofa upholstered in Belgian linen. Hand-tied coil suspension and a kiln-dried teak frame.', 132000, 'Belgian Linen / Teak Frame', 'L 2200 × D 950 × H 780 mm', true, false);
