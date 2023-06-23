const CustomerModal=require('../Models/Customer.model')
const CustomerRouter = require("express").Router();
// POST METHOD TO ADD CUSTOMER
CustomerRouter.post("/createCustomer",async function (req, response) {
    const{customerId,customerName,customerLocation,customerEmail,role}=req.body
    /**
     * CHECKING WHETHER USER ALREADY HAVE ACCOUNT WITH US
     */
  
    const userExistingData = await CustomerModal.findOne({
        customerEmail:customerEmail
      });
      if (userExistingData?._id) {
        return response.status(409).json({
          success: false,
          message: "User account already exists",
        });
      } else {
        //CONSTRUCTING NEW SIGNUP OBJECT
        const newCustomer = new CustomerModal({
          customerId:customerId,
          customerName:customerName,
          customerLocation:customerLocation,
          customerEmail:customerEmail,
          role:role
        });
        // TRYING TO SAVE USER IN DATABASE
        newCustomer
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
// GET METHOD TO VIEW CUSTOMERS
CustomerRouter.get("/getCustomers",async function(req,res){
    try {
        const Customer = await CustomerModal.find();
        res.status(200).json(Customer);
      } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve customer' });
      }
})
//POST METHOD TO UPDATE CUSTOMER
CustomerRouter.post('/editCustomer', async function (req, response) {
  try {
    const { customerId, customerLocation } = req.body;
    const userExistingData = await CustomerModal.findOne({
      customerId:customerId
    });
    if (userExistingData?._id) {
      
      const updatedDocument = await CustomerModal.findOneAndUpdate(
        { customerId:customerId }, // query to find the document to update
        { customerLocation:customerLocation }, // fields to update
        { new: true, upsert: true }
      );
      if (updatedDocument) {
        response.status(200).json({ message: "Updated successfully!!!" });
      }
    } else {
      response.status(404).json({ message: 'Customer not found' });
    }
  } catch (err) {
    console.error(err);
    response.status(500).send('An error occurred');
  }
});
//POST METHOD TO DELETE CUSTOMER
CustomerRouter.post('/deleteCustomer',async function (req,response)
{
 try{
  const {customerId}=req.body;
  const userExistingData = await CustomerModal.findOne({
    customerId:customerId
  });
  if (userExistingData?._id) {
    const deletedCustomer = await CustomerModal.findOneAndDelete({ customerId });

    if (deletedCustomer) {
      response.status(200).json({ message: 'Customer document deleted successfully' });
    }
    
  } else {
    response.status(404).json({ message: 'Customer not found' });
  }
 }
 catch(err)
 {
    console.error(err);
    response.status(500).send('An error occurred');
 }
})

module.exports = CustomerRouter;