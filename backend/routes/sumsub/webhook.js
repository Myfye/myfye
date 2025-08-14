const crypto = require('crypto');
const { getApplicantData } = require('./getApplicantData');
const { getDocumentImages } = require('./getDocumentImages');
const { saveTemporaryImage } = require('./tempImageStorage');
const pool = require('../../db');
const { getSumsubUser } = require('./getSumsubUser');

// Verify webhook signature from Sumsub
function verifyWebhookSignature(payload, signature, secret) {
  /*
  console.log('Verifying webhook signature:');
  console.log('Payload:', payload);
  console.log('Received signature:', signature);
  console.log('Secret length:', secret ? secret.length : 0);
  */
  
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex');
  
  console.log('Expected signature:', expectedSignature);
  console.log('Signatures match:', signature === expectedSignature);
  
  return signature === expectedSignature;
}

// Process KYC status update
async function processKYCStatusUpdate(applicantId, reviewResult, externalUserId = null) {
  try {
    let userId = externalUserId;
    
    // If externalUserId is not provided, try to get it from applicant data
    if (!userId) {
      const applicantData = await getApplicantData({ applicantId });
      if (!applicantData || !applicantData.externalUserId) {
        console.error('No external user ID found for applicant:', applicantId);
        return;
      }
      userId = applicantData.externalUserId;
    }
    
    console.log('Review result: ', reviewResult);

    // If approved, you might want to trigger additional processes
    if (reviewResult === 'GREEN') {
      // Trigger BlindPay integration or other post-approval processes
      await triggerSumsubApprovalProcesses(userId);
      updateUserKycStatus(userId, 'PENDING'); // still pending because we need to wait for the blindpay to be accepted
    } else if (reviewResult === 'RED') {
      // save the user KYC status to REJECTED
      updateUserKycStatus(userId, 'REJECTED');
    } else {
      // save user KYC status to PENDING
      updateUserKycStatus(userId, 'PENDING');
    }
    
  } catch (error) {
    console.error('Error processing KYC status update:', error);
    throw error;
  }
}

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

// Trigger additional processes after KYC approval
async function triggerSumsubApprovalProcesses(userId) {
  try {
      
    console.log('Applicant userID: ', userId);
    console.log('Ready to submit to BlindPay');

    const sumsubUserData = await getSumsubUser(userId);

    // parse the data from sumsubUserData and feed to blind pay

    console.log('Sumsub user data:', sumsubUserData);

  } catch (error) {
    console.error('Error in post-approval processes:', error);
  }
}

// Main webhook handler
async function handleSumsubWebhook(req, res) {
  try {
    /*
    console.log('=== Webhook Signature Verification Debug ===');
    console.log('All headers:', JSON.stringify(req.headers, null, 2));
    */
    
    // Get the raw body - this is what Sumsub signs
    const rawBody = req.rawBody ? req.rawBody.toString() : JSON.stringify(req.body);
    const signature = req.headers['x-payload-digest']; // Sumsub uses x-payload-digest
    const signatureAlg = req.headers['x-payload-digest-alg']; // Check the algorithm
    const secret = process.env.SUMSUB_WEBHOOK_KEY;
    
    // Check if secret is configured
    if (!secret) {
      console.error('SUMSUB_WEBHOOK_KEY environment variable is not set');
      return res.status(500).json({ error: 'Webhook configuration error' });
    }
    
    // Check if signature is present
    if (!signature) {
      console.error('No signature found in headers');
      return res.status(401).json({ error: 'No signature provided' });
    }
    
    // Verify webhook signature
    if (!verifyWebhookSignature(rawBody, signature, secret)) {
      console.error('Invalid webhook signature');
      return res.status(401).json({ error: 'Unauthorized' });
    }
    
    const eventData = req.body;
    console.log('Received Sumsub webhook:', eventData.type);
    
    // Handle different webhook event types
    switch (eventData.type) {
      case 'applicantReviewed':
        console.log('Webhook type applicantReviewed');
        await processKYCStatusUpdate(eventData.applicantId, eventData.reviewResult.reviewAnswer, eventData.externalUserId);
        break;
        
      case 'applicantPending':
        // Handle pending status
        console.log('Webhook type applicantPending');
        await processKYCStatusUpdate(eventData.applicantId, { reviewAnswer: 'GRAY' }, eventData.externalUserId);
        break;
        
      case 'applicantOnHold':
        // Handle on-hold status
        console.log('Webhook type applicantOnHold');
        await processKYCStatusUpdate(eventData.applicantId, { reviewAnswer: 'GRAY' }, eventData.externalUserId);
        break;
        
      default:
        console.log('Unhandled webhook event type:', eventData.type);
    }
    
    // Always respond with 200 OK
    res.status(200).json({ status: 'success' });
    
  } catch (error) {
    console.error('Error handling Sumsub webhook:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

module.exports = { handleSumsubWebhook };
