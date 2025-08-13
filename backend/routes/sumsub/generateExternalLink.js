const axios = require('axios');
const crypto = require('crypto');

const generateExternalLink = async (data) => {
  // Validate that userId is provided
  if (!data || !data.userId) {
    throw new Error('userId is required to generate external link');
  }

  const APP_TOKEN = process.env.SUMSUB_TOKEN;
  const APP_SECRET = process.env.SUMSUB_KEY;

  
  if (!APP_TOKEN || !APP_SECRET) {
    throw new Error('Sumsub credentials not configured. Please set SUMSUB_TOKEN and SUMSUB_KEY environment variables.');
  }

  const url = 'https://api.sumsub.com/resources/sdkIntegrations/levels/-/websdkLink';
  
  // Prepare request body
  const requestBody = {
    ttlInSecs: 1800,
    levelName: 'levelVersion1',
    userId: data.userId
  };

  // Generate timestamp for signature
  const ts = Math.floor(Date.now() / 1000);
  
  // Create signature string: timestamp + HTTP method + URL path + request body
  const signatureString = ts + 'POST' + '/resources/sdkIntegrations/levels/-/websdkLink' + JSON.stringify(requestBody);
  
  // Generate HMAC-SHA256 signature using the secret key
  const signature = crypto
    .createHmac('sha256', APP_SECRET)
    .update(signatureString)
    .digest('hex');

  const options = {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json', 
      'X-App-Token': APP_TOKEN,
      'X-App-Access-Sig': signature,
      'X-App-Access-Ts': ts.toString()
    },
    data: requestBody
  };

  try {
    const response = await axios(url, options);
    return response.data;
  } catch (error) {
    console.error('Error generating Sumsub external link:', error);
    if (error.response) {
      throw new Error(`Sumsub API error: ${error.response.status} ${error.response.statusText} - ${JSON.stringify(error.response.data)}`);
    }
    throw error;
  }
};

module.exports = { generateExternalLink };