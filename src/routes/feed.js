const express = require("express");

const feedRouter = express.Router();

const User = require("../models/user");

// Accessing the data of single user with emailID
feedRouter.get("/user", async (req, res) => {

  // const userEmail = req.body.emailID;
  const userAge = req.body.age;

  try {
    // const user = await User.findOne({emailID: userEmail});
    const user = await User.find({ age: userAge });
    res.send(user);
  } catch (err) {
    res.status(404).send("Something went wrong");
  }
});

// Feed API- get /feed- access the details of all the users present in db
feedRouter.get("/feed", async (req, res) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (err) {
    res.status(400).send("Something went wrong");
  }
});

module.exports = feedRouter;