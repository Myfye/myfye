/*const Dinari = require('@dinari/api-sdk');
const { resolveViemChain, signTransferPermitAndOrderForViem } = require('@dinari/viem-client');
const { createWalletClient, custom, http } = require('viem');
const { privateKeyToAccount } = require('viem/accounts');

const EVM_PRIV_KEY = process.env.EVM_PRIV_KEY;
const DINARI_API_KEY = process.env.DINARI_API_KEY;
const DINARI_API_SECRET = process.env.DINARI_API_SECRET;

const client = new Dinari({
  apiKeyID: DINARI_API_KEY, // This is the default and can be omitted
  apiSecretKey: DINARI_API_SECRET, // This is the default and can be omitted
  environment: 'production', // defaults to 'production' can be 'sandbox'
});

async function sign_order() {
  // Step 1. Prepare the Proxied Order
  const accountId = '01979879-e42c-7bc5-ad4e-01431fa4da52';
  const caip2ChainId = 'eip155:8453';
  const preparedProxiedOrder = await client.v2.accounts.orderRequests.stocks.eip155.prepareProxiedOrder(accountId, {
    chain_id: caip2ChainId,
    order_side: 'BUY',
    order_tif: 'DAY',
    order_type: 'MARKET',
    stock_id: '0196ea6d-b6de-70d5-ae41-9525959ef309',
    payment_token: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
    payment_token_quantity: 1,
  });
  
  // Step 2. The user signs the permit and order transactions off-chain
  // Backend environment using private key
  const viemChain = resolveViemChain(caip2ChainId);
  const account = privateKeyToAccount(EVM_PRIV_KEY);
  const walletClient = createWalletClient({ 
    account,
    transport: http(),
    chain: viemChain 
  });
  const { permitSignature, orderSignature } = await signTransferPermitAndOrderForViem(walletClient, preparedProxiedOrder);

  console.log('Permit signature:', permitSignature);
  console.log('Order signature:', orderSignature);
  
  // Step 3. The permit and order signatures are used to submit the Proxied Order
  const createdProxiedOrder = await client.v2.accounts.orderRequests.stocks.eip155.createProxiedOrder(accountId,
    {
      order_signature: orderSignature,
      permit_signature: permitSignature,
      prepared_proxied_order_id: preparedProxiedOrder.id,
    }
  );

  return createdProxiedOrder;
}

module.exports = {
  sign_order
}; 
*/