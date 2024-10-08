require("dotenv").config();

const cors = require("cors");
const express = require("express");
const mongoose = require("mongoose");
const userRoutes = require("./routes/users.js");
const postRoutes = require('./routes/posts.js');
const path = require('path');

//Express app
const app = express();

//Middleware
app.use(express.json());

app.use(cors({
  origin: 'http://localhost:3000'
}));

app.use((req, res, next) => {
  console.log(req.path, req.method);
  next();
});

//File upload
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

//Routes
app.use("/api/users", userRoutes);
app.use('/api/posts', postRoutes);

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
