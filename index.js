const express = require("express");
const nodeserver = express();
const env = require("dotenv");
const cors = require("cors");

// CONFIGURING ENVIRONMENT VARIABLES
env.config();

// CONFIGURING CORS
nodeserver.use(cors());

// INJECT APP SERVER
nodeserver.use("/", require("./app"));

// CONFIGS
const port = process.env.PORT;

// LISTEN TO NODE SERVER
nodeserver.listen(port,  () => {
  console.log("SERVER STARTED", port);
  require("./dbConfig");
});