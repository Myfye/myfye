const axios = require('axios');
const PRIVY_API_KEY = process.env.PRIVY_APP_SECRET;
const PRIVY_APP_ID = process.env.PRIVY_APP_ID;

// Function to get all wallets from Privy API
async function getAllWallets(cursor = null) {
  try {
    // Check if credentials are available
    if (!PRIVY_API_KEY) {
      throw new Error('PRIVY_APP_SECRET environment variable is not set');
    }
    if (!PRIVY_APP_ID) {
      throw new Error('PRIVY_APP_ID environment variable is not set');
    }

    let url = 'https://api.privy.io/v1/wallets';
    if (cursor) {
      url += `?cursor=${cursor}`;
    }
    console.log(`Fetching wallets from Privy API... (cursor: ${cursor})`);
    const response = await axios.get(url, {
      auth: {
        username: PRIVY_APP_ID,
        password: PRIVY_API_KEY
      },
      headers: {
        'privy-app-id': PRIVY_APP_ID,
        'Content-Type': 'application/json'
      }
    });
    const wallets = response.data?.data || [];
    console.log(`Fetched ${wallets.length} wallets from Privy (cursor: ${cursor})`);
    if (response.data?.next_cursor) {
      console.log(`Next cursor detected: ${response.data.next_cursor}`);
    }
    return response.data;
  } catch (error) {
    console.error('Error fetching wallets from Privy:', error.response?.data || error.message);
    if (error.response?.status === 401) {
      throw new Error('Unauthorized: Invalid Privy API credentials');
    } else if (error.response?.status === 403) {
      throw new Error('Forbidden: Insufficient permissions to access Privy API');
    } else {
      throw new Error(`Failed to fetch wallets: ${error.response?.data?.message || error.message}`);
    }
  }
}

// Function to get wallet ID by address
async function getWalletIdByAddress(address) {
  try {
    console.log(`Searching for wallet with address: ${address}`);
    if (!address) {
      throw new Error('Address parameter is required');
    }
    let cursor = null;
    let page = 1;
    while (true) {
      console.log(`Requesting page ${page} (cursor: ${cursor})`);
      const walletsResponse = await getAllWallets(cursor);
      if (!walletsResponse.data || !Array.isArray(walletsResponse.data)) {
        throw new Error('Invalid response format from Privy API');
      }
      for (const w of walletsResponse.data) {
        console.log(`Checking wallet address: ${w.address}`);
        if (w.address && w.address.toLowerCase() === address.toLowerCase()) {
          console.log(`Found wallet with ID: ${w.id} for address: ${address}`);
          return {
            success: true,
            walletId: w.id,
            address: w.address,
            chainType: w.chain_type,
            ownerId: w.owner_id
          };
        }
      }
      if (walletsResponse.next_cursor) {
        cursor = walletsResponse.next_cursor;
        page++;
      } else {
        break;
      }
    }
    console.log(`No wallet found with address: ${address} after checking all pages.`);
    return { success: false, message: 'Wallet not found' };
  } catch (error) {
    console.error('Error getting wallet ID by address:', error);
    throw error;
  }
}

module.exports = {
  getAllWallets,
  getWalletIdByAddress
};


/* Example
Response:

The response will be a list of wallet objects, each containing its id, address, chain_type, and other details.

{
  "data": [
    {
      "id": "id2tptkqrxd39qo9j423etij",
      "address": "0xF1DBff66C993EE895C8cb176c30b07A559d76496",
      "chain_type": "ethereum",
      "policy_ids": [],
      "additional_signers": [],
      "owner_id": "rkiz0ivz254drv1xw982v3jq",
      "created_at": 1741834854578
    }
  ],
  "next_cursor": "u67nttpkeeti2hm9w7aoxdcc"
}
  */