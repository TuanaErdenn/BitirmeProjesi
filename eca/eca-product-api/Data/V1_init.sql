create extension if not exists pg_trgm;

-- products: temel ürün bilgisi
create table products (
  id               bigserial primary key,
  sku              text not null unique,        -- harici referans için ideal
  name             text not null,
  description      text,
  image_url        varchar(255),
  price_cents      integer not null check (price_cents >= 0),
  currency         char(3) not null default 'usd',
  is_active        boolean not null default true,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

-- categories: opsiyonel, yalın sınıflandırma
create table categories (
  id         bigserial primary key,
  name       text not null,
  slug       text not null unique
);

-- product_categories: n-n eşleştirme
create table product_categories (
  product_id  bigint not null references products(id) on delete cascade,
  category_id bigint not null references categories(id) on delete cascade,
  primary key (product_id, category_id)
);

-- önerilen indexler
create index idx_products_active on products(is_active);
create index idx_products_name_trgm on products using gin (name gin_trgm_ops); -- arama için (pg_trgm eklentisi)