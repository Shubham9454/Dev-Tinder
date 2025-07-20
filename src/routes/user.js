const express = require("express");
const { userAuthentication } = require("../Middlewares/Authentication");
const connectionModel = require("../models/connectionSchema");

const userRouter = express.Router();

// user can see all the pending the requests
userRouter.get("/user/requests/received" , userAuthentication , async (req , res) =>{

  try{

    const loggedInUser = req.user;

    const reqData = await connectionModel.find({
      toUserId: loggedInUser._id,
      status: "interested"
    }).populate("fromUserId" , ["firstName" , "lastName"]);

    if(reqData.length === 0) return res.send("You have no pending connection request.");

    res.json({
      message: `${loggedInUser.firstName}'s connection requests are shown below:`,
      data: reqData
    });
  }
  catch(err){
    res.status(400).send("Something went wrong with error: " + err.message);
  }

});

userRouter.get("/user/connections" , userAuthentication , async (req , res) =>{

  try{

    const loggedInUser = req.user;

    const connectionData = await connectionModel.find({
      $or: [
        { toUserId: loggedInUser._id, status: "accepted"},
        {fromUserId: loggedInUser._id, status: "accepted"}
    ]}).populate("fromUserId" , ["firstName" , "lastName"])
       .populate("toUserId" , ["firstName" , "lastName"]);

    if(connectionData.length == 0) {
      res.send("You have no connections");
    }
    
    const finalData = connectionData.map((row) =>{
      if(row.fromUserId._id.equals(loggedInUser._id)){
      return row.toUserId;
    }
    return row.fromUserId;
     
    });
    
    res.json({
      message: "Your connections list are below:",
      data: finalData
    });

  } catch(err){
    res.status(400).send("Something went wrong ! with error: " + err.message);
  }
})



module.exports = userRouter;

