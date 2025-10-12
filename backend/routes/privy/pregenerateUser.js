const axios = require('axios');

const PRIVY_APP_ID = process.env.PRIVY_APP_ID;
const PRIVY_APP_SECRET = process.env.PRIVY_APP_SECRET;

async function pregenerateUser(email) {
  try {
    // Log to verify environment variables are set
    console.log('PRIVY_APP_ID:', PRIVY_APP_ID ? 'Set' : 'Not set');
    console.log('PRIVY_APP_SECRET:', PRIVY_APP_SECRET ? 'Set' : 'Not set');

    const response = await axios.post(
      'https://auth.privy.io/api/v1/users',
      {
        linked_accounts: [
          {
            type: 'email',
            address: email,
          },
        ],
        wallets: [
          {
            chain_type: 'ethereum',
            create_smart_wallet: true,
            // Add your signer_id and policy_ids here when you have them
            // additional_signers: [
            //   {
            //     signer_id: 'your-signer-id',
            //     override_policy_ids: ['your-policy-id']
            //   }
            // ],
            // policy_ids: ['your-policy-id']
          },
          {
            chain_type: 'solana',
            // additional_signers: [
            //   {
            //     signer_id: 'your-signer-id',
            //     override_policy_ids: ['your-policy-id']
            //   }
            // ],
            // policy_ids: []
          }
        ]
      },
      {
        headers: {
          'Authorization': `Basic ${Buffer.from(`${PRIVY_APP_ID}:${PRIVY_APP_SECRET}`).toString('base64')}`,
          'privy-app-id': PRIVY_APP_ID,
          'Content-Type': 'application/json',
        },
      }
    );

    console.log('Successfully pregenerated Privy user:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error pregenerating Privy user:', error.response?.data || error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', JSON.stringify(error.response.data, null, 2));
    }
    throw error;
  }
}

module.exports = { pregenerateUser };

