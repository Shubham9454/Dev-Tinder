const express = require("express");

const authRouter = express.Router();

const User = require("../models/userSchema");

const {
  validatingUserInfo,
  validatingEmailID,
} = require("../Utils/validation");

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

    if (user) {
      const token = await user.getJWT();
      // console.log("Token generated with value: " + token);

      res.cookie("token", token, {
        httpOnly: true,
        secure: true, // must be true in production (HTTPS)
        sameSite: "none", // allow cross-site cookies (Vercel <-> Render)
      });
      res.json({
        message: `${user.firstName} your account is created successfully !`,
        data: user,
      });
    }

    console.log(req.body);
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

      res.cookie("token", token, {
        httpOnly: true,
        secure: true, // must be true in production (HTTPS)
        sameSite: "none", // allow cross-site cookies (Vercel <-> Render)
      });
      
      res.json({
        message: "Login Successful !",
        data: userData,
      });
    }
  } catch (err) {
    res.status(400).send(err.message);
  }
});

// LogOut API
authRouter.post("/logout", async (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    
  });
  return res.status(200).json({ message: "Logged out successfully" });

  // Send a successful response.
  res.status(200).send("You are successfully Logged out !!");
});

module.exports = authRouter;
