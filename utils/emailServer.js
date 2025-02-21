const nodemailer = require("nodemailer");

// Create a transporter
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // Change to your email provider if needed
    auth: {
        user: process.env.EMAIL_USER, // Your email address
        pass: process.env.EMAIL_PASS  // Your email password or app password
    }
});

// Function to send email
const sendEmail = async ({to, subject, text}) => {
    try {
        const mailOptions = {
            from: process.env.EMAIL_USER, // Your email address
            to,
            subject,
            text
        };

        const info = await transporter.sendMail(mailOptions);
        console.log("Message sent: %s", info.response);
        console.log(`Email sent to ${to}`);
    } catch (error) {
        console.error("Error sending email:", error);
    }
};

module.exports = sendEmail;


