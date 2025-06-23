const express = require("express");

const app = express();

const { adminAuthentication } = require("./Middlewares/Authentication");

const port = 7777;

app.use("/admin", adminAuthentication);

app.use("/user" , (req , res) =>{
  console.log("User route handler");
  res.send("User's data");
})

app.get("/admin/getUserData", (req, res, next) => {
  console.log("get user's data request handler");
  res.send("admin's data");
});

app.use("/admin/deleteUserData", (req, res, next) => {
  console.log("Delete user's data request handler");
  res.send("admin's data has been deleted");
});

app.listen(port, () => {
  console.log("Server is created for port no.", port);
});
