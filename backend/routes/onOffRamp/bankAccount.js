const axios = require("axios");
const { createErrorLog } = require('../errorLog');
const pool = require('../../db');

//const BLIND_PAY_API_KEY = process.env.BLIND_PAY_API_KEY;
//const BLIND_PAY_INSTANCE_ID = process.env.BLIND_PAY_INSTANCE_ID;

const BLIND_PAY_API_KEY = process.env.BLIND_PAY_DEV_API_KEY;
const BLIND_PAY_INSTANCE_ID = process.env.BLIND_PAY_DEV_INSTANCE_ID;

async function create_new_bank_account(data) {
  console.log("Create new bank account called!");
  console.log(
    "Processing create_new_bank_account request with data:",
    JSON.stringify(data, null, 2)
  );

  try {
    const receiverId = data.receiver_id;

    const options = {
      method: 'POST',
      url: `https://api.blindpay.com/v1/instances/${BLIND_PAY_INSTANCE_ID}/receivers/${receiverId}/bank-accounts`,
      headers: {'Content-Type': 'application/json', Authorization: `Bearer ${BLIND_PAY_API_KEY}`},
      data: {
        "type": data.type || "spei_bitso",
        "name": data.name || "Bank Account Name", // Bank Account Name required
        "beneficiary_name": data.beneficiary_name || "",
        "spei_protocol": data.spei_protocol || "clabe",
        "spei_institution_code": data.spei_institution_code || "40012", // 5-digit institution code (e.g., 40012 for BBVA)
        "spei_clabe": data.spei_clabe || "5482347403740546",
      }
    };

    const response = await axios.request(options);
    console.log("BlindPay API response:", response.data);

    /*
        "data": {
        "id": "ba_ePXIbnQVRfGZ",
        "type": "spei_bitso",
        "name": "Bank Account Name",
        "beneficiary_name": "Aaron Ramirez Lezama",
        "spei_protocol": "clabe",
        "spei_institution_code": "40002",
        "spei_clabe": "012650015162741850"
    },
    */

    // Save bank account to database
    console.log("=== DATABASE SAVE ATTEMPT ===");
    console.log("response.data?.id:", response.data?.id);
    console.log("data.user_id:", data.user_id);
    console.log("Both values present:", !!(response.data?.id && data.user_id));
    
    if (response.data?.id && data.user_id) {
      try {
        const bankAccountId = response.data.id;
        const userId = data.user_id;
        
        console.log(`Attempting to save bank account ${bankAccountId} for user ${userId} to database`);
        
        const insertQuery = `
          INSERT INTO blind_pay_bank_accounts (id, user_id) 
          VALUES ($1, $2)
          ON CONFLICT (id) DO NOTHING
          RETURNING id
        `;
        
        console.log("Executing query:", insertQuery);
        console.log("With parameters:", [bankAccountId, userId]);
        
        const insertResult = await pool.query(insertQuery, [bankAccountId, userId]);
        
        console.log("Query result:", insertResult);
        console.log("Rows affected:", insertResult.rowCount);
        console.log("Returned rows:", insertResult.rows);
        
        if (insertResult.rowCount > 0) {
          console.log(`✅ Bank account ${bankAccountId} successfully saved to database for user ${userId}`);
        } else {
          console.log(`⚠️ Bank account ${bankAccountId} already exists in database (ON CONFLICT triggered)`);
          
          // Check if the record actually exists
          const checkQuery = 'SELECT * FROM blind_pay_bank_accounts WHERE id = $1';
          const checkResult = await pool.query(checkQuery, [bankAccountId]);
          console.log("Existing record check:", checkResult.rows);
        }
        
      } catch (dbError) {
        console.error("❌ ERROR saving bank account to database:");
        console.error("Error message:", dbError.message);
        console.error("Error code:", dbError.code);
        console.error("Error detail:", dbError.detail);
        console.error("Error stack:", dbError.stack);
        
        // Continue execution even if database save fails
      }
    } else {
      console.log("❌ Skipping database save - missing required data:");
      console.log("- Bank account ID missing:", !response.data?.id);
      console.log("- User ID missing:", !data.user_id);
    }

    return {
      success: true,
      data: response.data,
      message: "Bank account created successfully"
    };

  } catch (error) {
    console.error("Detailed error in create_new_bank_account:", {
      message: error.message,
      stack: error.stack,
      response: error.response?.data,
    });

    // Create error log
    await createErrorLog({
      user_id: data.user_id,
      error_message: error.message,
      error_type: 'BlindPay Bank Account Creation Error',
      error_stack_trace: error.stack
    });

    return {
      success: false,
      error: error.message,
      details: error.response?.data || error.stack,
    };
  }
}

