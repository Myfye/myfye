require("dotenv").config();
const { signTransferPermitAndOrder, createProxiedOrderFlow } = require('./sign_order');

// Example of how to use the restructured sign_order.js with Dinari SDK
// This follows the pattern shown in the Dinari documentation

/**
 * Example 1: Using the modular signing functions directly
 * This is useful when you already have a prepared proxied order from the Dinari API
 */
async function exampleDirectSigning() {
    try {
        console.log('=== Example 1: Direct Signing ===');
        
        // Simulate a prepared proxied order from Dinari API
        // In real usage, this would come from: dinariClient.v2.accounts.orderRequests.stocks.eip155.prepareProxiedOrder()
        const mockPreparedOrder = {
            id: "0197aa56-fca3-7d2f-b033-8c39f375a6d2",
            permit_typed_data: {
                domain: {
                    chainId: 8453,
                    name: "USD Coin",
                    verifyingContract: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
                    version: "2"
                },
                message: {
                    deadline: 1750910716,
                    nonce: 0,
                    owner: "0x0E194f9B0179cC3ab5b47188475378972C914787",
                    spender: "0x63FF43009f9ba3584aF2Ddfc3D5FE2cb8AE539c0",
                    value: 1207986
                },
                primaryType: "Permit",
                types: {
                    EIP712Domain: [
                        { name: "name", type: "string" },
                        { name: "version", type: "string" },
                        { name: "chainId", type: "uint256" },
                        { name: "verifyingContract", type: "address" }
                    ],
                    Permit: [
                        { name: "owner", type: "address" },
                        { name: "spender", type: "address" },
                        { name: "value", type: "uint256" },
                        { name: "nonce", type: "uint256" },
                        { name: "deadline", type: "uint256" }
                    ]
                }
            },
            order_typed_data: {
                domain: {
                    chainId: 8453,
                    name: "OrderProcessor",
                    verifyingContract: "0x63FF43009f9ba3584aF2Ddfc3D5FE2cb8AE539c0",
                    version: "1"
                },
                message: {
                    deadline: 1750910116,
                    id: "21936984253610575526194288619018820840718131175753627221637744526779786422055"
                },
                primaryType: "OrderRequest",
                types: {
                    EIP712Domain: [
                        { name: "name", type: "string" },
                        { name: "version", type: "string" },
                        { name: "chainId", type: "uint256" },
                        { name: "verifyingContract", type: "address" }
                    ],
                    OrderRequest: [
                        { name: "id", type: "uint256" },
                        { name: "deadline", type: "uint64" }
                    ]
                }
            }
        };

        // Sign the prepared order
        const signatures = await signTransferPermitAndOrder(mockPreparedOrder);
        
        console.log('Signatures generated:');
        console.log('Account Address:', signatures.account_address);
        console.log('Order ID:', signatures.order_id);
        console.log('Permit Signature:', signatures.permit_signature);
        console.log('Order Signature:', signatures.order_signature);
        
        // Now you can use these signatures to call the Dinari API
        // const createdOrder = await dinariClient.v2.accounts.orderRequests.stocks.eip155.createProxiedOrder(
        //     accountId,
        //     {
        //         order_signature: signatures.order_signature,
        //         permit_signature: signatures.permit_signature,
        //         prepared_proxied_order_id: mockPreparedOrder.id,
        //     }
        // );
        
    } catch (error) {
        console.error('Error in direct signing example:', error);
    }
}

/**
 * Example 2: Complete flow using the Dinari SDK pattern
 * This demonstrates the full flow from preparing to creating a proxied order
 */
async function exampleCompleteFlow() {
    try {
        console.log('\n=== Example 2: Complete Flow ===');
        
        // Note: This example requires the Dinari SDK to be installed
        // npm install @dinari/api-sdk
        
        // Uncomment the following code when you have the Dinari SDK installed:
        /*
        const Dinari = require('@dinari/api-sdk');
        
        const client = new Dinari({
            apiKeyID: process.env.DINARI_API_KEY_ID,
            apiSecretKey: process.env.DINARI_API_SECRET_KEY,
            environment: 'sandbox', // or 'production'
        });

        const accountId = 'your-account-id';
        const caip2ChainId = 'eip155:8453'; // Base chain
        const orderParams = {
            chain_id: caip2ChainId,
            order_side: 'BUY',
            order_tif: 'DAY',
            order_type: 'MARKET',
            stock_id: '0196d545-d8a8-7210-8cd1-a49e82c31e53',
            payment_token: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913", // USDC on Base
            payment_token_quantity: 10,
        };

        // Use the complete flow function
        const createdOrder = await createProxiedOrderFlow(
            client, 
            accountId, 
            orderParams
        );
        
        console.log('Proxied order created:', createdOrder);
        */
        
        console.log('Complete flow example requires Dinari SDK installation');
        console.log('Uncomment the code above and install: npm install @dinari/api-sdk');
        
    } catch (error) {
        console.error('Error in complete flow example:', error);
    }
}

/**
 * Example 3: Frontend integration pattern
 * This shows how the signing functions could be used in a frontend environment
 */
async function exampleFrontendIntegration() {
    try {
        console.log('\n=== Example 3: Frontend Integration Pattern ===');
        
        // In a frontend environment, you would typically:
        // 1. Get the prepared order from your backend
        // 2. Use the user's wallet to sign the transactions
        // 3. Send the signatures back to your backend to create the order
        
        console.log('Frontend integration would use:');
        console.log('1. window.ethereum for wallet connection');
        console.log('2. signTransferPermitAndOrder() with user\'s wallet');
        console.log('3. Send signatures to backend for order creation');
        
        // Example frontend code structure:
        /*
        // Frontend code example:
        const { createWalletClient, custom } = require('viem');
        const { signTransferPermitAndOrder } = require('./sign_order');
        
        async function signOrderInFrontend(preparedOrder) {
            const walletClient = createWalletClient({ 
                transport: custom(window.ethereum), 
                chain: base 
            });
            
            // The user will be prompted to sign each transaction
            const signatures = await signTransferPermitAndOrder(preparedOrder, walletClient);
            return signatures;
        }
        */
        
    } catch (error) {
        console.error('Error in frontend integration example:', error);
    }
}

/**
 * Main function to run all examples
 */
async function main() {
    try {
        console.log('Running Dinari Proxied Order Examples...\n');
        
        await exampleDirectSigning();
        await exampleCompleteFlow();
        await exampleFrontendIntegration();
        
        console.log('\n=== Examples Complete ===');
        console.log('Check the output above to see how each pattern works.');
        
    } catch (error) {
        console.error('Error running examples:', error);
        process.exit(1);
    }
}

// Export functions for use in other modules
module.exports = {
    exampleDirectSigning,
    exampleCompleteFlow,
    exampleFrontendIntegration
};

// Run if this file is executed directly
if (require.main === module) {
    main();
} 