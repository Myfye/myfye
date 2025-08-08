import { PublicKey } from "@solana/web3.js";

// Solana address validation regex
export const validateSolanaAddress = (address: string) => {
  if (!address) return false;
  try {
    const key = new PublicKey(address);
    return PublicKey.isOnCurve(key.toBytes());
  } catch (err) {
    // return false if invalid
    return false;
  }
};

export const truncateSolanaAddress = (address: string) => {
  const isSolanaAddressValid = validateSolanaAddress(address);
  if (!isSolanaAddressValid)
    throw new Error("Please input a valid Solana address");
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};
