/**
* On-Ramp Service
* 
* This module handles cryptocurrency on-ramp operations,
* allowing users to convert fiat currency to cryptocurrency.
*/

// Load environment variables
require('dotenv').config();

// Get API key from environment variables
const BLIND_PAY_API_KEY = process.env.BLIND_PAY_API_KEY;
const BLIND_PAY_INSTANCE_ID = process.env.BLIND_PAY_INSTANCE_ID;

async function processOnRampRequest(data) {
   console.log('On-ramp called!');
   console.log('Processing on-ramp request with data:', data);
   
   
   // TO do
   // 1. Validate the request data
   // 2. Interact with an on-ramp provider API
   // 3. Process the transaction
   // 4. Return results to the user

    try {
        const response = await fetch(`https://api.blindpay.com/v1/instances/${BLIND_PAY_INSTANCE_ID}/payin-quotes`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${BLIND_PAY_API_KEY}` // Using the raw API key (Clerk may need it without 'Bearer' prefix)
            },
            body: JSON.stringify({
                blockchain_wallet_id: 'bw_000000000000',
                currency_type: 'sender',
                cover_fees: true,
                request_amount: 1000,
                payment_method: 'pix',
                token: 'USDC',
                partner_fee_id: 'pf_000000000000'
            })
        })

        console.log('Response from BlindPay API:', response);
        if (!response.ok) {
            throw new Error('Failed to fetch data from BlindPay API');
        }

        const data = await response.json();
        console.log('Received data from BlindPay API:', data);
    } catch (error) {
        console.error('Error processing on-ramp request:', error);
    }

   return {
     success: true,
     message: "On-ramp request processed successfully",
     data: data
   };
}

// Export functions for use in other modules
module.exports = {
   processOnRampRequest
}; 