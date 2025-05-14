const sgMail = require('@sendgrid/mail');

// Initialize SendGrid with API key
sgMail.setApiKey(process.env.SENDGRID_KEY);

async function emailService(data) {
    try {
        const {
            emailAddress,
            templateId,
            amount,
            firstName,
            supportRequestID,
            userID,
            lastName,
            email,
            supportMessage,
            publicKey,
            timestamp
        } = req.body;

        const msg = {
            to: emailAddress,
            from: {
                email: "gavin@myfye.com",
                name: "Myfye",
            },
            templateId: templateId,
            dynamic_template_data: {
                firstName,
                amount,
                supportRequestID,
                userID,
                lastName,
                email,
                supportMessage,
                timestamp,
                publicKey
            },
        };

        await sgMail.send(msg);
        console.log("Email sent");
        res.status(200).json({ message: "Email sent successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to send email" });
    }
}

module.exports = {
    emailService
};
