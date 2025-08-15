const pool = require('../../db');

/**
 * Update the KYC status for a user in the database
 * @param {string} userId - The user ID to update
 * @param {string} newStatus - The new KYC status (PENDING, APPROVED, REJECTED, etc.)
 */
async function updateUserKycStatus(userId, newStatus) {
  try {
    const updateQuery = `
      UPDATE users 
      SET kyc_status = $1 
      WHERE uid = $2
    `;
    await pool.query(updateQuery, [newStatus, userId]);
    console.log(`Updated user ${userId} KYC status to ${newStatus}`);
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
    const updateQuery = `
      UPDATE users 
      SET kyc_status = $1 
      WHERE blind_pay_receiver_id = $2
    `;
    const result = await pool.query(updateQuery, [newStatus, blindPayReceiverId]);
    
    if (result.rowCount === 0) {
      console.warn(`No user found with BlindPay receiver ID: ${blindPayReceiverId}`);
      return false;
    }
    
    console.log(`Updated user with BlindPay receiver ID ${blindPayReceiverId} KYC status to ${newStatus}`);
    return true;
  } catch (error) {
    console.error(`Error updating user KYC status by BlindPay ID to ${newStatus}:`, error);
    throw error;
  }
}

module.exports = { updateUserKycStatus, updateUserKycStatusByBlindPayId };
