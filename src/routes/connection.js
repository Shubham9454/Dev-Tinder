const express = require("express");

const connectionReqRouter = express.Router();

const User = require("../models/userSchema");

const {userAuthentication} = require("../Middlewares/Authentication");

const connectionModel = require("../models/connectionSchema");

// API for Sending connection request
connectionReqRouter.post("/request/send/:status/:toUserId" , userAuthentication , async (req , res , next) => {
  try{

    const fromUserId = req.user._id;
    const toUserId = req.params.toUserId;
    const status = req.params.status;

    const allowedStatus = ["interested" , "ignored"];

    if(!allowedStatus.includes(status)) 
      return res.status(400).json({ message: "Invalid request status !!"});

    const toUser = await User.findById(toUserId);
    if(!toUser || toUserId == fromUserId){
      return res.status(400).json({message: "Invalid request"});
    }

    const checkConnectionReq = await connectionModel.findOne({
      $or: [
        {fromUserId , toUserId},
        {fromUserId: toUserId , toUserId: fromUserId}
      ]
    });

    if(checkConnectionReq){
      throw new Error("Request already made");
    }
    else{

    const connectionReq = new connectionModel({
      fromUserId,
      toUserId,
      status
    });

    const connectionData = await connectionReq.save();

    res.json({
      message: `${req.user.firstName}'s connection request towards ${toUser.firstName} is ${status}.`,
      data: connectionData
    });

    }
  }
  catch(err){
    res.status(400).send("Something went wrong: " + err.message);
  }
});

connectionReqRouter.post("/request/review/:status/:requestId" , userAuthentication , async (req , res) =>{

  try{

    const {status , requestId} = req.params;
    const loggedInUser = req.user;
    
    //validating the status of the request
    const allowedStatus = ["accepted" , "rejected"];

    if(!allowedStatus.includes(status)) throw new Error("Invalid status !!");
    
    // validating the connection request
    const checkConnectionReq = await connectionModel.findOne({
      _id: requestId,
      toUserId: loggedInUser._id,
      status: "accepted"
    });

    if(!checkConnectionReq) throw new Error("Invalid connection request !!");

    checkConnectionReq.status = status;

    const userData = await checkConnectionReq.save();

    res.json({
      message: `${loggedInUser.firstName} ${status} the request successfully.`,
      data: userData
    });
  }
  catch(err){
    res.status(400).send("Something went wrong with error: " + err.message);
  }
});

module.exports = connectionReqRouter;
