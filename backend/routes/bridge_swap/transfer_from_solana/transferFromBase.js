require("dotenv").config();

const SOL_PRIV_KEY = process.env.SOL_PRIV_KEY;
const SOL_PUB_KEY = process.env.SOL_PUB_KEY;

const EVM_PRIV_KEY = process.env.EVM_PRIV_KEY;
const EVM_PUB_KEY = process.env.EVM_PUB_KEY;

const USDC_TOKEN_CONTRACT = "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913";
const AAPL_TOKEN_CONTRACT = "0xce38e140fc3982a6bcebc37b040913ef2cd6c5a7"; // Apple
const MSFT_TOKEN_CONTRACT = "0xF9011e88d8f1B5BB9B1f0b3BD604D250cf114afB"; // Microsoft
const GOOGL_TOKEN_CONTRACT = "0x1a4DfA04a5c8F85eCad6FFd3C211051F8A43E280"; // Google
const NFLX_TOKEN_CONTRACT = "0x35c6fC86F413a48157E7D1785Bf209b07F4e5110"; // Netflix
const AMZN_TOKEN_CONTRACT = "0xf393d07e6ca9818A601055b4bb3c48A5bb98E701"; // Amazon
const SQ_TOKEN_CONTRACT = "0xD5EAB2d9E01442BfcA720F6f15451555dD003f40"; // Block
const DIS_TOKEN_CONTRACT = "0x942E2d29f05309938Ea806deFA1758A019DdDB70"; // Disney
const TSLA_TOKEN_CONTRACT = "0x74Ed07d83999bC5DB0ffd850da0a6Bd782AbD39c"; // Tesla
const AMD_TOKEN_CONTRACT = "0x0B955628aCf18834A7BF81FbE303c36221f2fD26"; // AMD
const SPY_TOKEN_CONTRACT = "0x8A768Ef1d44939E2C6e36b83A948295962D6f795"; // S&P 500
const MSTR_TOKEN_CONTRACT = "0x5de98C65A9a3c414550E6663666bc725C23c2E7B"; // Microsoft
const IAU_TOKEN_CONTRACT = "0xE6CF0d54079BFB0e441C1ef37E69a234e9e4E4C0"; // Gold
const KO_TOKEN_CONTRACT = "0x000804047791C8e0fbD04F1A9f4567114130B9a7"; // Coca-Cola
const AMC_TOKEN_CONTRACT = "0xfdaF8D69fA9931f00b92E14bc4233cB438B24980"; // AMC Entertainment
const GME_TOKEN_CONTRACT = "0x2bB9282552228734Cca01a1671605122258E276a"; // GameStop

import { transferFromSolana } from "@wormhole-foundation/sdk";

async function transfer_from_solana(data) {
  // gotta swap to USDC first then bridge to base
  // then swap in base
  await transferFromSolana({
    token: USDC_ADDRESS_ON_BASE,
    amount: "1000000", // 1 USDC
    targetChain: "base",
    recipient: solanaWallet.publicKey.toBase58(),
    signer: ethSigner,
  });
}

// Export functions for use in other modules
module.exports = {
  transfer_from_solana,
};
