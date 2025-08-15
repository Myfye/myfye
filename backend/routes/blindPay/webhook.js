const { updateUserKycStatus, updateUserKycStatusByBlindPayId } = require('../kyc/kycStatus');

// Helper function to handle KYC status updates from BlindPay
async function handleBlindPayKycStatusUpdate(data, eventType) {
  if (data && data.kyc_status) {
    let newKycStatus;
    
    switch (data.kyc_status) {
      case 'approved':
        newKycStatus = 'APPROVED';
        console.log('Send approval email to user');
        // To do: send approval email
        break;
      case 'rejected':
        newKycStatus = 'REJECTED';
        break;
      case 'verifying':
        newKycStatus = 'PENDING';
        break;
      case 'deprecated':
        newKycStatus = 'REJECTED';
        console.log('Send rejection email to user');
        // To do: send rejection email
        break;
      default:
        console.log(`Unknown BlindPay KYC status: ${data.kyc_status}`);
        break;
    }
    
    if (newKycStatus != "PENDING") { // Should already be pending at this point, we do not want to switch APPROVED back to PENDING
      // Try to find user by BlindPay receiver ID first
      if (data.id) {
        try {
          const success = await updateUserKycStatusByBlindPayId(data.id, newKycStatus);
          if (success) {
            console.log(`Successfully updated user with BlindPay receiver ID ${data.id} KYC status to ${newKycStatus} based on BlindPay ${eventType} webhook`);
            return;
          }
        } catch (error) {
          console.error(`Failed to update user KYC status by BlindPay ID ${data.id}:`, error);
        }
      }
      
      // Fallback to external_id if BlindPay ID method failed
      const userId = data.external_id;
      if (userId) {
        try {
          await updateUserKycStatus(userId, newKycStatus);
          console.log(`Successfully updated user ${userId} KYC status to ${newKycStatus} based on BlindPay ${eventType} webhook`);
        } catch (error) {
          console.error(`Failed to update user ${userId} KYC status:`, error);
        }
      } else {
        console.warn(`No BlindPay receiver ID (id) or external_id found in BlindPay ${eventType} webhook data`);
      }
    }
  }
}

const handleBlindPayWebhook = async (req, res) => {
    
  try {
    console.log("\n=== BlindPay Webhook Received ===");
    //console.log("Headers:", JSON.stringify(req.headers, null, 2));
    console.log("Body:", JSON.stringify(req.body, null, 2));

    const { type } = req.body;

    console.log(`Processing BlindPay webhook event: ${type}`);

    // Check if kyc_status exists in the body and handle it regardless of event type
    if (req.body.kyc_status) {
      console.log("=== KYC Status Update Detected ===");
      await handleBlindPayKycStatusUpdate(req.body, type || 'unknown');
    } else {
      console.log("No KYC status found in webhook body");
    }

    // Log event type for debugging but don't filter by it
    if (type) {
      console.log(`Event type: ${type}`);
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
