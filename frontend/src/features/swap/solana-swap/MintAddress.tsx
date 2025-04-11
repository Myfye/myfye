// Swapping pairs
const USDC_MINT_ADDRESS = "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v";
const USDT_MINT_ADDRESS = "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB";
const USDY_MINT_ADDRESS = "A1KLoBrKBde8Ty9qtNQUtq3C2ortoC3u7twggz7sEto6";
const PYUSD_MINT_ADDRESS = "2b1kV6DkPAnxd5ixfnxCpjxmKwqjjaYmCZfHsFu24GXo";
const EURC_MINT_ADDRESS = "HzwqbKZw8HxMN6bF2yFZNrht3c2iXXzpKcFu7uBEDKtr";
const BTC_MINT_ADDRESS = "cbbtcf3aa214zXHbiAZQwf4122FBYbraNdFqgw4iMij";
const WSOL_MINT_ADDRESS = "So11111111111111111111111111111111111111112";

function mintAddress(currencyCode: String): String {
  let mintAddress = USDC_MINT_ADDRESS;
  if (currencyCode === "usdc_sol") {
    mintAddress = USDC_MINT_ADDRESS;
  } else if (currencyCode === "usdt_sol") {
    mintAddress = USDT_MINT_ADDRESS;
  } else if (currencyCode === "usdy_sol") {
    mintAddress = USDY_MINT_ADDRESS;
  } else if (currencyCode === "pyusd_sol") {
    mintAddress = PYUSD_MINT_ADDRESS;
  } else if (currencyCode === "eurc_sol") {
    mintAddress = EURC_MINT_ADDRESS;
  } else if (currencyCode === "btc_sol") {
    mintAddress = BTC_MINT_ADDRESS;
  } else if (currencyCode === "sol" || currencyCode === "w_sol") {
    mintAddress = WSOL_MINT_ADDRESS;
  }
  return mintAddress;
}

export default mintAddress;
