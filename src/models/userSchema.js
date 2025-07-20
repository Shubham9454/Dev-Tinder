const mongoose = require("mongoose");

const validator = require("validator");

const JWT = require("jsonwebtoken");

const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  emailID: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    // validate(value){
    //   if(!validator.isEmail(value)){
    //     throw new Error("Invalid email address:" + value);
    //   }
    // },
    match: [/^[a-zA-Z][\w.]+@gmail\.com$/ , "Invalid email address"],
  },
  password: {
    type: String,
    required: true,
    validate(value){
      if(!validator.isStrongPassword(value))
        throw new Error("Please choose a strong password");
    },
  },
  age: {
    type: Number,
    min: 18,
  },
  gender: {
    type: String,
    validate(value){
      if(!["male", "female", "other"].includes(value))
        throw new Error("Invalid gender data");
    }
  },
  about: {
    type: String,
    default: "This is about section"
  },
  profile: {
    type: String
  },
  skills: {
    type: [String]
  }
  
},{
  timestamps: true
});

userSchema.methods.getJWT = async function(){
  const user = this;
  const token = await JWT.sign({_id: this._id} , "Shubham@123" , {expiresIn: '3h'});
  return token;
}

userSchema.methods.validatePassword = async function(inputPassword){

  const user = this;
  const passwordHash = user.password;

  const isPasswordCorr = await bcrypt.compare(inputPassword, passwordHash);

  return isPasswordCorr;
};

const UserModel = mongoose.model("User", userSchema);

module.exports = UserModel;
