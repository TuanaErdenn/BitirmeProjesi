create type order_status as enum ('new','awaiting_stock','awaiting_payment','paid','cancelled','fulfilled');

-- orders: ödeme ve teslimat detaylarını şimdilik minimumda tutuyoruz
create table orders (
  id                bigserial primary key,
  user_id           text not null,                 -- keycloak subject/id (fk yok)
  status            order_status not null default 'new',
  total_cents       integer not null check (total_cents >= 0),
  currency          char(3) not null default 'usd',
  payment_status    text not null default 'pending',   -- çok basit alan
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

-- order_items: satır bazında fiyatı sabitle (gelecekteki fiyat değişiminden etkilenmesin)
create table order_items (
  id              bigserial primary key,
  order_id        bigint not null references orders(id) on delete cascade,
  product_sku     text not null,                 -- ürün referansı sku ile
  quantity        integer not null check (quantity > 0),
  unit_price_cents integer not null check (unit_price_cents >= 0), -- sipariş anındaki birim fiyat
  subtotal_cents  integer generated always as (quantity * unit_price_cents) stored
);

create index idx_orders_user on orders(user_id);
create index idx_order_items_order on order_items(order_id);
