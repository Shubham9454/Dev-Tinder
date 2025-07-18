const validator = require("validator");

const validatingUserInfo = (req) => {
  const data = req.body;

  if (!data.firstName || !data.lastName || !data.emailID || !data.password) {
    throw new Error("Please check, some details are missing!");
  } 
  else if (!validator.isEmail(data.emailID)) {
    throw new Error("Please enter valid email address");
  }
  else if (!validator.isStrongPassword(data.password)) {
    throw new Error("Please use strong password");
  }
};

const validatingEmailID = (emailID) => {
  if(!validator.isEmail(emailID)){
    throw new Error("Please Enter Valid email address");
  }
};

module.exports = {validatingUserInfo , validatingEmailID};