const express = require('express');
const LoginRouter = express.Router();
const AdminModal=require('../Models/Admin.model')
const ManagerModel=require('../Models/Manager.model')
const EmployeeModal=require('../Models/Employee.model')
const Transporter=require('../Transporters/mailTransporter')
const {generateRandomString} =require('../generateRandom')
// LOGIN ACCORDING TO ROLES
LoginRouter.post('/login',async function(req,res)
{
    const{Email,password}=req.body;
    
  try {
    const userExistingData = await Promise.all([
      ManagerModel.findOne({ Email: Email, password: password }).select('role').lean(),
      EmployeeModal.findOne({ Email: Email, password: password }).select('role').lean(),
      AdminModal.findOne({ Email: Email, password: password }).select('role').lean(),
    ]);    
        const matchedResult = userExistingData.find((result) => result !== null);
        if (matchedResult) {
        const role = matchedResult.role;
        res.status(200).json({ role: role });
        } else {
        res.status(401).json({ error: 'Invalid credentials' });
        }
    
    
  } catch (error) {
    console.error('Error querying the collections:', error);
    res.status(500).json({ error: 'Database query error' });
  }

})
// FORGOT PASSWORD
LoginRouter.post('/forgotPassword', async function(req, res) {
    const { Email } = req.body;
    try {
      const userExistingData = await Promise.all([
        ManagerModel.findOne({ Email }).select('role').lean(),
        EmployeeModal.findOne({ Email }).select('role').lean(),
        AdminModal.findOne({ Email }).select('role').lean(),
      ]);
  
      // Check if user exists
      const existingUser = userExistingData.find(user => user !== null);
      if (!existingUser) {
        return res.status(404).json({ error: 'Email not found' });
      }
  
      // Generate a random token
      const token = generateRandomString(10);
      console.log(token); // Output: "7bT3cD1rL9"
  
      // Update resetToken for matching models
      await Promise.all([
        EmployeeModal.findOneAndUpdate({ Email }, { resetToken: token }),
        AdminModal.findOneAndUpdate({ Email }, { resetToken: token }),
        ManagerModel.findOneAndUpdate({ Email }, { resetToken: token }),
      ]);
  
      // Compose the email
      const mailOptions = {
        from: process.env.EMAIL,
        to: Email,
        subject: 'Password Reset',
        text: `Your random string: ${token}`,
      };
  
      // Send the email with the random string
      Transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error(error);
          return res.status(500).json({ error: 'Failed to send the random string.' });
        }
        console.log('Email sent: ' + info.response);
        res.status(200).json({ message: 'Random string sent successfully to the email address.' });
      });
    } catch (error) {
      console.error('Error querying the collections:', error);
      res.status(500).json({ error: 'Database query error' });
    }
  });  
//RESET PASSWORD
LoginRouter.post('/resetPassword', async function (req, res) {
    const { Email, resetToken, newPassword } = req.body;
    try {
      const userExistingData = await Promise.all([
        ManagerModel.findOne({ Email, resetToken }).select('role').lean(),
        EmployeeModal.findOne({ Email, resetToken }).select('role').lean(),
        AdminModal.findOne({ Email, resetToken }).select('role').lean(),
      ]);
      
      // Check if user exists
      const existingUser = userExistingData.find(user => user !== null);
      if (!existingUser) {
        return res.status(404).json({ error: 'Invalid email or token.' });
      }
      
      // Update password and resetToken for matching models
      await Promise.all([
        EmployeeModal.findOneAndUpdate({ Email }, { password: newPassword, resetToken: null }),
        AdminModal.findOneAndUpdate({ Email }, { password: newPassword, resetToken: null }),
        ManagerModel.findOneAndUpdate({ Email }, { password: newPassword, resetToken: null }),
      ]);
      
      res.status(200).json({ message: 'Password updated successfully.' });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: 'Failed to update password.' });
    }
  });
  
module.exports = LoginRouter;