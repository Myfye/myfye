const axios = require('axios');

const PRIVY_APP_ID = process.env.PRIVY_APP_ID;
const PRIVY_APP_SECRET = process.env.PRIVY_APP_SECRET;

async function pregenerateUser(email) {
  try {
    // Log to verify environment variables are set
    console.log('PRIVY_APP_ID:', PRIVY_APP_ID ? 'Set' : 'Not set');
    console.log('PRIVY_APP_SECRET:', PRIVY_APP_SECRET ? 'Set' : 'Not set');

    // Step 1: Pregenerate the user with Solana wallet
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
            chain_type: 'solana'
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

    const user = response.data;
    console.log('Successfully pregenerated Privy user:', user);

    // Extract Solana wallet from linked_accounts
    // Wallets are returned as linked_accounts with type: 'wallet'
    const solanaWallet = user.linked_accounts?.find(
      account => account.type === 'wallet' && account.chain_type === 'solana'
    );
    
    const solanaAddress = solanaWallet?.address || null;

    if (!solanaAddress) {
      console.warn('No Solana wallet found for pregenerated user:', user.id);
      console.warn('Available linked_accounts:', user.linked_accounts?.map(acc => ({ 
        type: acc.type, 
        chain_type: acc.chain_type, 
        address: acc.address 
      })));
    } else {
      console.log('Found Solana address:', solanaAddress);
    }

    // Return user data with Solana address
    return {
      ...user,
      solana_pub_key: solanaAddress,
    };
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

