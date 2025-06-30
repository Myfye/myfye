-- Function to generate unique IDs
CREATE OR REPLACE FUNCTION generate_unique_id() RETURNS TEXT AS $$
DECLARE
    chars TEXT := 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    result TEXT := '';
    i INTEGER := 0;
BEGIN
    FOR i IN 1..20 LOOP
        result := result || substr(chars, floor(random() * length(chars) + 1)::integer, 1);
    END LOOP;
    RETURN result;
END;
$$ LANGUAGE plpgsql;

CREATE TABLE IF NOT EXISTS users (
    uid TEXT PRIMARY KEY DEFAULT generate_unique_id(),
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
  id TEXT PRIMARY KEY DEFAULT generate_unique_id(),
  user_id TEXT NOT NULL REFERENCES users(uid),
  addresses TEXT[] NOT NULL
);

CREATE TABLE IF NOT EXISTS recently_used_evm_addresses (
  id TEXT PRIMARY KEY DEFAULT generate_unique_id(),
  user_id TEXT NOT NULL REFERENCES users(uid),
  addresses TEXT[] NOT NULL
);

CREATE TABLE IF NOT EXISTS swap_transactions (
  id TEXT PRIMARY KEY DEFAULT generate_unique_id(),
  user_id TEXT NOT NULL REFERENCES users(uid),
  input_amount NUMERIC NOT NULL,
  output_amount NUMERIC,
  input_chain TEXT,
  output_chain TEXT,
  creation_date TIMESTAMP WITH TIME ZONE DEFAULT (CURRENT_TIMESTAMP AT TIME ZONE 'UTC'),
  input_public_key TEXT NOT NULL,
  output_public_key TEXT NOT NULL,
  input_currency TEXT,
  output_currency TEXT,
  transaction_type TEXT,
  transaction_hash TEXT NOT NULL,
  transaction_status TEXT
);

CREATE TABLE IF NOT EXISTS pay_transactions (
  id TEXT PRIMARY KEY DEFAULT generate_unique_id(),
  sender_id TEXT NOT NULL REFERENCES users(uid),
  sender_public_key TEXT,
  receiver_id TEXT REFERENCES users(uid),
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
  id TEXT PRIMARY KEY DEFAULT generate_unique_id(),
  user_id TEXT REFERENCES users(uid),
  creation_date TIMESTAMP WITH TIME ZONE DEFAULT (CURRENT_TIMESTAMP AT TIME ZONE 'UTC'),
  error_message TEXT NOT NULL,
  error_type TEXT NOT NULL,
  error_stack_trace TEXT
);

CREATE TABLE IF NOT EXISTS user_sessions (
  id TEXT PRIMARY KEY DEFAULT generate_unique_id(),
  user_id TEXT NOT NULL REFERENCES users(uid),
  ip_address TEXT,
  device TEXT,
  device_id TEXT,
  user_agent TEXT,
  login_time TIMESTAMP WITH TIME ZONE DEFAULT (CURRENT_TIMESTAMP AT TIME ZONE 'UTC'),
  logout_time TIMESTAMP WITH TIME ZONE
);

CREATE TABLE IF NOT EXISTS user_contacts (
  id TEXT PRIMARY KEY DEFAULT generate_unique_id(),
  user_id TEXT NOT NULL REFERENCES users(uid),
  contact_id TEXT NOT NULL REFERENCES users(uid),
  UNIQUE(user_id, contact_id)
);

CREATE TABLE IF NOT EXISTS user_kyc (
  id TEXT PRIMARY KEY DEFAULT generate_unique_id(),
  user_id TEXT NOT NULL REFERENCES users(uid),
  address_line_1 TEXT,
  city TEXT,
  state_province_region TEXT,
  postal_code TEXT,
  country TEXT,
  date_of_birth TEXT,
  first_name TEXT,
  last_name TEXT,
  tax_id TEXT,
  id_doc_type TEXT,
  id_doc_front_file TEXT,
  id_doc_back_file TEXT,
  id_doc_country TEXT
);

CREATE EXTENSION IF NOT EXISTS pg_trgm;
CREATE INDEX ON users USING gin (first_name gin_trgm_ops);
CREATE INDEX ON users USING gin (last_name gin_trgm_ops);
CREATE INDEX ON users USING gin (email gin_trgm_ops);