async function get_bank_accounts(data) {
  console.log("Get bank accounts called!");
  console.log("Processing get_bank_accounts request with data:", JSON.stringify(data, null, 2));

  try {
    const { user_id } = data;
    
    if (!user_id) {
      return {
        success: false,
        error: "User ID is required"
      };
    }

    // Get the receiver_id from the database
    const userQuery = 'SELECT blind_pay_receiver_id FROM users WHERE uid = $1';
    const userResult = await pool.query(userQuery, [user_id]);
    
    if (userResult.rows.length === 0) {
      return {
        success: false,
        error: "User not found"
      };
    }

    const receiverId = userResult.rows[0].blind_pay_receiver_id;
    
    if (!receiverId) {
      return {
        success: false,
        error: "User does not have a BlindPay receiver ID"
      };
    }

    // Call BlindPay API to get bank accounts
    const options = {
      method: 'GET',
      url: `https://api.blindpay.com/v1/instances/${BLIND_PAY_INSTANCE_ID}/receivers/${receiverId}/bank-accounts`,
      headers: {
        'Authorization': `Bearer ${BLIND_PAY_API_KEY}`,
        'Content-Type': 'application/json'
      }
    };

    const response = await axios.request(options);
    console.log("BlindPay API response:", response.data);

    return {
      success: true,
      data: response.data,
      message: "Bank accounts retrieved successfully"
    };

  } catch (error) {
    console.error("Detailed error in get_bank_accounts:", {
      message: error.message,
      stack: error.stack,
      response: error.response?.data,
    });

    // Create error log
    await createErrorLog({
      user_id: data.user_id,
      error_message: error.message,
      error_type: 'BlindPay Get Bank Accounts Error',
      error_stack_trace: error.stack
    });

    return {
      success: false,
      error: error.message,
      details: error.response?.data || error.stack,
    };
  }
}

async function delete_bank_account(data) {
  console.log("Delete bank account called!");
  console.log("Processing delete_bank_account request with data:", JSON.stringify(data, null, 2));

  try {
    const { user_id, bank_account_id } = data;
    
    if (!user_id || !bank_account_id) {
      return {
        success: false,
        error: "User ID and bank account ID are required"
      };
    }

    // Get the receiver_id from the database
    const userQuery = 'SELECT blind_pay_receiver_id FROM users WHERE uid = $1';
    const userResult = await pool.query(userQuery, [user_id]);
    
    if (userResult.rows.length === 0) {
      return {
        success: false,
        error: "User not found"
      };
    }

    const receiverId = userResult.rows[0].blind_pay_receiver_id;
    
    if (!receiverId) {
      return {
        success: false,
        error: "User does not have a BlindPay receiver ID"
      };
    }

    // First, delete from our database
    try {
      console.log("=== DATABASE DELETE ATTEMPT ===");
      console.log("Attempting to delete bank account:", bank_account_id);
      console.log("For user:", user_id);
      
      // First, check if the bank account exists in our database
      const checkQuery = 'SELECT * FROM blind_pay_bank_accounts WHERE id = $1';
      const checkResult = await pool.query(checkQuery, [bank_account_id]);
      console.log("Bank account exists in database:", checkResult.rows.length > 0);
      console.log("Existing records:", checkResult.rows);
      
      if (checkResult.rows.length > 0) {
        const existingRecord = checkResult.rows[0];
        console.log("Found record - user_id:", existingRecord.user_id);
        console.log("Requested user_id:", user_id);
        console.log("User IDs match:", existingRecord.user_id === user_id);
      }
      
      const deleteQuery = 'DELETE FROM blind_pay_bank_accounts WHERE id = $1 AND user_id = $2';
      console.log("Executing delete query:", deleteQuery);
      console.log("With parameters:", [bank_account_id, user_id]);
      
      const deleteResult = await pool.query(deleteQuery, [bank_account_id, user_id]);
      console.log("Delete result rowCount:", deleteResult.rowCount);
      
      if (deleteResult.rowCount === 0) {
        console.log("❌ No rows deleted - bank account not found or user mismatch");
        
        // Check if it's a user mismatch or account doesn't exist
        const userCheckQuery = 'SELECT * FROM blind_pay_bank_accounts WHERE id = $1';
        const userCheckResult = await pool.query(userCheckQuery, [bank_account_id]);
        
        if (userCheckResult.rows.length > 0) {
          console.log("Bank account exists but belongs to different user:", userCheckResult.rows[0].user_id);
          return {
            success: false,
            error: "User not authorized to delete this bank account",
            details: `Bank account belongs to user ${userCheckResult.rows[0].user_id}, not ${user_id}`
          };
        } else {
          console.log("Bank account does not exist in local database");
          console.log("⚠️ Bank account not in local database, but will still attempt BlindPay deletion");
        }
      } else {
        console.log(`✅ Bank account ${bank_account_id} deleted from database for user ${user_id}`);
      }
      
    } catch (dbError) {
      console.error("❌ Error deleting bank account from database:", dbError);
      return {
        success: false,
        error: "Failed to delete bank account from database",
        details: dbError.message
      };
    }

    // Then, delete from BlindPay API
    const options = {
      method: 'DELETE',
      url: `https://api.blindpay.com/v1/instances/${BLIND_PAY_INSTANCE_ID}/receivers/${receiverId}/bank-accounts/${bank_account_id}`,
      headers: {
        'Authorization': `Bearer ${BLIND_PAY_API_KEY}`,
        'Content-Type': 'application/json'
      }
    };

    const response = await axios.request(options);
    console.log("BlindPay API delete response:", response.data);

    return {
      success: true,
      data: response.data,
      message: "Bank account deleted successfully from both database and BlindPay"
    };

  } catch (error) {
    console.error("Detailed error in delete_bank_account:", {
      message: error.message,
      stack: error.stack,
      response: error.response?.data,
    });

    // Create error log
    await createErrorLog({
      user_id: data.user_id,
      error_message: error.message,
      error_type: 'BlindPay Bank Account Deletion Error',
      error_stack_trace: error.stack
    });

    // If BlindPay API call failed but database deletion succeeded, 
    // we might want to handle this case differently
    if (error.response?.status === 404) {
      return {
        success: true,
        message: "Bank account deleted from database. BlindPay account was already deleted or not found.",
        warning: "BlindPay API returned 404 - account may have been previously deleted"
      };
    }

    return {
      success: false,
      error: error.message,
      details: error.response?.data || error.stack,
    };
  }
}

