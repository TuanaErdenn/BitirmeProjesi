-- ===========================================
-- SEED DATA - E-Commerce Order System
-- ===========================================

-- Orders with various statuses
INSERT INTO orders (id, user_id, status, total_cents, currency, payment_status, created_at, updated_at) VALUES
  -- Fulfilled orders (completed)
  (1, 'user-001-keycloak-id', 'fulfilled', 15498, 'USD', 'completed', '2026-01-05 10:30:00+00', '2026-01-08 14:20:00+00'),
  (2, 'user-002-keycloak-id', 'fulfilled', 34998, 'USD', 'completed', '2026-01-10 15:45:00+00', '2026-01-13 09:15:00+00'),
  (3, 'user-001-keycloak-id', 'fulfilled', 8998, 'USD', 'completed', '2026-01-12 08:00:00+00', '2026-01-15 16:30:00+00'),
  (4, 'user-003-keycloak-id', 'fulfilled', 47997, 'USD', 'completed', '2026-01-15 11:20:00+00', '2026-01-18 10:45:00+00'),
  
  -- Paid orders (awaiting shipment)
  (5, 'user-004-keycloak-id', 'paid', 22998, 'USD', 'completed', '2026-01-28 09:00:00+00', '2026-01-28 09:05:00+00'),
  (6, 'user-002-keycloak-id', 'paid', 11997, 'USD', 'completed', '2026-01-29 14:30:00+00', '2026-01-29 14:35:00+00'),
  (7, 'user-005-keycloak-id', 'paid', 39998, 'USD', 'completed', '2026-01-30 16:45:00+00', '2026-01-30 16:50:00+00'),
  
  -- Awaiting payment
  (8, 'user-006-keycloak-id', 'awaiting_payment', 18999, 'USD', 'pending', '2026-02-01 10:00:00+00', '2026-02-01 10:00:00+00'),
  (9, 'user-003-keycloak-id', 'awaiting_payment', 7498, 'USD', 'pending', '2026-02-01 11:30:00+00', '2026-02-01 11:30:00+00'),
  
  -- Awaiting stock
  (10, 'user-007-keycloak-id', 'awaiting_stock', 29999, 'USD', 'pending', '2026-02-01 13:00:00+00', '2026-02-01 13:00:00+00'),
  
  -- New orders
  (11, 'user-001-keycloak-id', 'new', 12497, 'USD', 'pending', '2026-02-02 08:15:00+00', '2026-02-02 08:15:00+00'),
  (12, 'user-008-keycloak-id', 'new', 5998, 'USD', 'pending', '2026-02-02 09:30:00+00', '2026-02-02 09:30:00+00'),
  (13, 'user-004-keycloak-id', 'new', 24997, 'USD', 'pending', '2026-02-02 10:45:00+00', '2026-02-02 10:45:00+00'),
  
  -- Cancelled orders
  (14, 'user-009-keycloak-id', 'cancelled', 14999, 'USD', 'refunded', '2026-01-20 12:00:00+00', '2026-01-21 09:00:00+00'),
  (15, 'user-005-keycloak-id', 'cancelled', 8999, 'USD', 'cancelled', '2026-01-25 14:00:00+00', '2026-01-25 15:30:00+00');

-- Order Items (referencing product SKUs from product-api)
INSERT INTO order_items (order_id, product_sku, quantity, unit_price_cents) VALUES
  -- Order 1: Headphones + T-Shirt
  (1, 'ELEC-001', 1, 12999),
  (1, 'CLTH-001', 1, 2499),
  
  -- Order 2: Smart Watch + Power Bank
  (2, 'ELEC-002', 1, 29999),
  (2, 'ELEC-003', 1, 4999),
  
  -- Order 3: Running Sneakers
  (3, 'CLTH-004', 1, 8999),
  
  -- Order 4: Robot Vacuum + Yoga Mat + Water Bottle
  (4, 'HOME-005', 1, 34999),
  (4, 'SPRT-001', 1, 3999),
  (4, 'SPRT-004', 3, 2999),
  
  -- Order 5: Cookware Set + Desk Lamp
  (5, 'HOME-001', 1, 19999),
  (5, 'HOME-003', 1, 2999),
  
  -- Order 6: Coffee Beans x2 + Tea + Chocolate
  (6, 'FOOD-001', 2, 2499),
  (6, 'FOOD-002', 1, 1999),
  (6, 'FOOD-003', 1, 3499),
  
  -- Order 7: Dumbbell Set + Resistance Bands
  (7, 'SPRT-002', 1, 29999),
  (7, 'SPRT-005', 5, 1999),
  
  -- Order 8: Winter Coat
  (8, 'CLTH-003', 1, 18999),
  
  -- Order 9: Books x3
  (9, 'BOOK-001', 1, 4999),
  (9, 'BOOK-002', 1, 1999),
  (9, 'BOOK-005', 1, 2499),
  
  -- Order 10: Smart Watch Pro
  (10, 'ELEC-002', 1, 29999),
  
  -- Order 11: Keyboard + Wireless Charger + Belt
  (11, 'ELEC-004', 1, 14999),
  (11, 'ELEC-005', 1, 2999),
  (11, 'CLTH-005', 1, 3499),
  
  -- Order 12: Slim Fit Jeans x2
  (12, 'CLTH-002', 2, 5999),
  
  -- Order 13: Tent + Water Bottle x2 + Cooking Book
  (13, 'SPRT-003', 1, 14999),
  (13, 'SPRT-004', 2, 2999),
  (13, 'BOOK-004', 1, 3499),
  
  -- Order 14: Gaming Keyboard (cancelled)
  (14, 'ELEC-004', 1, 14999),
  
  -- Order 15: Hair Dryer (cancelled)
  (15, 'BEAU-003', 1, 8999);

-- Reset sequence to continue from last ID
SELECT setval('orders_id_seq', (SELECT MAX(id) FROM orders));
SELECT setval('order_items_id_seq', (SELECT MAX(id) FROM order_items));
