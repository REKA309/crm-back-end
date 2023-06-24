const EmployeeModal=require('../Models/Employee.model')
const EmployeeRouter = require("express").Router();
// POST METHOD TO ADD EMPLOYEE
EmployeeRouter.post("/createEmployee",async function (req, response) {
    const{employeeId,employeeName,employeeLocation,Email,password,role}=req.body
    /**
     * CHECKING WHETHER USER ALREADY HAVE ACCOUNT WITH US
     */
    const userExistingData = await EmployeeModal.findOne({
       Email:Email
      });
      if (userExistingData?._id) {
        return response.status(409).json({
          success: false,
          message: "User account already exists",
        });
      } else {
        //CONSTRUCTING NEW SIGNUP OBJECT
        const newEmployee = new EmployeeModal({
          employeeId:employeeId,
          employeeName:employeeName,
          employeeLocation:employeeLocation,
          Email:Email,       
          password: password,
          role:role
        });
        // TRYING TO SAVE USER IN DATABASE
        newEmployee
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
  // GET METHOD TO VIEW EMPLOYEES
  EmployeeRouter.get("/getEmployees",async function(req,res){
      try {
          const Employee = await EmployeeModal.find();
          res.status(200).json(Employee);
        } catch (error) {
          res.status(500).json({ error: 'Failed to retrieve employee' });
        }
  })
  // POST METHOD TO UPDATE EMPLOYEE
  EmployeeRouter.post('/editEmployee', async function (req, response) {
    try {
      const { employeeId, employeeLocation, password } = req.body;
      const userExistingData = await EmployeeModal.findOne({
        employeeId: employeeId
      });
      if (userExistingData?._id) {
        console.log(userExistingData.id);
        const updatedDocument = await EmployeeModal.findOneAndUpdate(
          { employeeId: employeeId }, // query to find the document to update
          { employeeLocation: employeeLocation, password: password }, // fields to update
          { new: true, upsert: true }
        );
        if (updatedDocument) {
          response.status(200).json({ message: "Updated successfully!!!" });
        }
      } else {
        response.status(404).json({ message: 'Employee not found' });
      }
    } catch (err) {
      console.error(err);
      response.status(500).send('An error occurred');
    }
  });
  // GET METHOD TO RETRIEVE SPECIFIC MANAGER EMPLOYEES
  EmployeeRouter.get('/viewMangersEmp',async function(req,res){
    try{
      const {managerEmail}=req.body;
      const Employee = await EmployeeModal.find({managerEmail:managerEmail});
          res.status(200).json(Employee);
    }
    catch(error)
    {
      console.error('Error updating data in MongoDB:', error);
      res.status(500).json({ error: 'Error updating data in MongoDB' });
    }
  })
  //POST METHOD TO DELETE EMPLOYEE
EmployeeRouter.post('/deleteEmployee',async function (req,response)
{
 try{
  const {employeeId}=req.body;
  const userExistingData = await EmployeeModal.findOne({
    employeeId:employeeId
  });
  if (userExistingData?._id) {
    const deletedEmployee = await EmployeeModal.findOneAndDelete({ employeeId });

    if (deletedEmployee) {
      response.status(200).json({ message: 'Employee document deleted successfully' });
    }
    
  } else {
    response.status(404).json({ message: 'Employee not found' });
  }
 }
 catch(err)
 {
    console.error(err);
    response.status(500).send('An error occurred');
 }
})
//POST METHOD TO ASSIGN MANAGER FOR EMPLOYEE
EmployeeRouter.post('/assignManager',async function (request,response)
{
    try{
        const {employeeId,managerEmail}=request.body;
        const userExistingData = await EmployeeModal.findOne({
            employeeId: employeeId
          });
          if (userExistingData?._id){
            const updatedDocument = await EmployeeModal.findOneAndUpdate(
                { employeeId: employeeId }, // query to find the document to update
                {managerEmail:managerEmail }, // fields to update
                { new: true, upsert: true }
              );
              if (updatedDocument) {
                response.status(200).json({ message: "Updated successfully!!!" });
              }
          }
          else
          {
            response.status(404).json({ message: 'Employee not found' });
          }
    }
    catch(err)
    {
        console.log(err)
        response.status(500).send('An error occurred');
    }

})
//POST METHOD FOR TASK STORAGE
EmployeeRouter.post('/assignTask',async(req,res)=>{
    try{
      const {employeeId,task}=req.body
    const userExistingData = await EmployeeModal.findOne({
      employeeId:employeeId
    });
    if(userExistingData?._id)
        {
          userExistingData.taskdesc.push(task);
          const savedData = await userExistingData.save();
          res.status(200).json({ message: 'Data updated successfully',savedData });
        }
        else{
          return res.status(404).json({
            success: false,
            message: "User account doesnt exists, create new account!!!",
          });
        }
    }
    catch(error)
    {
      console.error('Error updating data in MongoDB:', error);
      res.status(500).json({ error: 'Error updating data in MongoDB' });
    }
  })
  //POST METHOD FOR QUERY STORAGE
  EmployeeRouter.post('/askQuery',async(req,res)=>{
    try{
      const {employeeId,doubt}=req.body
    const userExistingData = await EmployeeModal.findOne({
      employeeId:employeeId
    });
    if(userExistingData?._id)
        {
          userExistingData.query.push(doubt);
          const savedData = await userExistingData.save();
          res.status(200).json({ message: 'Data updated successfully',savedData });
        }
        else{
          return res.status(404).json({
            success: false,
            message: "User account doesnt exists, create new account!!!",
          });
        }
    }
    catch(error)
    {
      console.error('Error updating data in MongoDB:', error);
      res.status(500).json({ error: 'Error updating data in MongoDB' });
    }
  })
  // GET METHOD FOR VIEW TASKS
EmployeeRouter.get('/viewTasks/:employeeId',async function (req,res){
    try {
        const { employeeId } = req.params;
        const userExistingData = await EmployeeModal.findOne({
         employeeId:employeeId
        });
        if(userExistingData?._id)
          {
            const task = userExistingData.taskdesc;
            res.status(200).json( task );
          }
          else{
            return res.status(404).json({
              success: false,
              message: "User account doesnt exists, create new account!!!",
            });
          }
      }
      catch(error)
      {
        console.error('Error updating data in MongoDB:', error);
        res.status(500).json({ error: 'Error updating data in MongoDB' });
      }
})
// GET METHOD FOR QUERIES
EmployeeRouter.get('/view/employees/queries',async function(req,res){
  try{
    const {managerEmail}=req.body
  const userExistingData = await EmployeeModal.find(
    { managerEmail: managerEmail },
  );
  if(userExistingData){
    const filteredData = userExistingData.map(({ employeeId, employeeName, query }) => ({
      employeeId,
      employeeName,
      query,
    }));
    res.status(200).json(filteredData)
  }
  else{
    res.status(404).json({success: false,
      message: "User account doesnt exists, create new account!!!",})
  }
  }
  catch(error)
  {
    console.error('Error updating data in MongoDB:', error);
    res.status(500).json({ error: 'Error updating data in MongoDB' });
  }
})
module.exports = EmployeeRouter;

