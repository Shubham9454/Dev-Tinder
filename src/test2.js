const express = require("express");

const app = express();

const port = 7777;

app.use("/user", (req, res) => {
  try {
    console.log("Controle is in user's route handler");

    throw new Error("Invalid Username");
  } catch (error) {
    console.log()
    res.status(500).send("Some error is detected by catch block");
  }
});

app.use("/", (err, req, res, next) => {
  if (err) {
    res.status(404).send("Something went wrong");
  }
});

app.listen(port, () => {
  console.log("Server is created for port no.", port);
});
