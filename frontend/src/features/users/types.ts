export interface User {
  blind_pay_evm_wallet_id: null;
  blind_pay_receiver_id: null;
  country: string | null;
  creation_date: string;
  email: string | null;
  evm_pub_key: string;
  first_name: string | null;
  is_contact: 1 | 0;
  kyc_verified: string | false;
  last_login_date: string | null;
  last_name: string | null;
  persona_account_id: string | null;
  phone_number: string | null;
  privy_user_id: string;
  solana_pub_key: string;
  uid: number | null;
}
