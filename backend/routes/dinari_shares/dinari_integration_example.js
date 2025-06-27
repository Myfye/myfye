require("dotenv").config();
const { signTransferPermitAndOrder, createProxiedOrderFlow } = require('./sign_order');

// Example integration with Dinari SDK using the provided account ID
// Account ID: 01979879-e42c-7bc5-ad4e-01431fa4da52

/**
 * Example 1: Basic signing with your account ID
 * This shows how to sign a prepared order using your specific account
 */
async function exampleWithYourAccount() {
    try {
        console.log('=== Example with Your Account ID ===');
        console.log('Account ID: 01979879-e42c-7bc5-ad4e-01431fa4da52');
        
        // Example order parameters for your account
        const orderParams = {
            chain_id: 'eip155:8453', // Base chain
            order_side: 'BUY',
            order_tif: 'DAY',
            order_type: 'MARKET',
            stock_id: '0196d545-d8a8-7210-8cd1-a49e82c31e53', // Example stock ID
            payment_token: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913", // USDC on Base
            payment_token_quantity: 10,
        };

        console.log('Order Parameters:', JSON.stringify(orderParams, null, 2));
        
        // This would be the flow when you have the Dinari SDK installed:
        /*
        const Dinari = require('@dinari/api-sdk');
        
        const client = new Dinari({
            apiKeyID: process.env.DINARI_API_KEY_ID,
            apiSecretKey: process.env.DINARI_API_SECRET_KEY,
            environment: 'sandbox', // or 'production'
        });

        // Step 1: Prepare the order
        const preparedOrder = await client.v2.accounts.orderRequests.stocks.eip155.prepareProxiedOrder(
            '01979879-e42c-7bc5-ad4e-01431fa4da52', 
            orderParams
        );

        // Step 2: Sign the order
        const signatures = await signTransferPermitAndOrder(preparedOrder);

        // Step 3: Create the order
        const createdOrder = await client.v2.accounts.orderRequests.stocks.eip155.createProxiedOrder(
            '01979879-e42c-7bc5-ad4e-01431fa4da52',
            {
                order_signature: signatures.order_signature,
                permit_signature: signatures.permit_signature,
                prepared_proxied_order_id: preparedOrder.id,
            }
        );
        */
        
        console.log('To use this with Dinari SDK:');
        console.log('1. Install: npm install @dinari/api-sdk');
        console.log('2. Set environment variables: DINARI_API_KEY_ID, DINARI_API_SECRET_KEY');
        console.log('3. Uncomment the code above');
        
    } catch (error) {
        console.error('Error in account example:', error);
    }
}

/**
 * Example 2: Complete flow function with your account ID
 */
async function exampleCompleteFlow() {
    try {
        console.log('\n=== Complete Flow Example ===');
        
        const accountId = '01979879-e42c-7bc5-ad4e-01431fa4da52';
        const orderParams = {
            chain_id: 'eip155:8453',
            order_side: 'BUY',
            order_tif: 'DAY',
            order_type: 'MARKET',
            stock_id: '0196d545-d8a8-7210-8cd1-a49e82c31e53',
            payment_token: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
            payment_token_quantity: 10,
        };

        console.log('Account ID:', accountId);
        console.log('Order Parameters:', JSON.stringify(orderParams, null, 2));
        
        // This would use the complete flow function:
        /*
        const Dinari = require('@dinari/api-sdk');
        
        const client = new Dinari({
            apiKeyID: process.env.DINARI_API_KEY_ID,
            apiSecretKey: process.env.DINARI_API_SECRET_KEY,
            environment: 'sandbox',
        });

        const createdOrder = await createProxiedOrderFlow(
            client, 
            accountId, 
            orderParams
        );
        
        console.log('Order created:', createdOrder);
        */
        
        console.log('Complete flow would handle all steps automatically');
        
    } catch (error) {
        console.error('Error in complete flow example:', error);
    }
}

/**
 * Example 3: Backend API endpoint structure
 * This shows how you might structure an API endpoint for order creation
 */
async function exampleAPIEndpoint() {
    try {
        console.log('\n=== API Endpoint Example ===');
        
        // This would be the structure for an Express.js endpoint:
        /*
        app.post('/api/dinari/create-order', async (req, res) => {
            try {
                const { 
                    accountId = '01979879-e42c-7bc5-ad4e-01431fa4da52',
                    orderParams 
                } = req.body;

                const Dinari = require('@dinari/api-sdk');
                
                const client = new Dinari({
                    apiKeyID: process.env.DINARI_API_KEY_ID,
                    apiSecretKey: process.env.DINARI_API_SECRET_KEY,
                    environment: 'sandbox',
                });

                const createdOrder = await createProxiedOrderFlow(
                    client, 
                    accountId, 
                    orderParams
                );

                res.json({
                    success: true,
                    order: createdOrder
                });
                
            } catch (error) {
                console.error('Error creating order:', error);
                res.status(500).json({
                    success: false,
                    error: error.message
                });
            }
        });
        */
        
        console.log('API endpoint would handle:');
        console.log('1. Validate request parameters');
        console.log('2. Call Dinari API to prepare order');
        console.log('3. Sign the order data');
        console.log('4. Create the proxied order');
        console.log('5. Return the result');
        
    } catch (error) {
        console.error('Error in API endpoint example:', error);
    }
}

/**
 * Example 4: Environment setup
 */
async function exampleEnvironmentSetup() {
    try {
        console.log('\n=== Environment Setup ===');
        
        console.log('Required environment variables:');
        console.log('EVM_PRIV_KEY=0x... (your private key for signing)');
        console.log('DINARI_API_KEY_ID=your_dinari_api_key_id');
        console.log('DINARI_API_SECRET_KEY=your_dinari_api_secret_key');
        
        console.log('\nRequired npm packages:');
        console.log('npm install @dinari/api-sdk');
        console.log('npm install viem');
        
        console.log('\nYour account details:');
        console.log('Account ID: 01979879-e42c-7bc5-ad4e-01431fa4da52');
        console.log('Supported chains: Base (eip155:8453), Arbitrum Sepolia (eip155:421614)');
        
    } catch (error) {
        console.error('Error in environment setup example:', error);
    }
}

/**
 * Main function to run all examples
 */
async function main() {
    try {
        console.log('Dinari Integration Examples for Account: 01979879-e42c-7bc5-ad4e-01431fa4da52\n');
        
        await exampleWithYourAccount();
        await exampleCompleteFlow();
        await exampleAPIEndpoint();
        await exampleEnvironmentSetup();
        
        console.log('\n=== Next Steps ===');
        console.log('1. Install the Dinari SDK: npm install @dinari/api-sdk');
        console.log('2. Set up your environment variables');
        console.log('3. Use the signTransferPermitAndOrder() function with your prepared orders');
        console.log('4. Or use createProxiedOrderFlow() for complete automation');
        
    } catch (error) {
        console.error('Error running examples:', error);
        process.exit(1);
    }
}

// Export functions for use in other modules
module.exports = {
    exampleWithYourAccount,
    exampleCompleteFlow,
    exampleAPIEndpoint,
    exampleEnvironmentSetup
};

// Run if this file is executed directly
if (require.main === module) {
    main();
} 