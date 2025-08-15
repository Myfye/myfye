const { updateUserKycStatus } = require('../kyc/kycStatus');

// Helper function to handle KYC status updates from BlindPay
async function handleBlindPayKycStatusUpdate(data, eventType) {
  if (data && data.kyc_status) {
    const userId = data.external_id; // BlindPay uses external_id to store our user ID
    
    if (userId) {
      let newKycStatus;
      
      switch (data.kyc_status) {
        case 'approved':
          newKycStatus = 'APPROVED';
          break;
        case 'rejected':
          newKycStatus = 'REJECTED';
          break;
        case 'verifying':
          newKycStatus = 'PENDING';
          break;
        case 'deprecated':
          newKycStatus = 'REJECTED';
          break;
        default:
          console.log(`Unknown BlindPay KYC status: ${data.kyc_status}`);
          break;
      }
      
      if (newKycStatus) {
        try {
          await updateUserKycStatus(userId, newKycStatus);
          console.log(`Successfully updated user ${userId} KYC status to ${newKycStatus} based on BlindPay ${eventType} webhook`);
        } catch (error) {
          console.error(`Failed to update user ${userId} KYC status:`, error);
        }
      }
    } else {
      console.warn(`No external_id found in BlindPay ${eventType} webhook data`);
    }
  }
}

const handleBlindPayWebhook = async (req, res) => {
    
  try {
    console.log("\n=== BlindPay Webhook Received ===");
    console.log("Headers:", JSON.stringify(req.headers, null, 2));
    console.log("Body:", JSON.stringify(req.body, null, 2));

    const { type, data } = req.body;

    if (!type) {
      console.error("No event type provided in webhook payload");
      return res.status(400).json({ error: "No event type provided" });
    }

    console.log(`Processing BlindPay webhook event: ${type}`);

    switch (type) {
      case 'receiver.new':
        console.log("=== Receiver New Event ===");
        // console.log("Receiver data:", JSON.stringify(data, null, 2));
        break;

      case 'receiver.update':
        console.log("=== Receiver Update Event ===");
        console.log("Receiver data:", JSON.stringify(data, null, 2));
        await handleBlindPayKycStatusUpdate(data, 'receiver.update');
        break;

      default:
        console.log(`Unhandled BlindPay webhook event type: ${type}`);
        console.log("Event data:", JSON.stringify(data, null, 2));

            
    }

    // Always return 200 to acknowledge receipt
    res.status(200).json({ 
      success: true, 
      message: `Webhook ${type} processed successfully` 
    });

  } catch (error) {
    console.error("Error handling BlindPay webhook:", error);
    console.error("Error stack:", error.stack);
    
    // Still return 200 to prevent webhook retries
    res.status(200).json({ 
      success: false, 
      error: error.message || "Failed to process webhook",
      details: error.toString()
    });
  }
};

module.exports = { handleBlindPayWebhook };
