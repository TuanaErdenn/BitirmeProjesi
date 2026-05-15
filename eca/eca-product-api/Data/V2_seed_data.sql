-- ===========================================
-- SEED DATA - E-Commerce Product Catalog
-- ===========================================

-- Categories
INSERT INTO categories (name, slug) VALUES
  ('Electronics', 'electronics'),
  ('Clothing', 'clothing'),
  ('Home & Garden', 'home-garden'),
  ('Sports & Outdoors', 'sports-outdoors'),
  ('Books', 'books'),
  ('Toys & Games', 'toys-games'),
  ('Beauty & Personal Care', 'beauty-personal-care'),
  ('Food & Beverages', 'food-beverages');

-- Products
INSERT INTO products (sku, name, description, image_url, price_cents, currency, is_active) VALUES
  -- Electronics
  ('ELEC-001', 'Wireless Bluetooth Headphones', 'Premium noise-canceling headphones with 30-hour battery life and crystal-clear sound quality.', 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop', 12999, 'USD', true),
  ('ELEC-002', 'Smart Watch Pro', 'Advanced fitness tracker with heart rate monitor, GPS, and water resistance up to 50m.', 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop', 29999, 'USD', true),
  ('ELEC-003', 'Portable Power Bank 20000mAh', 'Fast-charging power bank with dual USB ports and LED display.', 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=400&h=400&fit=crop', 4999, 'USD', true),
  ('ELEC-004', 'Mechanical Gaming Keyboard', 'RGB backlit mechanical keyboard with Cherry MX switches and programmable keys.', 'https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?w=400&h=400&fit=crop', 14999, 'USD', true),
  ('ELEC-005', 'Wireless Charging Pad', 'Qi-compatible fast wireless charger for smartphones and earbuds.', 'https://images.unsplash.com/photo-1586816879360-004f5b0c51e3?w=400&h=400&fit=crop', 2999, 'USD', true),

  -- Clothing
  ('CLTH-001', 'Classic Cotton T-Shirt', 'Comfortable 100% organic cotton t-shirt available in multiple colors.', 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop', 2499, 'USD', true),
  ('CLTH-002', 'Slim Fit Denim Jeans', 'Modern slim fit jeans with stretch fabric for all-day comfort.', 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=400&fit=crop', 5999, 'USD', true),
  ('CLTH-003', 'Wool Blend Winter Coat', 'Elegant wool blend coat with warm lining, perfect for cold weather.', 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=400&h=400&fit=crop', 18999, 'USD', true),
  ('CLTH-004', 'Running Sneakers', 'Lightweight running shoes with responsive cushioning and breathable mesh.', 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop', 8999, 'USD', true),
  ('CLTH-005', 'Leather Belt', 'Genuine leather belt with classic buckle design.', 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop', 3499, 'USD', true),

  -- Home & Garden
  ('HOME-001', 'Stainless Steel Cookware Set', '10-piece professional cookware set with non-stick coating.', 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop', 19999, 'USD', true),
  ('HOME-002', 'Memory Foam Pillow', 'Ergonomic memory foam pillow for optimal neck support.', 'https://images.unsplash.com/photo-1592789705501-f9ae4278a9c9?w=400&h=400&fit=crop', 4999, 'USD', true),
  ('HOME-003', 'LED Desk Lamp', 'Adjustable LED desk lamp with touch controls and USB charging port.', 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400&h=400&fit=crop', 3999, 'USD', true),
  ('HOME-004', 'Indoor Plant Pot Set', 'Set of 3 ceramic plant pots with drainage holes and bamboo trays.', 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=400&h=400&fit=crop', 2999, 'USD', true),
  ('HOME-005', 'Robot Vacuum Cleaner', 'Smart robot vacuum with mapping technology and app control.', 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop', 34999, 'USD', true),

  -- Sports & Outdoors
  ('SPRT-001', 'Yoga Mat Premium', 'Extra thick non-slip yoga mat with carrying strap.', 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=400&h=400&fit=crop', 3999, 'USD', true),
  ('SPRT-002', 'Adjustable Dumbbell Set', 'Space-saving adjustable dumbbells from 5 to 50 lbs.', 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&h=400&fit=crop', 29999, 'USD', true),
  ('SPRT-003', 'Camping Tent 4-Person', 'Waterproof dome tent with easy setup and ventilation windows.', 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=400&h=400&fit=crop', 14999, 'USD', true),
  ('SPRT-004', 'Insulated Water Bottle', 'Double-wall vacuum insulated bottle keeps drinks cold 24h or hot 12h.', 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400&h=400&fit=crop', 2999, 'USD', true),
  ('SPRT-005', 'Resistance Bands Set', 'Set of 5 resistance bands with different strength levels.', 'https://images.unsplash.com/photo-1598289431512-b97b0917affc?w=400&h=400&fit=crop', 1999, 'USD', true),

  -- Books
  ('BOOK-001', 'The Art of Programming', 'Comprehensive guide to modern software development practices.', 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=400&h=400&fit=crop', 4999, 'USD', true),
  ('BOOK-002', 'Mindful Living', 'A practical guide to mindfulness and meditation techniques.', 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=400&fit=crop', 1999, 'USD', true),
  ('BOOK-003', 'World History Encyclopedia', 'Illustrated encyclopedia covering major historical events and civilizations.', 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=400&fit=crop', 5999, 'USD', true),
  ('BOOK-004', 'Gourmet Cooking Basics', 'Step-by-step recipes from professional chefs for home cooks.', 'https://images.unsplash.com/photo-1589998059171-988d887df646?w=400&h=400&fit=crop', 3499, 'USD', true),
  ('BOOK-005', 'Science Fiction Anthology', 'Collection of award-winning science fiction short stories.', 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400&h=400&fit=crop', 2499, 'USD', true),

  -- Toys & Games
  ('TOYS-001', 'Building Blocks Set 500pc', 'Creative building blocks compatible with major brands, 500 pieces.', 'https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=400&h=400&fit=crop', 3999, 'USD', true),
  ('TOYS-002', 'Strategy Board Game', 'Award-winning strategy game for 2-4 players, ages 10+.', 'https://images.unsplash.com/photo-1611891487122-207579d67d98?w=400&h=400&fit=crop', 4499, 'USD', true),
  ('TOYS-003', 'Remote Control Car', 'High-speed RC car with rechargeable battery and 100m range.', 'https://images.unsplash.com/photo-1594787318286-3d835c1d207f?w=400&h=400&fit=crop', 5999, 'USD', true),
  ('TOYS-004', 'Puzzle 1000 Pieces', 'Beautiful landscape puzzle for adults, 1000 pieces.', 'https://images.unsplash.com/photo-1494059980473-813e73ee784b?w=400&h=400&fit=crop', 1999, 'USD', true),
  ('TOYS-005', 'Plush Teddy Bear', 'Soft and cuddly teddy bear, 40cm tall, machine washable.', 'https://images.unsplash.com/photo-1558679908-541bcf1249ff?w=400&h=400&fit=crop', 2499, 'USD', true),

  -- Beauty & Personal Care
  ('BEAU-001', 'Organic Face Moisturizer', 'Natural moisturizer with vitamin E and aloe vera for all skin types.', 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&h=400&fit=crop', 2999, 'USD', true),
  ('BEAU-002', 'Electric Toothbrush', 'Sonic toothbrush with 5 cleaning modes and 2-minute timer.', 'https://images.unsplash.com/photo-1559589688-6ba6beafe1e9?w=400&h=400&fit=crop', 7999, 'USD', true),
  ('BEAU-003', 'Hair Dryer Professional', 'Ionic hair dryer with multiple heat settings and cool shot button.', 'https://images.unsplash.com/photo-1522338140262-f46f5913618a?w=400&h=400&fit=crop', 8999, 'USD', true),
  ('BEAU-004', 'Perfume Eau de Toilette', 'Fresh and elegant fragrance with citrus and floral notes, 100ml.', 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=400&h=400&fit=crop', 6999, 'USD', true),
  ('BEAU-005', 'Manicure Set', 'Professional 12-piece manicure set in leather case.', 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=400&h=400&fit=crop', 2499, 'USD', true),

  -- Food & Beverages
  ('FOOD-001', 'Organic Coffee Beans', 'Premium single-origin Arabica coffee beans, 1kg bag.', 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400&h=400&fit=crop', 2499, 'USD', true),
  ('FOOD-002', 'Green Tea Collection', 'Assortment of 50 green tea bags from various regions.', 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400&h=400&fit=crop', 1999, 'USD', true),
  ('FOOD-003', 'Dark Chocolate Gift Box', 'Artisan dark chocolate collection, 70% cocoa, 24 pieces.', 'https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=400&h=400&fit=crop', 3499, 'USD', true),
  ('FOOD-004', 'Extra Virgin Olive Oil', 'Cold-pressed extra virgin olive oil from Mediterranean olives, 750ml.', 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400&h=400&fit=crop', 1899, 'USD', true),
  ('FOOD-005', 'Mixed Nuts Premium', 'Roasted and salted premium mixed nuts, 500g jar.', 'https://images.unsplash.com/photo-1536816579748-4ecb3f03d72a?w=400&h=400&fit=crop', 1499, 'USD', true);

-- Product Categories (many-to-many relationships)
INSERT INTO product_categories (product_id, category_id)
SELECT p.id, c.id FROM products p, categories c WHERE p.sku = 'ELEC-001' AND c.slug = 'electronics'
UNION ALL
SELECT p.id, c.id FROM products p, categories c WHERE p.sku = 'ELEC-002' AND c.slug = 'electronics'
UNION ALL
SELECT p.id, c.id FROM products p, categories c WHERE p.sku = 'ELEC-002' AND c.slug = 'sports-outdoors'
UNION ALL
SELECT p.id, c.id FROM products p, categories c WHERE p.sku = 'ELEC-003' AND c.slug = 'electronics'
UNION ALL
SELECT p.id, c.id FROM products p, categories c WHERE p.sku = 'ELEC-004' AND c.slug = 'electronics'
UNION ALL
SELECT p.id, c.id FROM products p, categories c WHERE p.sku = 'ELEC-005' AND c.slug = 'electronics'
UNION ALL
SELECT p.id, c.id FROM products p, categories c WHERE p.sku = 'CLTH-001' AND c.slug = 'clothing'
UNION ALL
SELECT p.id, c.id FROM products p, categories c WHERE p.sku = 'CLTH-002' AND c.slug = 'clothing'
UNION ALL
SELECT p.id, c.id FROM products p, categories c WHERE p.sku = 'CLTH-003' AND c.slug = 'clothing'
UNION ALL
SELECT p.id, c.id FROM products p, categories c WHERE p.sku = 'CLTH-004' AND c.slug = 'clothing'
UNION ALL
SELECT p.id, c.id FROM products p, categories c WHERE p.sku = 'CLTH-004' AND c.slug = 'sports-outdoors'
UNION ALL
SELECT p.id, c.id FROM products p, categories c WHERE p.sku = 'CLTH-005' AND c.slug = 'clothing'
UNION ALL
SELECT p.id, c.id FROM products p, categories c WHERE p.sku = 'HOME-001' AND c.slug = 'home-garden'
UNION ALL
SELECT p.id, c.id FROM products p, categories c WHERE p.sku = 'HOME-002' AND c.slug = 'home-garden'
UNION ALL
SELECT p.id, c.id FROM products p, categories c WHERE p.sku = 'HOME-003' AND c.slug = 'home-garden'
UNION ALL
SELECT p.id, c.id FROM products p, categories c WHERE p.sku = 'HOME-003' AND c.slug = 'electronics'
UNION ALL
SELECT p.id, c.id FROM products p, categories c WHERE p.sku = 'HOME-004' AND c.slug = 'home-garden'
UNION ALL
SELECT p.id, c.id FROM products p, categories c WHERE p.sku = 'HOME-005' AND c.slug = 'home-garden'
UNION ALL
SELECT p.id, c.id FROM products p, categories c WHERE p.sku = 'HOME-005' AND c.slug = 'electronics'
UNION ALL
SELECT p.id, c.id FROM products p, categories c WHERE p.sku = 'SPRT-001' AND c.slug = 'sports-outdoors'
UNION ALL
SELECT p.id, c.id FROM products p, categories c WHERE p.sku = 'SPRT-002' AND c.slug = 'sports-outdoors'
UNION ALL
SELECT p.id, c.id FROM products p, categories c WHERE p.sku = 'SPRT-003' AND c.slug = 'sports-outdoors'
UNION ALL
SELECT p.id, c.id FROM products p, categories c WHERE p.sku = 'SPRT-004' AND c.slug = 'sports-outdoors'
UNION ALL
SELECT p.id, c.id FROM products p, categories c WHERE p.sku = 'SPRT-005' AND c.slug = 'sports-outdoors'
UNION ALL
SELECT p.id, c.id FROM products p, categories c WHERE p.sku = 'BOOK-001' AND c.slug = 'books'
UNION ALL
SELECT p.id, c.id FROM products p, categories c WHERE p.sku = 'BOOK-002' AND c.slug = 'books'
UNION ALL
SELECT p.id, c.id FROM products p, categories c WHERE p.sku = 'BOOK-003' AND c.slug = 'books'
UNION ALL
SELECT p.id, c.id FROM products p, categories c WHERE p.sku = 'BOOK-004' AND c.slug = 'books'
UNION ALL
SELECT p.id, c.id FROM products p, categories c WHERE p.sku = 'BOOK-004' AND c.slug = 'food-beverages'
UNION ALL
SELECT p.id, c.id FROM products p, categories c WHERE p.sku = 'BOOK-005' AND c.slug = 'books'
UNION ALL
SELECT p.id, c.id FROM products p, categories c WHERE p.sku = 'TOYS-001' AND c.slug = 'toys-games'
UNION ALL
SELECT p.id, c.id FROM products p, categories c WHERE p.sku = 'TOYS-002' AND c.slug = 'toys-games'
UNION ALL
SELECT p.id, c.id FROM products p, categories c WHERE p.sku = 'TOYS-003' AND c.slug = 'toys-games'
UNION ALL
SELECT p.id, c.id FROM products p, categories c WHERE p.sku = 'TOYS-003' AND c.slug = 'electronics'
UNION ALL
SELECT p.id, c.id FROM products p, categories c WHERE p.sku = 'TOYS-004' AND c.slug = 'toys-games'
UNION ALL
SELECT p.id, c.id FROM products p, categories c WHERE p.sku = 'TOYS-005' AND c.slug = 'toys-games'
UNION ALL
SELECT p.id, c.id FROM products p, categories c WHERE p.sku = 'BEAU-001' AND c.slug = 'beauty-personal-care'
UNION ALL
SELECT p.id, c.id FROM products p, categories c WHERE p.sku = 'BEAU-002' AND c.slug = 'beauty-personal-care'
UNION ALL
SELECT p.id, c.id FROM products p, categories c WHERE p.sku = 'BEAU-002' AND c.slug = 'electronics'
UNION ALL
SELECT p.id, c.id FROM products p, categories c WHERE p.sku = 'BEAU-003' AND c.slug = 'beauty-personal-care'
UNION ALL
SELECT p.id, c.id FROM products p, categories c WHERE p.sku = 'BEAU-003' AND c.slug = 'electronics'
UNION ALL
SELECT p.id, c.id FROM products p, categories c WHERE p.sku = 'BEAU-004' AND c.slug = 'beauty-personal-care'
UNION ALL
SELECT p.id, c.id FROM products p, categories c WHERE p.sku = 'BEAU-005' AND c.slug = 'beauty-personal-care'
UNION ALL
SELECT p.id, c.id FROM products p, categories c WHERE p.sku = 'FOOD-001' AND c.slug = 'food-beverages'
UNION ALL
SELECT p.id, c.id FROM products p, categories c WHERE p.sku = 'FOOD-002' AND c.slug = 'food-beverages'
UNION ALL
SELECT p.id, c.id FROM products p, categories c WHERE p.sku = 'FOOD-003' AND c.slug = 'food-beverages'
UNION ALL
SELECT p.id, c.id FROM products p, categories c WHERE p.sku = 'FOOD-004' AND c.slug = 'food-beverages'
UNION ALL
SELECT p.id, c.id FROM products p, categories c WHERE p.sku = 'FOOD-005' AND c.slug = 'food-beverages';
