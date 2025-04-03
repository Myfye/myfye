CREATE TABLE IF NOT EXISTS users (
    uid SERIAL PRIMARY KEY,
    kyc_verified BOOLEAN DEFAULT FALSE,
    creation_date TIMESTAMP WITH TIME ZONE DEFAULT (CURRENT_TIMESTAMP AT TIME ZONE 'UTC'),
    last_login_date TIMESTAMP WITH TIME ZONE,
    email VARCHAR(255) NOT NULL,
    phone_number VARCHAR(20),
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    country VARCHAR(100),
    evm_pub_key VARCHAR(255),
    solana_pub_key VARCHAR(255),
    privy_user_id VARCHAR(255) UNIQUE,
    persona_account_id VARCHAR(255),
    blind_pay_receiver_id VARCHAR(255),
    blind_pay_evm_wallet_id VARCHAR(255)
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

CREATE TABLE IF NOT EXISTS swap_transaction (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(uid),
  input_amount NUMERIC NOT NULL,
  output_amount NUMERIC,
  creation_date TIMESTAMP WITH TIME ZONE DEFAULT (CURRENT_TIMESTAMP AT TIME ZONE 'UTC'),
  public_key TEXT,
  input_currency TEXT,
  output_currency TEXT,
  transaction_type TEXT,
  transaction_hash TEXT
);

CREATE TABLE IF NOT EXISTS pay_transaction (
  id SERIAL PRIMARY KEY,
  sender_id INTEGER NOT NULL REFERENCES users(uid),
  receiver_id INTEGER REFERENCES users(uid),
  receiver_phone_number VARCHAR(20),
  receiver_email VARCHAR(255),
  amount NUMERIC NOT NULL,
  currency TEXT NOT NULL,
  creation_date TIMESTAMP WITH TIME ZONE DEFAULT (CURRENT_TIMESTAMP AT TIME ZONE 'UTC'),
  transaction_hash TEXT
);

CREATE TABLE IF NOT EXISTS error_log (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(uid),
  creation_date TIMESTAMP WITH TIME ZONE DEFAULT (CURRENT_TIMESTAMP AT TIME ZONE 'UTC'),
  error_message TEXT NOT NULL,
  error_type TEXT NOT NULL,
  error_stack_trace TEXT
);

CREATE TABLE IF NOT EXISTS user_session (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(uid),
  ip_address TEXT,
  device TEXT,
  device_id TEXT,
  user_agent TEXT,
  login_time TIMESTAMP WITH TIME ZONE DEFAULT (CURRENT_TIMESTAMP AT TIME ZONE 'UTC'),
  logout_time TIMESTAMP WITH TIME ZONE
);