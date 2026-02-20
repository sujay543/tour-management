const nodemailer = require('nodemailer');

const sendMail = async (options) => {

    console.log(process.env.EMAIL_HOST);
console.log(process.env.EMAIL_PORT);
console.log(process.env.EMAIL_USERNAME);
console.log(process.env.EMAIL_PASSWORD);
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: Number(process.env.EMAIL_PORT), // ✅ FIXED
        auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD
        }
    });

    const mailOptions = {
        from: 'Sujay sen <hello@gmail.io>',
        to: options.email,
        subject: options.subject,
        text: options.text
    };

    await transporter.sendMail(mailOptions);
};

module.exports = sendMail;