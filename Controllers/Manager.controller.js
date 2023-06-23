const ManagerModel=require('../Models/Manager.model');
const ManagerRouter = require("express").Router();
const Transporter=require('../Transporters/mailTransporter')

// POST METHOD TO ADD MANAGER
ManagerRouter.post("/createManager",async function (req, response) {
    const{managerId,managerName,managerLocation,Email,password,role}=req.body
    /**
     * CHECKING WHETHER USER ALREADY HAVE ACCOUNT WITH US
     */
  
    const userExistingData = await ManagerModel.findOne({
        Email:Email
      });
      if (userExistingData?._id) {
        return response.status(409).json({
          success: false,
          message: "User account already exists",
        });
      } else {
        //CONSTRUCTING NEW SIGNUP OBJECT
        const newManager = new ManagerModel({
          managerId:managerId,
          managerName:managerName,
          managerLocation:managerLocation,
          Email:Email,       
          password: password,
          role:role
        });
        // TRYING TO SAVE USER IN DATABASE
        newManager
          .save()
          .then((res) => {
            if (res._id) {
              response.status(200).json({
                success: true,
                message: "Account created successfully!!!",
                data: res,
              });
            } else {
              response.status(500).json({
                success: false,
                message: "Something went wrong internally!!!",
                data: res,
              });
            }
          })
          .catch((error) => {
            return response.status(400).json({
              success: false,
              message: "Bad Request!!!",
              error: error,
            });
          });
      }
  });
// GET METHOD TO VIEW MANAGERS
ManagerRouter.get("/getManagers",async function(req,res){
    try {
        const Manager = await ManagerModel.find();
        res.status(200).json(Manager);
      } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve managers' });
      }
})
//POST METHOD TO UPDATE MANAGER
ManagerRouter.post('/editManager', async function (req, response) {
  try {
    const { managerId,managerLocation, password } = req.body;
    const userExistingData = await ManagerModel.findOne({
      managerId:managerId
    });
    if (userExistingData?._id) {
      
      const updatedDocument = await ManagerModel.findOneAndUpdate(
        { managerId:managerId }, // query to find the document to update
        {managerLocation:managerLocation, password: password }, // fields to update
        { new: true, upsert: true }
      );
      if (updatedDocument) {
        response.status(200).json({ message: "Updated successfully!!!" });
      }
    } else {
      response.status(404).json({ message: 'Manager not found' });
    }
  } catch (err) {
    console.error(err);
    response.status(500).send('An error occurred');
  }
});
//POST METHOD TO DELETE MANAGER
ManagerRouter.post('/deleteManager',async function (req,response)
{
 try{
  const {managerId}=req.body;
  const userExistingData = await ManagerModel.findOne({
    managerId:managerId
  });
  if (userExistingData?._id) {
    const deletedManager = await ManagerModel.findOneAndDelete({ managerId });

    if (deletedManager) {
      response.status(200).json({ message: 'Manager document deleted successfully' });
    }
    
  } else {
    response.status(404).json({ message: 'Manager not found' });
  }
 }
 catch(err)
 {
    console.error(err);
    response.status(500).send('An error occurred');
 }
})
//POST METHOD TO SEND FEEDBACK MAIL TO SUPERADMIN
ManagerRouter.post('/send-email', (req, res) => {
  const { feedBack } = req.body;
  const toEmail = 'its.supertesting2021@gmail.com'; // Replace with the recipient's email address

  const mailOptions = {
    from: `${process.env.EMAIL}`, // Replace with your email address
    to: toEmail,
    subject: 'Feedback about Employee-reg.',
    text: feedBack
  };

 Transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log('Error sending email: ', error);
      res.status(500).send('Error sending email');
    } else {
      console.log('Email sent: ', info.response);
      res.status(200).send('Email sent successfully');
    }
  });
});

module.exports = ManagerRouter;
