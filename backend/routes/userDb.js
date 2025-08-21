const pool = require("../db");

async function createUser(userData) {
    // First check if user with same privyUserId exists
    const existingUser = await getUserByPrivyId(userData.privyUserId);
    if (existingUser) {
        return existingUser;
    }

    console.log("\n=== New User Creation Request Received ===");

    // Create UTC timestamp
    const now = new Date();
    const utcTimestamp = now.toISOString();
        
    console.log("Creating user with UTC timestamp:", utcTimestamp);

    const query = `
        INSERT INTO users (
            email, phone_number, first_name, last_name, country,
            evm_pub_key, solana_pub_key, privy_user_id, persona_account_id,
            blind_pay_receiver_id, blind_pay_evm_wallet_id, creation_date
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
        RETURNING *
    `;

  const values = [
    userData.email,
    userData.phoneNumber,
    userData.firstName,
    userData.lastName,
    userData.country,
    userData.evmPubKey,
    userData.solanaPubKey,
    userData.privyUserId,
    userData.personaAccountId,
    userData.blindPayReceiverId,
    userData.blindPayEvmWalletId,
    now
  ];

    try {
        const result = await pool.query(query, values);
        if (result.rows.length === 0) {
            throw new Error('Failed to create user');
        }
        // console.log("User creation result:", JSON.stringify(result, null, 2));
        return result.rows[0];
    } catch (error) {
        console.error('Error creating user:', error);
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

async function getUserById(userId) {
  const query = "SELECT * FROM users WHERE uid = $1";
  try {
    const result = await pool.query(query, [userId]);
    return result.rows[0] || null;
  } catch (error) {
    console.error("Error getting user by ID:", error);
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
}

async function getAllUsers() {
  const query = "SELECT * FROM users ORDER BY creation_date DESC";
  try {
    const result = await pool.query(query);
    return result.rows;
  } catch (error) {
    console.error("Error getting all users:", error);
    throw error;
  }
}

async function updateBlindPayReceiverId(uid, blindPayReceiverId) {
    console.log("\n=== Update Blind Pay Receiver ID Request Received ===");
    const query = `
        UPDATE users 
        SET blind_pay_receiver_id = $2
        WHERE uid = $1
        RETURNING *
    `;
    try {
        const result = await pool.query(query, [uid, blindPayReceiverId]);
        console.log('Update result:', result.rows);
        if (result.rows.length === 0) {
            throw new Error('User not found');
        }
        return result.rows[0];
    } catch (error) {
        console.error('Error updating Blind Pay Receiver ID:', error);
        throw error;
    }
}

async function updateBlindPayEvmWalletId(uid, blindPayEvmWalletId) {
    console.log("\n=== Update Blind Pay EVM Wallet ID Request Received ===");
    const query = `
        UPDATE users 
        SET blind_pay_evm_wallet_id = $2
        WHERE uid = $1
        RETURNING *
    `;
    try {
        const result = await pool.query(query, [uid, blindPayEvmWalletId]);
        console.log('Update result:', result.rows);
        if (result.rows.length === 0) {
            throw new Error('User not found');
        }
        return result.rows[0];
    } catch (error) {
        console.error('Error updating Blind Pay EVM Wallet ID:', error);
        throw error;
    }
}

async function updateKycVerified(uid, kycVerified) {
    console.log("\n=== Update KYC Verification Status Request Received ===");
    const query = `
        UPDATE users 
        SET kyc_verified = $2
        WHERE uid = $1
        RETURNING *
    `;
    try {
        const result = await pool.query(query, [uid, kycVerified]);
        console.log('Update result:', result.rows);
        if (result.rows.length === 0) {
            throw new Error('User not found');
        }
        return result.rows[0];
    } catch (error) {
        console.error('Error updating KYC verification status:', error);
        throw error;
    }
}

async function updateUserNames(uid, firstName, lastName) {
    console.log("\n=== Update User Names Request Received ===");
    const query = `
        UPDATE users 
        SET first_name = $2, last_name = $3
        WHERE uid = $1
        RETURNING *
    `;
    try {
        const result = await pool.query(query, [uid, firstName, lastName]);
        console.log('Update result:', result.rows);
        if (result.rows.length === 0) {
            throw new Error('User not found');
        }
        return result.rows[0];
    } catch (error) {
        console.error('Error updating user names:', error);
        throw error;
    }
}

async function deleteUser(userId) {
    console.log("\n=== Delete User Request Received ===");
    console.log("User ID:", userId);

    const client = await pool.connect();
    
    try {
        await client.query('BEGIN');

        // First, get user data to retrieve BlindPay IDs
        const userQuery = 'SELECT * FROM users WHERE uid = $1';
        const userResult = await client.query(userQuery, [userId]);
        
        if (userResult.rows.length === 0) {
            throw new Error('User not found');
        }

        const user = userResult.rows[0];
        console.log("Found user:", user.email);

        // Delete user-related data in the correct order (respecting foreign key constraints)

        // 1. Delete user contacts (both as user and as contact)
        console.log("Deleting user contacts...");
        await client.query('DELETE FROM user_contacts WHERE user_id = $1 OR contact_id = $1', [userId]);

        // 2. Delete error logs
        console.log("Deleting error logs...");
        await client.query('DELETE FROM error_logs WHERE user_id = $1', [userId]);

        // 3. Delete user sessions
        console.log("Deleting user sessions...");
        await client.query('DELETE FROM user_sessions WHERE user_id = $1', [userId]);

        // 4. Delete recently used addresses
        console.log("Deleting recently used addresses...");
        await client.query('DELETE FROM recently_used_solana_addresses WHERE user_id = $1', [userId]);
        await client.query('DELETE FROM recently_used_evm_addresses WHERE user_id = $1', [userId]);

        // 5. Delete swap transactions
        console.log("Deleting swap transactions...");
        await client.query('DELETE FROM swap_transactions WHERE user_id = $1', [userId]);

        // 6. Delete pay transactions (both as sender and receiver)
        console.log("Deleting pay transactions...");
        await client.query('DELETE FROM pay_transactions WHERE sender_id = $1 OR receiver_id = $1', [userId]);

        // 7. Delete bank accounts
        console.log("Deleting bank accounts...");
        await client.query('DELETE FROM blind_pay_bank_accounts WHERE user_id = $1', [userId]);

        // 8. Finally, delete the user
        console.log("Deleting user...");
        const deleteUserResult = await client.query('DELETE FROM users WHERE uid = $1 RETURNING *', [userId]);
        
        if (deleteUserResult.rows.length === 0) {
            throw new Error('Failed to delete user');
        }

        await client.query('COMMIT');

        console.log("✅ User and all associated data deleted successfully from database");

        // Return user data for BlindPay deletion
        return {
            success: true,
            user: deleteUserResult.rows[0],
            message: "User and all associated data deleted successfully from database"
        };

    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Error deleting user:', error);
        throw error;
    } finally {
        client.release();
    }
}

async function deleteUserWithBlindPay(userId) {
    console.log("\n=== Delete User with BlindPay Request Received ===");
    console.log("User ID:", userId);

    try {
        // First, get user data to retrieve BlindPay IDs before deletion
        const userQuery = 'SELECT * FROM users WHERE uid = $1';
        const userResult = await pool.query(userQuery, [userId]);
        
        if (userResult.rows.length === 0) {
            throw new Error('User not found');
        }

        const user = userResult.rows[0];
        console.log("Found user:", user.email);
        console.log("BlindPay Receiver ID:", user.blind_pay_receiver_id);
        console.log("BlindPay EVM Wallet ID:", user.blind_pay_evm_wallet_id);

        // Delete user from database first
        const dbDeletionResult = await deleteUser(userId);
        console.log("Database deletion result:", dbDeletionResult);

        // Now handle BlindPay deletion if IDs exist
        let blindPayDeletionResult = null;
        
        if (user.blind_pay_receiver_id && user.blind_pay_evm_wallet_id) {
            console.log("Deleting BlindPay receiver and blockchain wallet...");
            
            // Import the BlindPay deletion function
            const { delete_blockchain_wallet_and_receiver } = require('./blindPay/receiver.js');
            
            try {
                blindPayDeletionResult = await delete_blockchain_wallet_and_receiver(
                    user.blind_pay_receiver_id, 
                    user.blind_pay_evm_wallet_id
                );
                console.log("BlindPay deletion successful:", blindPayDeletionResult);
            } catch (blindPayError) {
                console.error("Error deleting BlindPay data:", blindPayError);
                // Don't throw here - we want to return success for database deletion
                blindPayDeletionResult = {
                    success: false,
                    error: blindPayError.message
                };
            }
        } else {
            console.log("No BlindPay IDs found, skipping BlindPay deletion");
            blindPayDeletionResult = {
                success: true,
                message: "No BlindPay data to delete"
            };
        }

        return {
            success: true,
            databaseDeletion: dbDeletionResult,
            blindPayDeletion: blindPayDeletionResult,
            user: user,
            message: "User deletion process completed"
        };

    } catch (error) {
        console.error('Error in deleteUserWithBlindPay:', error);
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
  getUserById,
  getAllUsers,
  updateBlindPayReceiverId,
  updateBlindPayEvmWalletId,
  updateKycVerified,
  updateUserNames,
  deleteUser,
  deleteUserWithBlindPay,
};
