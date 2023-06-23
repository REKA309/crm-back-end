const { MongoClient } = require('mongodb');

const uri = `mongodb+srv://${process.env.USER}:${process.env.PASSWORD}@${process.env.CLUSTER}/${process.env.DBNAME}?retryWrites=true&w=majority`;

let client;
let databaseName;

function connect() {
  return new Promise((resolve, reject) => {
    MongoClient.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
      .then((connectedClient) => {
        client = connectedClient;
        databaseName = process.env.DBNAME; // Replace with your database name
        resolve();
      })
      .catch((error) => {
        reject(error);
      });
  });
}

function getClient() {
  return client;
}

function getDatabaseName() {
  return databaseName;
}

module.exports = {
  connect,
  getClient,
  getDatabaseName
};
