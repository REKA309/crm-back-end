const mongoose = require("mongoose");
// Define MongoDB schema and models for Admin
const AdminSchema = new mongoose.Schema({
    
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
}, { collection: `${process.env.COLLECTION1}` });
module.exports = mongoose.model("Admin", AdminSchema);