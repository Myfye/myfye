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
        console.log("Receiver data:", JSON.stringify(data, null, 2));
        // TODO: Add your business logic here for new receiver
        break;

      case 'receiver.update':
        console.log("=== Receiver Update Event ===");
        console.log("Receiver data:", JSON.stringify(data, null, 2));
        // TODO: Add your business logic here for receiver update
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
