const express = require("express");

const connectionReqRouter = express.Router();

const User = require("../models/user");

const {userAuthentication} = require("../Middlewares/Authentication");

// API for Sending connection request
connectionReqRouter.post("/sendingConnectionRequest" , userAuthentication , async (req , res , next) => {
  try{

  const user = req.user;
  console.log("Connection sent successfully");

  res.send(user.firstName + " sent the connection request !!!");
  }
  catch(err){
    res.status(400).send("Something went wrong: " + err.message);
  }
});

module.exports = connectionReqRouter;
