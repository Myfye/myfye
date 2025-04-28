CREATE TABLE IF NOT EXISTS users (
    uid SERIAL PRIMARY KEY,
    kyc_verified BOOLEAN DEFAULT FALSE,
    creation_date TIMESTAMP WITH TIME ZONE DEFAULT (CURRENT_TIMESTAMP AT TIME ZONE 'UTC'),
    last_login_date TIMESTAMP WITH TIME ZONE,
    email VARCHAR(255) NOT NULL,
    phone_number VARCHAR(20),
    first_name TEXT,
    last_name TEXT,
    country TEXT,
    evm_pub_key TEXT,
    solana_pub_key TEXT,
    privy_user_id TEXT UNIQUE,
    persona_account_id TEXT,
    blind_pay_receiver_id TEXT,
    blind_pay_evm_wallet_id TEXT
); 


CREATE TABLE IF NOT EXISTS recently_used_solana_addresses (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(uid),
  addresses TEXT[] NOT NULL
);

CREATE TABLE IF NOT EXISTS recently_used_evm_addresses (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(uid),
  addresses TEXT[] NOT NULL
);

CREATE TABLE IF NOT EXISTS swap_transactions (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(uid),
  input_amount NUMERIC NOT NULL,
  output_amount NUMERIC,
  input_chain TEXT,
  output_chain TEXT,
  creation_date TIMESTAMP WITH TIME ZONE DEFAULT (CURRENT_TIMESTAMP AT TIME ZONE 'UTC'),
  public_key TEXT NOT NULL,
  input_currency TEXT,
  output_currency TEXT,
  transaction_type TEXT,
  transaction_hash TEXT NOT NULL,
  transaction_status TEXT
);

CREATE TABLE IF NOT EXISTS pay_transactions (
  id SERIAL PRIMARY KEY,
  sender_id INTEGER NOT NULL REFERENCES users(uid),
  sender_public_key TEXT,
  receiver_id INTEGER REFERENCES users(uid),
  receiver_phone_number TEXT,
  receiver_email TEXT,
  receiver_public_key TEXT,
  amount NUMERIC NOT NULL,
  currency TEXT NOT NULL,
  chain TEXT NOT NULL,
  creation_date TIMESTAMP WITH TIME ZONE DEFAULT (CURRENT_TIMESTAMP AT TIME ZONE 'UTC'),
  transaction_hash TEXT NOT NULL,
  transaction_status TEXT
);

CREATE TABLE IF NOT EXISTS error_logs (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(uid),
  creation_date TIMESTAMP WITH TIME ZONE DEFAULT (CURRENT_TIMESTAMP AT TIME ZONE 'UTC'),
  error_message TEXT NOT NULL,
  error_type TEXT NOT NULL,
  error_stack_trace TEXT
);

CREATE TABLE IF NOT EXISTS user_sessions (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(uid),
  ip_address TEXT,
  device TEXT,
  device_id TEXT,
  user_agent TEXT,
  login_time TIMESTAMP WITH TIME ZONE DEFAULT (CURRENT_TIMESTAMP AT TIME ZONE 'UTC'),
  logout_time TIMESTAMP WITH TIME ZONE
);

CREATE TABLE IF NOT EXISTS user_contacts (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(uid),
  contact_id INTEGER NOT NULL REFERENCES users(uid),
  UNIQUE(user_id, contact_id)
);

CREATE EXTENSION IF NOT EXISTS pg_trgm;
CREATE INDEX ON users USING gin (first_name gin_trgm_ops);
CREATE INDEX ON users USING gin (last_name gin_trgm_ops);
CREATE INDEX ON users USING gin (email gin_trgm_ops);