const { create_new_on_ramp_path, get_receiver, update_receiver } = require('../blindPay/receiver');
const pool = require('../../db');

// Reusable function for updating user KYC status in database
async function handleSumsubData(data) {

  
  

}

// New function to process Sumsub data and create BlindPay receiver
async function processSumsubDataForBlindPay(parsedSumsubData) {
  try {
    console.log('=== Processing Sumsub Data for BlindPay ===');
    console.log('User ID:', parsedSumsubData.user_id);
    
    // Query database to get user's email, EVM public key, and receiver ID
    const userQuery = `
      SELECT email, evm_pub_key, blind_pay_receiver_id 
      FROM users 
      WHERE uid = $1
    `;
    
    const userResult = await pool.query(userQuery, [parsedSumsubData.user_id]);
    
    if (userResult.rows.length === 0) {
      throw new Error(`User not found with ID: ${parsedSumsubData.user_id}`);
    }
    
    const user = userResult.rows[0];
    console.log('User data from database:', {
      email: user.email,
      evm_pub_key: user.evm_pub_key,
      blind_pay_receiver_id: user.blind_pay_receiver_id
    });
    
    if (!user.email) {
      throw new Error(`User email not found for user ID: ${parsedSumsubData.user_id}`);
    }
    
    if (!user.evm_pub_key) {
      throw new Error(`User EVM public key not found for user ID: ${parsedSumsubData.user_id}`);
    }
    
    // Prepare data for BlindPay receiver creation
    const blindPayData = {
      user_id: parsedSumsubData.user_id,
      userEvmPublicKey: user.evm_pub_key,
      email: user.email,
      first_name: parsedSumsubData.personal_info.first_name,
      last_name: parsedSumsubData.personal_info.last_name,
      date_of_birth: parsedSumsubData.personal_info.date_of_birth,
      tax_id: parsedSumsubData.personal_info.tax_id,
      country: parsedSumsubData.personal_info.country,
      address_line_1: parsedSumsubData.address_info.address_line_1,
      city: parsedSumsubData.address_info.city,
      state_province_region: parsedSumsubData.address_info.state_province_region,
      postal_code: parsedSumsubData.address_info.postal_code,
      id_doc_country: parsedSumsubData.id_doc_info.id_doc_country,
      id_doc_type: parsedSumsubData.id_doc_info.id_doc_type,
      id_doc_front_file: parsedSumsubData.id_doc_front_file,
      id_doc_back_file: parsedSumsubData.id_doc_back_file
    };
    
    // console.log('Prepared BlindPay data:', JSON.stringify(blindPayData, null, 2));
    
    let result;
    
    // Check if receiver already exists
    if (user.blind_pay_receiver_id) {
      console.log('=== Receiver already exists, checking validity ===');
      console.log('Existing receiver ID:', user.blind_pay_receiver_id);
      
      try {
        
        // Update the existing receiver with new KYC data
        console.log('=== Updating existing receiver ===');
        const updatedReceiver = await update_receiver(user.blind_pay_receiver_id, blindPayData);
        
        result = {
          success: true,
          receiver: updatedReceiver,
          blockchain_wallet: null, // No new wallet created
          message: 'Successfully updated existing BlindPay receiver'
        };
        
      } catch (error) {
        console.log('Existing receiver not found or invalid, creating new one...');
        // If the existing receiver doesn't exist, create a new one
        result = await create_new_on_ramp_path(blindPayData);
      }
    } else {
      console.log('=== No existing receiver, creating new one ===');
      // Create new receiver and blockchain wallet
      result = await create_new_on_ramp_path(blindPayData);
    }
    
    if (result.success) {
      console.log('=== BlindPay Processing Successful ===');
      console.log('Receiver ID:', result.receiver.id);
      if (result.blockchain_wallet) {
        console.log('Blockchain Wallet ID:', result.blockchain_wallet.id);
      }
      
      return {
        success: true,
        receiver_id: result.receiver.id,
        blockchain_wallet_id: result.blockchain_wallet?.id || null,
        message: result.message || 'Successfully processed BlindPay receiver'
      };
    } else {
      console.error('=== BlindPay Processing Failed ===');
      console.error('Error:', result.error);
      console.error('Details:', result.details);
      
      return {
        success: false,
        error: result.error,
        details: result.details
      };
    }
    
  } catch (error) {
    console.error('Error in processSumsubDataForBlindPay:', error);
    
    // Create error log
    const { createErrorLog } = require('../errorLog');
    await createErrorLog({
      user_id: parsedSumsubData.user_id,
      error_message: error.message,
      error_type: 'Sumsub BlindPay Processing Error',
      error_stack_trace: error.stack
    });
    
    return {
      success: false,
      error: error.message,
      details: error.stack
    };
  }
}

module.exports = {
  handleSumsubData,
  processSumsubDataForBlindPay
};

