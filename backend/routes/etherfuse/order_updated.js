// Webhook handler for order updates from Etherfuse
const handleOrderUpdatedWebhook = async (data) => {
  try {
    console.log('Etherfuse Order Updated Webhook received:', JSON.stringify(data, null, 2));
    
    const { 
      orderId, 
      customerId,
      status, 
      amount,
      currency,
      updatedAt, 
      orderData 
    } = data;

    // Log the webhook payload
    console.log('Order Update Details:', {
      orderId,
      customerId,
      status,
      amount,
      currency,
      updatedAt,
      orderData
    });

    // Add business logic here for handling order updates
    
    return {
      success: true,
      message: 'Order update webhook received successfully'
    };

  } catch (error) {
    console.error('Error processing order_updated webhook:', error);
    
    return {
      success: false,
      error: 'Internal server error processing webhook'
    };
  }
};

module.exports = {
  handleOrderUpdatedWebhook
};
