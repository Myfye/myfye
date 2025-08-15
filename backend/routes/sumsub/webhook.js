const crypto = require('crypto');
const { getApplicantData } = require('./getApplicantData');
const { getDocumentImages } = require('./getDocumentImages');
const { saveTemporaryImage } = require('./tempImageStorage');
const pool = require('../../db');
const { getSumsubUser } = require('./getSumsubUser');
const { processSumsubDataForBlindPay } = require('../kyc/sumsubBlindPay');
const { convertSumsubToBlindpayCountryCode } = require('../kyc/countryCode');

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
    const parsedData = await parseSumsubUserData(sumsubUserData);

    console.log('Sumsub user data:', sumsubUserData);
    console.log('Parsed data for BlindPay:', parsedData);

    // Call the new function to process Sumsub data for BlindPay
    
    const blindPayResult = await processSumsubDataForBlindPay(parsedData);

    if (blindPayResult.success) {
      console.log('BlindPay processing completed successfully:', blindPayResult.message);
    } else {
      console.error('BlindPay processing failed:', blindPayResult.error);
    }

  } catch (error) {
    console.error('Error in post-approval processes:', error);
  }
}

async function parseSumsubUserData(sumsubUserData) {
  try {
    if (!sumsubUserData || !sumsubUserData.applicantData) {
      throw new Error('Invalid Sumsub user data structure');
    }

    const applicantData = sumsubUserData.applicantData;
    const fixedInfo = applicantData.fixedInfo || {};
    const addresses = fixedInfo.addresses || [];
    const primaryAddress = addresses[0] || {};
    const idDocs = applicantData.info?.idDocs || [];
    const primaryIdDoc = idDocs[0] || {};
    const documentImages = sumsubUserData.documentImages || [];

    // Extract personal information
    const personalInfo = {
      first_name: fixedInfo.firstName || applicantData.info?.firstName,
      last_name: fixedInfo.lastName || applicantData.info?.lastName,
      date_of_birth: fixedInfo.dob || applicantData.info?.dob,
      email: applicantData.email || null, // Note: email might not be in the example data
      tax_id: fixedInfo.tin || null,
      country: convertSumsubToBlindpayCountryCode(fixedInfo.country || applicantData.info?.country || primaryIdDoc.country),
    };

    // Extract address information
    const addressInfo = {
      address_line_1: primaryAddress.street,
      city: primaryAddress.town,
      state_province_region: primaryAddress.state,
      country: convertSumsubToBlindpayCountryCode(primaryAddress.country) || personalInfo.country,
      postal_code: primaryAddress.postCode,
    };

    // Extract ID document information
    const idDocInfo = {
      id_doc_country: convertSumsubToBlindpayCountryCode(primaryIdDoc.country),
      id_doc_type: primaryIdDoc.idDocType,
      id_doc_number: primaryIdDoc.number,
      id_doc_valid_until: primaryIdDoc.validUntil,
    };

    // Extract document images
    const documentImageUrls = documentImages.map(img => ({
      imageId: img.imageId,
      position: img.position,
      docType: img.docType,
      url: img.url,
      expiresAt: img.expiresAt
    }));

    // Find front and back document images
    const frontImage = documentImages.find(img => img.position === 'front' || img.position === 'unknown');
    const backImage = documentImages.find(img => img.position === 'back');

    const parsedData = {
      user_id: sumsubUserData.userId,
      applicant_id: applicantData.id,
      personal_info: personalInfo,
      address_info: addressInfo,
      id_doc_info: idDocInfo,
      document_images: documentImageUrls,
      id_doc_front_file: frontImage?.url || null,
      id_doc_back_file: backImage?.url || null,
    };

    // Log the extracted information
    console.log('=== Parsed Sumsub Data for BlindPay ===');
    console.log('User ID:', parsedData.user_id);
    console.log('Applicant ID:', parsedData.applicant_id);
    console.log('First Name:', parsedData.personal_info.first_name);
    console.log('Last Name:', parsedData.personal_info.last_name);
    console.log('Date of Birth:', parsedData.personal_info.date_of_birth);
    console.log('Country:', parsedData.personal_info.country);
    console.log('Tax ID:', parsedData.personal_info.tax_id);
    console.log('Email:', parsedData.personal_info.email);
    console.log('Address Line 1:', parsedData.address_info.address_line_1);
    console.log('City:', parsedData.address_info.city);
    console.log('State:', parsedData.address_info.state_province_region);
    console.log('Postal Code:', parsedData.address_info.postal_code);
    console.log('ID Doc Country:', parsedData.id_doc_info.id_doc_country);
    console.log('ID Doc Type:', parsedData.id_doc_info.id_doc_type);
    console.log('ID Doc Number:', parsedData.id_doc_info.id_doc_number);
    console.log('ID Doc Valid Until:', parsedData.id_doc_info.id_doc_valid_until);
    console.log('Front Image URL:', parsedData.id_doc_front_file);
    console.log('Back Image URL:', parsedData.id_doc_back_file);
    console.log('Total Document Images:', parsedData.document_images.length);
    console.log('==========================================');

    return parsedData;
    
  } catch (error) {
    console.error('Error parsing Sumsub user data:', error);
    throw error;
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
