const { get_receiver } = require('../blindPay/receiver');
const pool = require('../../db');

// Reusable function for updating user KYC status in database
async function updateUserKycStatus(userId, newStatus) {
  try {
    const updateQuery = `
      UPDATE users 
      SET kyc_status = $1 
      WHERE uid = $2
    `;
    await pool.query(updateQuery, [newStatus, userId]);
    console.log(`Updated user KYC status to ${newStatus}`);
  } catch (error) {
    console.error(`Error updating user KYC status to ${newStatus}:`, error);
    throw error;
  }
}

// TO DO:

async function kyc_status(userId) {
  try {
    // Step 1: get the kyc status and the blind_pay_receiver_id from the user table in the database
    const userQuery = `
      SELECT kyc_status, blind_pay_receiver_id 
      FROM users 
      WHERE uid = $1
    `;
    
    const userResult = await pool.query(userQuery, [userId]);
    
    if (userResult.rows.length === 0) {
      throw new Error('User not found');
    }
    
    const user = userResult.rows[0];
    const { kyc_status, blind_pay_receiver_id } = user;
    
    console.log('User KYC status:', kyc_status);
    console.log('Blind Pay Receiver ID:', blind_pay_receiver_id);

    // to do call sumsub_kyc_status here
    const sumsubResult = await getSumsubKYCStatus(userId);

    if (sumsubResult === null) {
        return 'NOT STARTED';
    }

    
    if (kyc_status === 'APPROVED') {
        return 'APPROVED';
    }

    if (kyc_status === 'REJECTED') {
        await retry_submit_to_privy(userId);
        return 'REJECTED';
    }

    // call get_receiver to get the blind pay data
    if (blind_pay_receiver_id) {
            
        const blindPayData = await get_receiver(blind_pay_receiver_id);
        console.log('Blind Pay KYC status:', blindPayData.kyc_status);

        // If blindpay KYC status is accepted then change the KYC status to APPROVED and then return APPROVED
        if (blindPayData.kyc_status === 'accepted') {
            if (kyc_status !== 'APPROVED') {
                const updateQuery = `
                UPDATE users 
                SET kyc_status = 'APPROVED' 
                WHERE uid = $1
                `;
                await pool.query(updateQuery, [userId]);
                console.log('Updated user KYC status to APPROVED');
            }
        return 'APPROVED';
        }

        // If blindpay KYC status is verifying and the database user's KYC status is not PENDING then change it to PENDING and return PENDING
        if (blindPayData.kyc_status === 'verifying') {
            if (kyc_status !== 'PENDING') {
                const updateQuery = `
                UPDATE users 
                SET kyc_status = 'PENDING' 
                WHERE uid = $1
                `;
                await pool.query(updateQuery, [userId]);
                console.log('Updated user KYC status to PENDING');
            }
        return 'PENDING';
        }

        // If blindpay KYC status is rejected and the database user's KYC status is not REJECTED then change it to REJECTED and return REJECTED
        if (blindPayData.kyc_status === 'rejected') {
            if (kyc_status !== 'REJECTED') {
                const updateQuery = `
                UPDATE users 
                SET kyc_status = 'REJECTED' 
                WHERE uid = $1
                `;
                await pool.query(updateQuery, [userId]);
                console.log('Updated user KYC status to REJECTED');
            }
        return 'REJECTED';
        }
    }


    // Stepget the kyc status from sumsub_kyc_status

    // if sumsub_kyc_status contains "GREEN" then get getApplicantData and get and host the document images

    // take the urls and parse the applicant data to feed to blindpay 

    // perform operations on that 

    


    // If blind pay status is something else, return current status
    console.log('Unknown blind pay KYC status:', blindPayData.kyc_status);
    return kyc_status || 'PENDING';
    
  } catch (error) {
    console.error('Error in kyc_status:', error);
    throw error;
  }
}



module.exports = { kyc_status };

