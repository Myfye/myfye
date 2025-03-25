CREATE TABLE IF NOT EXISTS users (
    uid SERIAL PRIMARY KEY,
    kyc_verified BOOLEAN DEFAULT FALSE,
    creation_date TIMESTAMP WITH TIME ZONE DEFAULT (CURRENT_TIMESTAMP AT TIME ZONE 'UTC'),
    last_login_date TIMESTAMP WITH TIME ZONE,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone_number VARCHAR(20),
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    country VARCHAR(100),
    evm_pub_key VARCHAR(255),
    solana_pub_key VARCHAR(255),
    privy_user_id VARCHAR(255),
    persona_account_id VARCHAR(255),
    blind_pay_receiver_id VARCHAR(255),
    blind_pay_evm_wallet_id VARCHAR(255)
); 