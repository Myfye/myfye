import { PayTransaction } from "./types";
import { ConnectedSolanaWallet } from "@privy-io/react-auth/solana";

const MYFYE_BACKEND = process.env.NEXT_PUBLIC_MYFYE_BACKEND;
const MYFYE_BACKEND_KEY = process.env.NEXT_PUBLIC_MYFYE_BACKEND_KEY;

export async function savePayTransaction(
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
    "Pay Transaction: ",
    "user_id:", user_id,
    "amount:", transaction.amount,
    "chain:", "solana",
    "sender_public_key:", wallet.publicKey.toString(),
    "receiver_public_key:", transaction.user.solana_pub_key,
    "currency:", transaction.abstractedAssetId,
    "transaction_hash:", transactionId,
    "transaction_status:", "success"
  );

  // Call the pay transaction endpoint
  const response = await fetch(`${MYFYE_BACKEND}/create_pay_transaction`, {
    method: 'POST',
    mode: 'cors',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': MYFYE_BACKEND_KEY,
    },
    body: JSON.stringify({
      user_id: user_id,
      amount: transaction.amount,
      chain: "solana",
      sender_public_key: wallet.publicKey.toString(),
      receiver_id: null,
      receiver_phone_number: null,
      receiver_email: null,
      receiver_public_key: transaction.user.solana_pub_key,
      currency: transaction.abstractedAssetId,
      transaction_hash: transactionId,
      transaction_status: "success"
    })
  });

  if (!response.ok) {
    console.error("Failed to save pay transaction:", await response.text());
    throw new Error("Failed to save pay transaction");
  }

  return response.json();
}