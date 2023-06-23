const mongoose = require("mongoose");
// Define MongoDB schema and models for Manager
const ManagerSchema = new mongoose.Schema({
    managerId:{
        type:String,
        required:true,
    },
    managerName: {
        type: String,
        required: true,
      },
      managerLocation:{
        type:String,
        required:true,
      },
      Email: {
        type: String,
        required: true,
        unique: true, // Ensures uniqueness of the email field
      },
      password: {
        type: String,
        required: true,
      },
      role:String,
      resetToken:String,
      newPassword:String,
}, { collection: `${process.env.COLLECTION2}` });
module.exports = mongoose.model("Manager", ManagerSchema);
