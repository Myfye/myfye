const pool = require("../db");

async function createUser(userData) {
    // First check if user with same privyUserId exists
    const existingUser = await getUserByPrivyId(userData.privyUserId);
    if (existingUser) {
        return existingUser;
    }

    console.log("\n=== New User Creation Request Received ===");

    const query = `
        INSERT INTO users (
            email, phone_number, first_name, last_name, country,
            evm_pub_key, solana_pub_key, privy_user_id, persona_account_id,
            blind_pay_receiver_id, blind_pay_evm_wallet_id
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
        RETURNING *
    `;

    try {
        const result = await pool.query(query, values);
        if (result.rows.length === 0) {
            throw new Error('Failed to create user');
        }
        console.log("User creation result:", JSON.stringify(result, null, 2));
        return result.rows[0];
    } catch (error) {
        console.error('Error creating user:', error);
        throw error;
    }
    return result.rows[0];
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
}

async function getUserByEmail(email) {
  const query = "SELECT * FROM users WHERE email = $1";
  try {
    const result = await pool.query(query, [email]);
    return result.rows[0] || null;
  } catch (error) {
    console.error("Error getting user:", error);
    throw error;
  }
}

async function getUserByPrivyId(privyId) {
  const query = "SELECT * FROM users WHERE privy_user_id = $1";
  try {
    const result = await pool.query(query, [privyId]);
    return result.rows[0] || null;
  } catch (error) {
    console.error("Error getting user:", error);
    throw error;
  }
}

// Add a function to update Blind Pay IDs
async function updateBlindPayIds(
  email,
  blindPayReceiverId,
  blindPayEvmWalletId
) {
  const query = `
        UPDATE users 
        SET blind_pay_receiver_id = $2, 
            blind_pay_evm_wallet_id = $3
        WHERE email = $1
        RETURNING *
    `;
  try {
    const result = await pool.query(query, [
      email,
      blindPayReceiverId,
      blindPayEvmWalletId,
    ]);
    return result.rows[0];
  } catch (error) {
    console.error("Error updating Blind Pay IDs:", error);
    throw error;
  }
}

async function updateEvmPubKey(privyUserId, evmPubKey) {
    // First check if user already has an EVM pub key
    const existingUser = await getUserByPrivyId(privyUserId);
    if (existingUser && existingUser.evm_pub_key) {
        return existingUser;
    }

    console.log("\n=== Update EVM Public Key Request Received ===");
    const query = `
        UPDATE users 
        SET evm_pub_key = $2
        WHERE privy_user_id = $1
        RETURNING *
    `;
    try {
        const result = await pool.query(query, [privyUserId, evmPubKey]);
        console.log('Update result:', result.rows);
        if (result.rows.length === 0) {
            throw new Error('User not found');
        }
        return result.rows[0];
    } catch (error) {
        console.error('Error updating EVM public key:', error);
        throw error;
    }
    return result.rows[0];
  } catch (error) {
    console.error("Error updating EVM public key:", error);
    throw error;
  }
}

async function updateSolanaPubKey(privyUserId, solanaPubKey) {
    // First check if user already has a Solana pub key
    const existingUser = await getUserByPrivyId(privyUserId);
    if (existingUser && existingUser.solana_pub_key) {
        return existingUser;
    }

    console.log("\n=== Update Solana Public Key Request Received ===");

    const query = `
        UPDATE users 
        SET solana_pub_key = $2
        WHERE privy_user_id = $1
        RETURNING *
    `;
    try {
        const result = await pool.query(query, [privyUserId, solanaPubKey]);
        console.log('Update result:', result.rows);
        if (result.rows.length === 0) {
            throw new Error('User not found');
        }
        return result.rows[0];
    } catch (error) {
        console.error('Error updating Solana public key:', error);
        throw error;
    }
    return result.rows[0];
  } catch (error) {
    console.error("Error updating Solana public key:", error);
    throw error;
  }
}

module.exports = {
  createUser,
  getUserByEmail,
  updateBlindPayIds,
  updateEvmPubKey,
  updateSolanaPubKey,
  getUserByPrivyId,
};
