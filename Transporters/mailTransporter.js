const nodemailer = require('nodemailer');

// Create a transporter object using SMTP transport
const transporter = nodemailer.createTransport({
    service: `${process.env.EPROVIDER}`,
    auth: {
      user:`${process.env.EMAIL}`,
      pass: `${process.env.EPASSWORD}`,
    },
  });
  

module.exports = transporter;
