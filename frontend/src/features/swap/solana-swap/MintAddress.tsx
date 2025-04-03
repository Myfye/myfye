// Swapping pairs
const USDC_MINT_ADDRESS = 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v';
const USDT_MINT_ADDRESS = 'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB'; 
const USDY_MINT_ADDRESS = 'A1KLoBrKBde8Ty9qtNQUtq3C2ortoC3u7twggz7sEto6';
const PYUSD_MINT_ADDRESS = '2b1kV6DkPAnxd5ixfnxCpjxmKwqjjaYmCZfHsFu24GXo';
const EURC_MINT_ADDRESS = 'HzwqbKZw8HxMN6bF2yFZNrht3c2iXXzpKcFu7uBEDKtr';
const BTC_MINT_ADDRESS = 'cbbtcf3aa214zXHbiAZQwf4122FBYbraNdFqgw4iMij';


function mintAddress(currencyCode: String): String {
    let mintAddress = USDC_MINT_ADDRESS;
    if (currencyCode === 'usdcSol') {
        mintAddress = USDC_MINT_ADDRESS;
    } else if (currencyCode === 'usdtSol') {
        mintAddress = USDT_MINT_ADDRESS;
    } else if (currencyCode === 'usdySol') {
      mintAddress = USDY_MINT_ADDRESS;
    } else if (currencyCode === 'pyusdSol') {
      mintAddress = PYUSD_MINT_ADDRESS;
    } else if (currencyCode === 'eurcSol') {
      mintAddress = EURC_MINT_ADDRESS;
    } else if (currencyCode === 'btcSol') {
      mintAddress = BTC_MINT_ADDRESS;
    }
    return mintAddress;
  }

export default mintAddress;