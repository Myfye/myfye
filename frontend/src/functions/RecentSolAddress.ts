import { PayTransaction } from "./types";
import { ConnectedSolanaWallet } from "@privy-io/react-auth/solana";

const MYFYE_BACKEND = process.env.NEXT_PUBLIC_MYFYE_BACKEND;
const MYFYE_BACKEND_KEY = process.env.NEXT_PUBLIC_MYFYE_BACKEND_KEY;

export interface RecentSolAddress {
  id: string;
  user_id: string;
  addresses: string[];
}

export async function saveSolAddress(
  transaction: PayTransaction,
  transactionId: string,
  wallet: ConnectedSolanaWallet,
  user_id: string,
) {
  if (!transaction.user?.solana_pub_key) {
    console.error("Missing recipient public key");
    return;
  }

  console.log(
    "Saving Sol Address: ",
    "user ID:", user_id,
    "address:", transaction.user.solana_pub_key,
  );
  
  const addressResponse = await fetch(`${MYFYE_BACKEND}/save_recently_used_addresses`, {
    method: 'POST',
    mode: 'cors',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': MYFYE_BACKEND_KEY,
    },
    body: JSON.stringify({
      user_id: user_id,
      addresses: [transaction.user.solana_pub_key]
    })
  });

  if (!addressResponse.ok) {
    console.error("Failed to save recently used address:", await addressResponse.text());
    throw new Error("Failed to save recently used address");
  }

  return addressResponse.json();
}

export async function getRecentSolAddresses(user_id: string): Promise<RecentSolAddress> {
  console.log("Getting recent Sol addresses for user:", user_id);

  const response = await fetch(`${MYFYE_BACKEND}/get_recently_used_addresses`, {
    method: 'POST',
    mode: 'cors',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': MYFYE_BACKEND_KEY,
    },
    body: JSON.stringify({
      user_id: user_id
    })
  });

  if (!response.ok) {
    console.error("Failed to get recent addresses:", await response.text());
    throw new Error("Failed to get recent addresses");
  }

  return response.json();
}