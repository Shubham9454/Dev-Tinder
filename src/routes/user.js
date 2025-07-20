const express = require("express");

const userRouter = express.Router();

userRouter.get("/" , async (req , res) =>{

  try{

  }
  catch(err){
    res.status(400).send("Something went wrong with error: " + err.message);
  }


});

module.exports = userRouter;