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
        const templateId = data.templateId;
        const instructionFirstLine = data.instructionFirstLine;
        const instructionSecondLine = data.instructionSecondLine;
        const instructionThirdLine = data.instructionThirdLine;
        const instructionFourthLine = data.instructionFourthLine;
        const emailAddress = data.emailAddress;
        const subject = data.subject;

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
                publicKey,
                instructionFirstLine,
                instructionSecondLine,
                instructionThirdLine,
                instructionFourthLine,
                subject
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
