require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const userRoutes = require("./routes/users.js");

//Express app
const app = express();

//Middleware
app.use(express.json());

app.use((req, res, next) => {
  console.log(req.path, req.method);
  next();
});

//Routes
app.use("/api/users", userRoutes);

//Connect to MongoDB using mongoose
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    //Listen to request
    app.listen(process.env.PORT, () => {
      console.log("Connected to database. Server listening on port 4000");
    });
  })
  .catch((error) => {
    console.log(error);
  });
