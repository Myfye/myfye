const sgMail = require('@sendgrid/mail');

// Initialize SendGrid with API key
sgMail.setApiKey(process.env.SENDGRID_KEY);

async function emailService(data) {
    try {

        const firstName = data.firstName;
        const amount = data.amount;
        const supportRequestID = data.supportRequestID;
        const userID = data.userID;
        const lastName = data.lastName;
        const email = data.email;
        const supportMessage = data.supportMessage;
        const timestamp = data.timestamp;
        const publicKey = data.publicKey;

        const msg = {
            to: data.emailAddress,
            from: {
                email: "gavin@myfye.com",
                name: "Myfye",
            },
            templateId: data.templateId,
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
        return { message: "Email sent successfully" };
    } catch (error) {
        console.error(error);
        return { error: "Failed to send email" };
    }
}

module.exports = {
    emailService
};
