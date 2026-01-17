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

    // Step 2: Get wallets for the user to extract Solana address
    // Check if wallets are already in the response
    let wallets = user.wallets || [];
    let solanaAddress = null;

    // If no wallets in response, fetch them (with retry logic)
    if (wallets.length === 0) {
      // Wait a moment for wallet to be created
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Try to fetch wallets with retries
      for (let attempt = 0; attempt < 3; attempt++) {
        try {
          const walletsResponse = await axios.get(
            `https://api.privy.io/v1/users/${user.id}/wallets`,
            {
              headers: {
                'Authorization': `Basic ${Buffer.from(`${PRIVY_APP_ID}:${PRIVY_APP_SECRET}`).toString('base64')}`,
                'privy-app-id': PRIVY_APP_ID,
                'Content-Type': 'application/json',
              },
            }
          );

          wallets = walletsResponse.data?.data || [];
          console.log(`Attempt ${attempt + 1}: User wallets:`, wallets);

          if (wallets.length > 0) {
            break;
          }

          // Wait before retry
          if (attempt < 2) {
            await new Promise(resolve => setTimeout(resolve, 1000));
          }
        } catch (error) {
          console.warn(`Attempt ${attempt + 1} failed to fetch wallets:`, error.message);
          if (attempt < 2) {
            await new Promise(resolve => setTimeout(resolve, 1000));
          }
        }
      }
    }

    // Find Solana wallet
    const solanaWallet = wallets.find(w => w.chain_type === 'solana');
    solanaAddress = solanaWallet?.address || null;

    if (!solanaAddress) {
      console.warn('No Solana wallet found for pregenerated user:', user.id);
      console.warn('Available wallets:', wallets.map(w => ({ chain_type: w.chain_type, address: w.address })));
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

