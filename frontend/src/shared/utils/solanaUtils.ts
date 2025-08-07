import { PublicKey } from "@solana/web3.js";

// Solana address validation regex
export const validateSolanaAddress = (address: string) => {
  if (!address) return false;
  const key = new PublicKey(address);
  return PublicKey.isOnCurve(key.toBytes());
};

export const truncateSolanaAddress = (address: string) => {
  if (!address) throw new Error("Please input a Solana address");
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};
