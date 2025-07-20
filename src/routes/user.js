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

userRouter.get("/" , userAuthentication , (req , res) =>{

  try{

  } catch(err){
    res.status(400).send("Something went wrong ! with error: " + err.message);
  }
})



module.exports = userRouter;

