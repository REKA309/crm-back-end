const mongoose = require("mongoose");
// Connect to MongoDB Atlas
mongoose.connect(`mongodb+srv://${process.env.USER}:${process.env.PASSWORD}@${process.env.CLUSTER}/${process.env.DBNAME}?retryWrites=true&w=majority`, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then((response) => {
    if (response) {
      console.log("DATABASE CONNECTED");
    }
  })
  .catch((err) => console.log(err));