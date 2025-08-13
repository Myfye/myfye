const axios = require('axios');
const crypto = require('crypto');

const getApplicantMetadata = async (applicantId) => {
  const APP_TOKEN = process.env.SUMSUB_TOKEN;
  const APP_SECRET = process.env.SUMSUB_KEY;

  if (!APP_TOKEN || !APP_SECRET) {
    throw new Error('Sumsub credentials not configured. Please set SUMSUB_TOKEN and SUMSUB_KEY environment variables.');
  }

  if (!applicantId) {
    throw new Error('applicantId is required');
  }

  const url = `https://api.sumsub.com/resources/applicants/${applicantId}/metadata/resources`;

  // Generate timestamp for signature
  const ts = Math.floor(Date.now() / 1000);
  
  // Create signature string: timestamp + HTTP method + URL path (no body for GET requests)
  const signatureString = ts + 'GET' + `/resources/applicants/${applicantId}/metadata/resources`;
  
  // Generate HMAC-SHA256 signature using the secret key
  const signature = crypto
    .createHmac('sha256', APP_SECRET)
    .update(signatureString)
    .digest('hex');

  const options = {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'X-App-Token': APP_TOKEN,
      'X-App-Access-Sig': signature,
      'X-App-Access-Ts': ts.toString()
    }
  };

  try {
    const response = await axios(url, options);
    return response.data;
  } catch (error) {
    console.error('Error getting Sumsub applicant metadata:', error);
    if (error.response) {
      throw new Error(`Sumsub API error: ${error.response.status} ${error.response.statusText} - ${JSON.stringify(error.response.data)}`);
    }
    throw error;
  }
};

module.exports = { getApplicantMetadata };
