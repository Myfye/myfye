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

module.exports = { updateUserKycStatus };
