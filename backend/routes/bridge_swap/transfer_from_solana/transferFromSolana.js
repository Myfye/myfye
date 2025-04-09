require("dotenv").config();
const { Connection, PublicKey, Keypair } = require("@solana/web3.js");
//const { createWormholeProgram } = require("@wormhole-foundation/sdk");

const SOL_PRIV_KEY = process.env.SOL_PRIV_KEY;
const SOL_PUB_KEY = process.env.SOL_PUB_KEY;
const EVM_PRIV_KEY = process.env.EVM_PRIV_KEY;
const EVM_PUB_KEY = process.env.EVM_PUB_KEY;

const HELIUS_API_KEY = process.env.HELIUS_API_KEY;

const USDC_MINT_ADDRESS = "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"; // Solana USDC
const USDC_BASE_ADDRESS = "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913"; // Base USDC
const USDT_MINT_ADDRESS = "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB";
const USDY_MINT_ADDRESS = "A1KLoBrKBde8Ty9qtNQUtq3C2ortoC3u7twggz7sEto6";
const PYUSD_MINT_ADDRESS = "2b1kV6DkPAnxd5ixfnxCpjxmKwqjjaYmCZfHsFu24GXo";
const EURC_MINT_ADDRESS = "HzwqbKZw8HxMN6bF2yFZNrht3c2iXXzpKcFu7uBEDKtr";
const BTC_MINT_ADDRESS = "cbbtcf3aa214zXHbiAZQwf4122FBYbraNdFqgw4iMij";

const RPC = `https://mainnet.helius-rpc.com/?api-key=${HELIUS_API_KEY}`;

async function transfer_from_solana(data) {

}

module.exports = {
  transfer_from_solana,
};
