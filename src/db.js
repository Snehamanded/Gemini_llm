import dotenv from 'dotenv';
import pg from 'pg';

dotenv.config();

const { Pool } = pg;

let pool = null;

export function getPool() {
  if (pool) return pool;
  const { PGHOST, PGPORT, PGDATABASE, PGUSER, PGPASSWORD, DATABASE_URL } = process.env;
  if (DATABASE_URL || PGHOST) {
    pool = new Pool(
      DATABASE_URL
        ? { connectionString: DATABASE_URL, ssl: process.env.PGSSLMODE === 'require' ? { rejectUnauthorized: false } : undefined }
        : { host: PGHOST, port: Number(PGPORT || 5432), database: PGDATABASE, user: PGUSER, password: PGPASSWORD }
    );
  }
  return pool;
}

export async function ensureSchema() {
  const p = getPool();
  if (!p) return;
  await p.query(`
    -- Ensure base table exists (old or new schema)
    create table if not exists cars (
      id serial primary key
    );

    -- Backward-compatible migrations: rename old columns to new names if present
    do $$ begin
      if exists(select 1 from information_schema.columns where table_name='cars' and column_name='make') then
        alter table cars rename column make to brand;
      end if;
      if exists(select 1 from information_schema.columns where table_name='cars' and column_name='trim') then
        alter table cars rename column trim to variant;
      end if;
      if exists(select 1 from information_schema.columns where table_name='cars' and column_name='fuel') then
        alter table cars rename column fuel to fuel_type;
      end if;
    end $$;

    -- Add new columns if missing
    alter table cars add column if not exists registration_number varchar(20) unique;
    alter table cars add column if not exists brand varchar(50);
    alter table cars add column if not exists model varchar(50);
    alter table cars add column if not exists variant varchar(100);
    alter table cars add column if not exists type varchar(50);
    alter table cars add column if not exists year int;
    alter table cars add column if not exists fuel_type varchar(20);
    alter table cars add column if not exists transmission varchar(20);
    alter table cars add column if not exists mileage int;
    alter table cars add column if not exists price numeric(12,2);
    alter table cars add column if not exists color varchar(30);
    alter table cars add column if not exists engine_cc int;
    alter table cars add column if not exists power_bhp int;
    alter table cars add column if not exists seats int;
    alter table cars add column if not exists description text;
    alter table cars add column if not exists status varchar(20) default 'available';
    alter table cars add column if not exists created_at timestamptz default now();
    alter table cars add column if not exists updated_at timestamptz default now();

    -- Convert price to numeric if it was integer
    do $$ begin
      perform 1 from information_schema.columns where table_name='cars' and column_name='price' and data_type<>'numeric';
      if found then
        alter table cars alter column price type numeric(12,2) using price::numeric;
      end if;
    end $$;

    -- Drop legacy ext_id if exists
    alter table cars drop column if exists ext_id;

    -- Indexes
    create index if not exists cars_brand_idx on cars(brand);
    create index if not exists cars_model_idx on cars(model);
    create index if not exists cars_price_idx on cars(price);
    create index if not exists cars_type_idx on cars(type);

    -- Conversation history (unchanged)
    create table if not exists conversation_history (
      id bigserial primary key,
      user_id text not null,
      role text not null check (role in ('user','assistant')),
      content text not null,
      created_at timestamptz default now()
    );
    create index if not exists conversation_history_user_idx on conversation_history(user_id, created_at desc);
  `);
}


