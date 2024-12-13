const nodemailer = require('nodemailer');

const sendEmail = async (option) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        },
      });

      const mailOptions = {
        from: 'aastharatthi1929@gmail.com',
        to: option.email,
        subject: option.subject,
        text: option.message
    };

    await transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            console.log(error);
            return res.status(500).json({ message: "Error sending email" });
        } else {
            console.log('Email sent: ' + info.response);
            res.json({ message: "Password reset link has been sent to your email." });
        }
    });


}

module.exports = sendEmail;