const express = require("express");

const app = express();

const port = 7777;

const User = require("./models/user");

const bcrypt = require("bcrypt");

const { validatingUserInfo, validatingEmailID } = require("./Utils/validation");

const cookieParser = require("cookie-parser");

const jwt = require("jsonwebtoken");

// conversion of JSON data into JavaScript Object
app.use(express.json());

app.use(cookieParser());

// SignUp API- making the entries of new user in database
app.post("/signup", async (req, res, next) => {
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
app.post("/login", async (req, res) => {

  try {
    const { emailID, password } = req.body;

    validatingEmailID(emailID);

    const userData = await User.findOne({ emailID: emailID });

    if (!userData) throw new Error("Invalid Credentials");

    const userPassword = await bcrypt.compare(password, userData.password);

    if (!userPassword) throw new Error("Invalid Credentials");
    else {

      // Creating a JWT token
      const token = await jwt.sign({_id: userData._id} , "Shubham@123");
      // console.log("Token generated with value: " + token);

      res.cookie("token" , token);
      res.send("Login successful !");
    }
  } catch (err) {
    res.status(400).send("Something went wrong with error: " + err.message);
  }
});

// profile API
app.get("/profile" , async (req , res) =>{

  try{

  const cookies = req.cookies;

  const {token} = cookies;

  if(!token) throw new Error("Please login before use");

  // validate the cookie
  const decodedMsg = await jwt.verify(token , "Shubham@123");
  //console.log(decodedMsg);

  const {_id} = decodedMsg;
  //console.log("Loged in user details: " + _id);

  const logedUser = await User.findById(_id);

  if(!logedUser) throw new Error("User does not found !");

  res.send(logedUser);

  }
  catch(err){
    res.status(400).send("Something went wrong");
  }
})

// Accessing the data of single user with emailID
app.get("/user", async (req, res) => {
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
app.get("/feed", async (req, res) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (err) {
    res.status(400).send("Something went wrong");
  }
});

// delete a data by using _id
app.delete("/delete", async (req, res) => {
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
app.patch("/update/:userID", async (req, res) => {
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

// connecting with database
const connectDB = require("./Config/database");
const { default: mongoose } = require("mongoose");

connectDB()
  .then(() => {
    console.log("Database connection established");

    app.listen(port, () => {
      console.log("Server is listening on port no.", port);
    });
  })
  .catch((error) => {
    console.error("Database connection failed");
  });
