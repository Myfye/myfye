const axios = require('axios');
const crypto = require('crypto');

const getDocumentImages = async (inspectionId, imageId) => {
  const APP_TOKEN = process.env.SUMSUB_TOKEN;
  const APP_SECRET = process.env.SUMSUB_KEY;

  if (!APP_TOKEN || !APP_SECRET) {
    throw new Error('Sumsub credentials not configured. Please set SUMSUB_TOKEN and SUMSUB_KEY environment variables.');
  }

  if (!inspectionId || !imageId) {
    throw new Error('Both inspectionId and imageId are required parameters');
  }

  const url = `https://api.sumsub.com/resources/inspections/${inspectionId}/resources/${imageId}`;

  // Generate timestamp for signature
  const ts = Math.floor(Date.now() / 1000);
  
  // Create signature string: timestamp + HTTP method + URL path (no body for GET requests)
  const signatureString = ts + 'GET' + `/resources/inspections/${inspectionId}/resources/${imageId}`;
  
  // Generate HMAC-SHA256 signature using the secret key
  const signature = crypto
    .createHmac('sha256', APP_SECRET)
    .update(signatureString)
    .digest('hex');

  const options = {
    method: 'GET',
    headers: {
      'Accept': 'image/*',
      'X-App-Token': APP_TOKEN,
      'X-App-Access-Sig': signature,
      'X-App-Access-Ts': ts.toString()
    },
    responseType: 'arraybuffer'
  };

  try {
    const response = await axios(url, options);
    return Buffer.from(response.data);
  } catch (error) {
    console.error('Error getting Sumsub document images:', error);
    if (error.response) {
      throw new Error(`Sumsub API error: ${error.response.status} ${error.response.statusText}`);
    }
    throw error;
  }
};

module.exports = { getDocumentImages };