const express = require("express");

const app = express();

const cookieParser = require("cookie-parser");

const jwt = require("jsonwebtoken");

// conversion of JSON data into JavaScript Object
app.use(express.json());

app.use(cookieParser());

const authRouter = require("./routes/auth");

const profileRouter = require("./routes/profile");

const feedRouter = require("./routes/feed");

const connectionReqRouter = require("./routes/connection");

app.use("/" , authRouter);
app.use("/" , connectionReqRouter);
app.use("/" , feedRouter);
app.use("/" , profileRouter);

// connecting with database
const connectDB = require("./Config/database");
const { default: mongoose } = require("mongoose");

connectDB()
  .then(() => {
    console.log("Database connection established");

    const port = 7777;

    app.listen(port, () => {
      console.log("Server is listening on port no.", port);
    });
  })
  .catch((error) => {
    console.error("Database connection failed");
  });
