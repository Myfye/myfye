const crypto = require('crypto');
const pool = require('../../db');
const { getApplicantData } = require('./getApplicantData');
const { getDocumentImages } = require('./getDocumentImages');
const { saveTemporaryImage } = require('./tempImageStorage');

// Verify webhook signature from Sumsub
function verifyWebhookSignature(payload, signature, secret) {
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex');
  
  return crypto.timingSafeEqual(
    Buffer.from(signature, 'hex'),
    Buffer.from(expectedSignature, 'hex')
  );
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
    let newStatus = 'PENDING';
    
    // Map Sumsub review result to your status
    switch (reviewResult.reviewAnswer) {
      case 'GREEN':
        newStatus = 'APPROVED';
        break;
      case 'RED':
        newStatus = 'REJECTED';
        break;
      case 'GRAY':
        newStatus = 'PENDING';
        break;
      default:
        newStatus = 'PENDING';
    }
    
    // Update user KYC status in database
    const updateQuery = `
      UPDATE users 
      SET kyc_status = $1, 
          kyc_updated_at = NOW(),
          sumsub_applicant_id = $2
      WHERE uid = $3
    `;
    
    await pool.query(updateQuery, [newStatus, applicantId, userId]);
    
    console.log(`Updated KYC status for user ${userId} to ${newStatus}`);
    
    // If approved, you might want to trigger additional processes
    if (newStatus === 'APPROVED') {
      // Trigger BlindPay integration or other post-approval processes
      await triggerPostApprovalProcesses(userId, applicantData);
    }
    
  } catch (error) {
    console.error('Error processing KYC status update:', error);
    throw error;
  }
}

// Trigger additional processes after KYC approval
async function triggerPostApprovalProcesses(userId, applicantData) {
  try {
    // Get document images for BlindPay integration
    if (applicantData.inspectionId) {
      const documentImages = [];
      
      // Get document images (simplified version)
      try {
        const imageData = await getDocumentImages(applicantData.inspectionId, 'main');
        const tempImageInfo = saveTemporaryImage(
          imageData, 
          'main', 
          'main', 
          'unknown', 
          'unknown'
        );
        
        documentImages.push({
          url: tempImageInfo.url,
          expiresAt: tempImageInfo.expiresAt
        });
        
        // Here you could integrate with BlindPay or other services
        console.log(`Document images ready for user ${userId}:`, documentImages.length);
        
      } catch (imageError) {
        console.error('Error fetching document images for post-approval:', imageError);
      }
    }
    
  } catch (error) {
    console.error('Error in post-approval processes:', error);
  }
}

// Main webhook handler
async function handleSumsubWebhook(req, res) {
  try {
    const payload = JSON.stringify(req.body);
    const signature = req.headers['x-payload-digest']; // Sumsub uses x-payload-digest
    const secret = process.env.SUMSUB_WEBHOOK_KEY;
    
    // Check if secret is configured
    if (!secret) {
      console.error('SUMSUB_WEBHOOK_KEY environment variable is not set');
      return res.status(500).json({ error: 'Webhook configuration error' });
    }
    
    // Verify webhook signature
    if (!verifyWebhookSignature(payload, signature, secret)) {
      console.error('Invalid webhook signature');
      return res.status(401).json({ error: 'Unauthorized' });
    }
    
    const eventData = req.body;
    console.log('Received Sumsub webhook:', eventData.type);
    
    // Handle different webhook event types
    switch (eventData.type) {
      case 'applicantReviewed':
        await processKYCStatusUpdate(eventData.applicantId, eventData.reviewResult, eventData.externalUserId);
        break;
        
      case 'applicantPending':
        // Handle pending status
        await processKYCStatusUpdate(eventData.applicantId, { reviewAnswer: 'GRAY' }, eventData.externalUserId);
        break;
        
      case 'applicantOnHold':
        // Handle on-hold status
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
