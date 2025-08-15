const pool = require('../../db');

/**
 * Update the KYC status for a user in the database
 * @param {string} userId - The user ID to update
 * @param {string} newStatus - The new KYC status (PENDING, APPROVED, REJECTED, etc.)
 */
async function updateUserKycStatus(userId, newStatus) {
  try {
    // Check current KYC status to prevent downgrading from APPROVED to PENDING
    const currentStatusQuery = `
      SELECT kyc_status 
      FROM users 
      WHERE uid = $1
    `;
    const currentResult = await pool.query(currentStatusQuery, [userId]);
    
    if (currentResult.rows.length === 0) {
      console.warn(`No user found with ID: ${userId}`);
      return false;
    }
    
    const currentStatus = currentResult.rows[0].kyc_status;
    
    // Prevent downgrading from APPROVED to PENDING
    if (currentStatus === 'APPROVED' && newStatus === 'PENDING') {
      console.log(`Skipping KYC status update for user ${userId}: Cannot downgrade from APPROVED to PENDING (current: ${currentStatus}, requested: ${newStatus})`);
      return false;
    }
    
    const updateQuery = `
      UPDATE users 
      SET kyc_status = $1 
      WHERE uid = $2
    `;
    await pool.query(updateQuery, [newStatus, userId]);
    console.log(`Updated user ${userId} KYC status from ${currentStatus} to ${newStatus}`);
    return true;
  } catch (error) {
    console.error(`Error updating user KYC status to ${newStatus}:`, error);
    throw error;
  }
}

/**
 * Update the KYC status for a user in the database using BlindPay receiver ID
 * @param {string} blindPayReceiverId - The BlindPay receiver ID to find the user
 * @param {string} newStatus - The new KYC status (PENDING, APPROVED, REJECTED, etc.)
 */
async function updateUserKycStatusByBlindPayId(blindPayReceiverId, newStatus) {
  try {
    // Check current KYC status to prevent downgrading from APPROVED to PENDING
    const currentStatusQuery = `
      SELECT kyc_status 
      FROM users 
      WHERE blind_pay_receiver_id = $1
    `;
    const currentResult = await pool.query(currentStatusQuery, [blindPayReceiverId]);
    
    if (currentResult.rows.length === 0) {
      console.warn(`No user found with BlindPay receiver ID: ${blindPayReceiverId}`);
      return false;
    }
    
    const currentStatus = currentResult.rows[0].kyc_status;
    
    // Prevent downgrading from APPROVED to PENDING
    if (currentStatus === 'APPROVED' && newStatus === 'PENDING') {
      console.log(`Skipping KYC status update for BlindPay receiver ID ${blindPayReceiverId}: Cannot downgrade from APPROVED to PENDING (current: ${currentStatus}, requested: ${newStatus})`);
      return false;
    }
    
    const updateQuery = `
      UPDATE users 
      SET kyc_status = $1 
      WHERE blind_pay_receiver_id = $2
    `;
    const result = await pool.query(updateQuery, [newStatus, blindPayReceiverId]);
    
    console.log(`Updated user with BlindPay receiver ID ${blindPayReceiverId} KYC status from ${currentStatus} to ${newStatus}`);
    return true;
  } catch (error) {
    console.error(`Error updating user KYC status by BlindPay ID to ${newStatus}:`, error);
    throw error;
  }
}

module.exports = { updateUserKycStatus, updateUserKycStatusByBlindPayId };
