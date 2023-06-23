const mongoose = require("mongoose");
// Define MongoDB schema and models for Employee
const EmployeeSchema = new mongoose.Schema({
    employeeId:{
        type:String,
        required:true,
        unique:true
    },
    employeeName: {
        type: String,
        required: true,
      },
      employeeLocation:{
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
      managerEmail:String,
      query:[String],
      taskdesc:[String],

}, { collection: `${process.env.COLLECTION3}` });
module.exports = mongoose.model("Employee", EmployeeSchema);
