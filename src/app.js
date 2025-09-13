const express = require("express");

const app = express();

const cookieParser = require("cookie-parser");

const jwt = require("jsonwebtoken");

const cors = require("cors");

app.use(cors({
  origin: "https://devtinder-eve3hms0v-shubham9454s-projects.vercel.app",
  credentials: true
}));

// conversion of JSON data into JavaScript Object
app.use(express.json());

app.use(cookieParser());

const authRouter = require("./routes/auth");

const profileRouter = require("./routes/profile");

const userRouter = require("./routes/user");

const connectionReqRouter = require("./routes/connection");

app.use("/" , (req , res) =>{
  res.send("DevTinder Backend Server is running!!");
});
app.use("/" , authRouter);
app.use("/" , connectionReqRouter);
app.use("/" , profileRouter);
app.use("/" , userRouter);


// connecting with database
const connectDB = require("./Config/database");
const { default: mongoose } = require("mongoose");

connectDB()
  .then(() => {
    console.log("Database connection established");

    const port = 10000;

    app.listen(port, () => {
      console.log("Server is listening on port no.", port);
    });
  })
  .catch((error) => {
    console.error("Database connection failed");
  });
