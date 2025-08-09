const express = require("express");

const profileRouter = express.Router();

const User = require("../models/userSchema");

const {userAuthentication} = require("../Middlewares/Authentication");

const {validateEditableData} = require("../Utils/validation");

const bcrypt = require("bcrypt");

// profile API
profileRouter.get("/profile/view" , userAuthentication, async (req , res) =>{

  try{

    const user = req.user;
    if(!user) throw new Error("User not found");
    
    res.send(user);
  }
  catch(err){
    res.status(401).send("Something went wrong" + err.message);
  }
});

// delete a data by using _id
profileRouter.delete("/profile/delete", async (req, res) => {
  const userID = req.body.id;

  try {
    //const user = await User.findByIdAndDelete(userID);

    const user = await User.findByIdAndDelete({ _id: userID });
    res.send("Your data deleted successfully with query");
  } catch (err) {
    res.status(400).send("Something went wrong");
  }
});

// updating an existing data
profileRouter.patch("/profile/edit", userAuthentication , async (req, res) => {

  try {
    
    validateEditableData(req);

    const loggedInUser = req.user;

    Object.keys(req.body).forEach((key) =>{

      loggedInUser[key] = req.body[key]
  });
    
    await loggedInUser.save();

    res.json({
      message: loggedInUser.firstName + "'s profile updated successfully !!",
      data: loggedInUser
  });
  } catch (err) {
    res.status(400).send("Something Went Wrong with error:" + err.message);
  }
});

// profile/changePassword API for forgot password
profileRouter.patch("/profile/changePassword" , userAuthentication , async (req , res) =>{

  try{

  const user = req.user;

  const oldPassword = req.body.password;
  const newPassword = req.body.newPassword;
  const confirmPassword = req.body.confirmPassword;

  //console.log(newPassword);
  const checkPassword = await user.validatePassword(oldPassword);

  if(!checkPassword) throw new Error("Invalid credentials");

  if(newPassword === confirmPassword){

    const passwordHash = await bcrypt.hash(newPassword , 5);
    const newData = await User.findByIdAndUpdate(user._id , {password: passwordHash});
    res.json({
    message: "Password changed successfully !!",
    data: newData
  });  
  }else throw new Error("Confirm password doen't match with new password");

  }
  catch(err){
    res.status(400).send("Something went wrong with error: " + err.message);
  }

});

module.exports = profileRouter;