const express = require("express");
const { userAuthentication } = require("../Middlewares/Authentication");
const connectionModel = require("../models/connectionSchema");
const User = require("../models/userSchema");

const SAFE_USER_INFO = ["firstName" , "lastName" , "age" , "gender" , "about" , "photoURL" , "skills"];

const userRouter = express.Router();

// user can see all the pending the requests
userRouter.get("/user/requests/received" , userAuthentication , async (req , res) =>{

  try{

    const loggedInUser = req.user;

    const reqData = await connectionModel.find({
      toUserId: loggedInUser._id,
      status: "interested"
    }).populate("fromUserId" , ["firstName" , "lastName" , "photoURL"]);

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
    ]}).populate("fromUserId" , SAFE_USER_INFO)
       .populate("toUserId" , SAFE_USER_INFO);

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

userRouter.get("/user/feed" , userAuthentication , async (req , res) =>{

  try{

    const pageNum = parseInt(req.query.page) || 1;
    let limitRec = parseInt(req.query.limit) || 10;

    limitRec = limitRec > 20 ? 20 : limitRec;

    const skipPages = (pageNum - 1) * limitRec;


    const loggedInUser = req.user;

    const userConnectionsData = await connectionModel.find({
      $or: [
        {fromUserId: loggedInUser._id} , 
        {toUserId: loggedInUser._id}
      ]
    }).select("fromUserId toUserId");

    const hideUsersFromFeed = new Set();

    userConnectionsData.forEach((row) =>{
      hideUsersFromFeed.add(row.fromUserId.toString());
      hideUsersFromFeed.add(row.toUserId.toString());
    });

    const feedInfo = await User.find({
      $and:[
        {_id: {$nin: Array.from(hideUsersFromFeed)} },
        {_id: {$ne: loggedInUser._id}}
      ]}).select(SAFE_USER_INFO).skip(skipPages).limit(limitRec);  // implementing pagination

    res.json({
      message: "Your connection details:",
      data: feedInfo
    })

  }catch(err){
    res.status(400).json({message: err.message});
  }
})

module.exports = userRouter;

