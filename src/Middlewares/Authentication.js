const jwt = require("jsonwebtoken");

const userModel = require("../models/userSchema.js");

const userAuthentication = async (req, res, next) => {
  try {

    const { token } = req.cookies;
    if(!token) throw new Error("Please Login with credentials");

    const decodedMsg = jwt.verify(token, "Shubham@123");

    const { _id } = decodedMsg;

    const user = await userModel.findById(_id);

    if(!user) throw new Error("Please create the Account");

    req.user = user;
    next();
  }
  catch (err) {
    res.status(400).send("Something went wrong with error: " + err.message);
  }
};

module.exports = { userAuthentication };
