// Webhook handler for bank account updates from Etherfuse
const handleBankAccountUpdatedWebhook = async (data) => {
  try {
    console.log('Etherfuse Bank Account Updated Webhook received:', JSON.stringify(data, null, 2));
    
    const { 
      bankAccountId, 
      customerId,
      status, 
      accountType,
      updatedAt, 
      bankAccountData 
    } = data;

    // Log the webhook payload
    console.log('Bank Account Update Details:', {
      bankAccountId,
      customerId,
      status,
      accountType,
      updatedAt,
      bankAccountData
    });

    // Add business logic here for handling bank account updates
    
    return {
      success: true,
      message: 'Bank account update webhook received successfully'
    };

  } catch (error) {
    console.error('Error processing bank_account_updated webhook:', error);
    
    return {
      success: false,
      error: 'Internal server error processing webhook'
    };
  }
};

module.exports = {
  handleBankAccountUpdatedWebhook
};
