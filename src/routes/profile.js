const express = require("express");

const profileRouter = express.Router();

const User = require("../models/user");

const {userAuthentication} = require("../Middlewares/Authentication");

// profile API
profileRouter.get("/profile" , userAuthentication, async (req , res) =>{

  try{

    const user = req.user;
    if(!user) throw new Error("User not found");
    
    res.send(user);
  }
  catch(err){
    res.status(400).send("Something went wrong" + err.message);
  }
});

// delete a data by using _id
profileRouter.delete("/delete", async (req, res) => {
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
profileRouter.patch("/update/:userID", async (req, res) => {
  const userid = req.params?.userID;
  const data = req.body;
  const userSkills = req.body.skills;

  try {
    const allowedUpdates = [
      "lastName",
      "password",
      "age",
      "gender",
      "about",
      "skills",
    ];
    const isUpdateAllowed = Object.keys(data).every((k) => {
      return allowedUpdates.includes(k);
    });

    if (!isUpdateAllowed) {
      throw new Error("This field is not allowed to update");
    }

    if (userSkills.length > 5) {
      throw new Error("Your skills exceeds the limit");
    }

    const user = await User.findByIdAndUpdate(userid, data, {
      returnDocument: "after",
      runValidators: true,
    });

    console.log(user);
    res.send("Data updated successfully");
  } catch (err) {
    res.status(400).send("Something Went Wrong with error:" + err.message);
  }
});

module.exports = profileRouter;