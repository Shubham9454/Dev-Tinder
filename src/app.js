const express = require("express");

const app = express();

const port = 7777;

const UserModel = require("./models/user");

app.post("/signup", async (req, res, next) => {
  const user1 = new UserModel({
    firstName: "Cristiano",
    lastName: "Ronaldo",
    emailID: "cristiano.322@gamil.com",
    password: "abcdef",
    age: 38,
    gender: "Male",
  });
  
  try{
    await user1.save();
  
    console.log(`Username ${user1.firstName} is created successfully`);
    res.send("Your account is created with username:", user1.firstName);

  } catch(error){
    res.status(401).send("Something went wrong !");
  };
  
});

const connectDB = require("./Config/database");

connectDB()
  .then(() => {
    console.log("Database connection established");

    app.listen(port, () => {
      console.log("Server is listening on port no.", port);
    });
  })
  .catch((error) => {
    console.error("Databased connection failed");
  });
