const axios = require('axios');
const crypto = require('crypto');

const getAccessToken = async (data) => {
  const APP_TOKEN = process.env.SUMSUB_TOKEN;
  const APP_SECRET = process.env.SUMSUB_KEY;

  console.log("APP_TOKEN:", APP_TOKEN);
  console.log("APP_TOKEN starts with 'sbx:':", APP_TOKEN ? APP_TOKEN.startsWith('sbx:') : false);
  console.log("APP_SECRET length:", APP_SECRET ? APP_SECRET.length : 0);
  console.log("APP_SECRET first 10 chars:", APP_SECRET ? APP_SECRET.substring(0, 10) + '...' : 'not set');
  
  if (!APP_TOKEN || !APP_SECRET) {
    throw new Error('Sumsub credentials not configured. Please set SUMSUB_TOKEN and SUMSUB_KEY environment variables.');
  }

  const { userId } = data;
  if (!userId) {
    throw new Error('userId is required in the data object');
  }

  const url = 'https://api.sumsub.com/resources/accessTokens/sdk';
  
  // Prepare request body - exactly as shown in the documentation
  const requestBody = {
    ttlInSecs: 600,
    userId: userId,
    levelName: 'levelVersion1'
  };

  // Generate timestamp for signature
  const ts = Math.floor(Date.now() / 1000);
  
  // Create signature string: timestamp + HTTP method + URL path + request body
  const signatureString = ts + 'POST' + '/resources/accessTokens/sdk' + JSON.stringify(requestBody);
  
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
    console.error('Error getting Sumsub access token:', error);
    if (error.response) {
      throw new Error(`Sumsub API error: ${error.response.status} ${error.response.statusText} - ${JSON.stringify(error.response.data)}`);
    }
    throw error;
  }
};

module.exports = { getAccessToken };