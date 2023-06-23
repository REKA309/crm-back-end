const mongoose = require("mongoose");
// Define MongoDB schema and models for Manager
const CustomerSchema = new mongoose.Schema({
    customerId:{
        type:String,
        required:true,
    },
    customerName: {
        type: String,
        required: true,
      },
      customerLocation:{
        type:String,
        required:true,
      },
      customerEmail: {
        type: String,
        required: true,
        unique: true, // Ensures uniqueness of the email field
      },
      role:String,
}, { collection: `${process.env.COLLECTION4}` });
module.exports = mongoose.model("Customer", CustomerSchema);