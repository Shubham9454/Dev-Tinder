const express = require("express");

const authRouter = express.Router();

const User = require("../models/user");

const { validatingUserInfo, validatingEmailID } = require("../Utils/validation");

const bcrypt = require("bcrypt");

// SignUp API- making the entries of new user in database
authRouter.post("/signup", async (req, res, next) => {
  try {
    // user data validation
    validatingUserInfo(req);

    const { firstName, lastName, emailID, password } = req.body;

    // encrypt user password
    const passwordHash = await bcrypt.hash(password, 5);
    console.log(passwordHash);

    const user = new User({
      firstName,
      lastName,
      emailID,
      password: passwordHash,
    });

    await user.save();

    console.log(req.body);
    res.send("Your account is created with username");
  } catch (error) {
    res.status(401).send("Something went wrong with error: " + error.message);
  }
});

// Login API
authRouter.post("/login", async (req, res) => {

  try {
    const { emailID, password } = req.body;

    validatingEmailID(emailID);

    const userData = await User.findOne({ emailID: emailID });

    if (!userData) throw new Error("Invalid Credentials");

    const userPassword = await userData.validatePassword(password);

    if (!userPassword) throw new Error("Invalid Credentials");
    else {

      // Creating a JWT token
      const token = await userData.getJWT();
      // console.log("Token generated with value: " + token);

      res.cookie("token" , token);
      res.send("Login successful !");
    }
  } catch (err) {
    res.status(400).send("Something went wrong with error: " + err.message);
  }
});

// LogOut API
authRouter.post("/logout" , async (req , res) =>{

  res.cookie("token" , null , {expires: new Date(Date.now())});
  res.send("You are successfully Loged out !!");
});

module.exports = authRouter;

