// Webhook handler for customer updates from Etherfuse
const handleCustomerUpdatedWebhook = async (data) => {
  try {
    console.log('Etherfuse Customer Updated Webhook received:', JSON.stringify(data, null, 2));
    
    const { 
      customerId, 
      status, 
      updatedAt, 
      customerData 
    } = data;

    // Log the webhook payload
    console.log('Customer Update Details:', {
      customerId,
      status,
      updatedAt,
      customerData
    });

    // Add business logic here for handling customer updates
    
    return {
      success: true,
      message: 'Customer update webhook received successfully'
    };

  } catch (error) {
    console.error('Error processing customer_updated webhook:', error);
    
    return {
      success: false,
      error: 'Internal server error processing webhook'
    };
  }
};

module.exports = {
  handleCustomerUpdatedWebhook
};