async function get_all_bank_accounts() {
  console.log("Get all bank accounts called!");

  try {
    // Get all users who have a BlindPay receiver ID
    const usersQuery = `
      SELECT 
        uid as user_id,
        email,
        first_name,
        last_name,
        blind_pay_receiver_id
      FROM users 
      WHERE blind_pay_receiver_id IS NOT NULL
      ORDER BY uid DESC
    `;
    
    const usersResult = await pool.query(usersQuery);
    console.log(`Found ${usersResult.rows.length} users with BlindPay receiver IDs`);

    // For each user, fetch their bank accounts from BlindPay API
    const allBankAccounts = [];
    
    for (const user of usersResult.rows) {
      try {
        const options = {
          method: 'GET',
          url: `https://api.blindpay.com/v1/instances/${BLIND_PAY_INSTANCE_ID}/receivers/${user.blind_pay_receiver_id}/bank-accounts`,
          headers: {
            'Authorization': `Bearer ${BLIND_PAY_API_KEY}`,
            'Content-Type': 'application/json'
          }
        };

        const response = await axios.request(options);
        
        // Add user info to each bank account
        if (response.data && Array.isArray(response.data)) {
          response.data.forEach(bankAccount => {
            allBankAccounts.push({
              bank_account_id: bankAccount.id,
              user_id: user.user_id,
              email: user.email,
              first_name: user.first_name,
              last_name: user.last_name,
              blind_pay_receiver_id: user.blind_pay_receiver_id,
              blind_pay_details: bankAccount,
              error: null
            });
          });
        }
        
        console.log(`Retrieved ${response.data?.length || 0} bank accounts for user ${user.email}`);
      } catch (error) {
        console.error(`Error fetching bank accounts for user ${user.email}:`, error.message);
        
        // If it's a 404, the user just doesn't have any bank accounts
        if (error.response?.status !== 404) {
          // Add an error entry for this user
          allBankAccounts.push({
            bank_account_id: null,
            user_id: user.user_id,
            email: user.email,
            first_name: user.first_name,
            last_name: user.last_name,
            blind_pay_receiver_id: user.blind_pay_receiver_id,
            blind_pay_details: null,
            error: error.message
          });
        }
      }
    }

    console.log(`Total bank accounts found: ${allBankAccounts.length}`);

    return {
      success: true,
      data: allBankAccounts,
      message: `Retrieved ${allBankAccounts.length} bank accounts across ${usersResult.rows.length} users`
    };

  } catch (error) {
    console.error("Detailed error in get_all_bank_accounts:", {
      message: error.message,
      stack: error.stack,
    });

    // Create error log
    await createErrorLog({
      user_id: null,
      error_message: error.message,
      error_type: 'Get All Bank Accounts Error',
      error_stack_trace: error.stack
    });

    return {
      success: false,
      error: error.message,
      details: error.stack,
    };
  }
}


module.exports = { create_new_bank_account, get_bank_accounts, delete_bank_account, get_all_bank_accounts };