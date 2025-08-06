import { PublicKey } from "@solana/web3.js";

// Solana address validation regex
export const validateSolanaAddress = (address: string) => {
  if (!address) return false;
  const key = new PublicKey(address);
  return PublicKey.isOnCurve(key.toBytes());
};
