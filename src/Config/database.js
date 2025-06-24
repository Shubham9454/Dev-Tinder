const mongoose = require("mongoose");

const connectDB = async () =>{

    await mongoose.connect(
    "mongodb+srv://shivamyad0004:DT01GAgdjxsHsoeX@cluster0.ilwilv5.mongodb.net/DevTinder");
};

module.exports = connectDB;

