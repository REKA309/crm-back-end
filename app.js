const express = require("express");
const appserver = express();
const bodyparser = require("body-parser");

// INJECT MIDDLE WARES
appserver.use(bodyparser.json());

// INJECT CONTROLLERS

appserver.use("/crm",require('./Controllers/Manager.controller'))
appserver.use("/crm",require('./Controllers/Employee.controller'))
appserver.use("/crm",require('./Controllers/Customer.controller'))
appserver.use('/crm',require('./Controllers/Login.controller'));

module.exports = appserver;