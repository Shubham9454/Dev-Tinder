const adminAuthentication = (req, res, next) => {
  console.log("Middleware checks the authorization of user");

  // checking the authorization of user before sending the data
  const token = "abcd";
  const isAuthorized = token === "abcd";

  if (isAuthorized) {
    next();
  } else {
    res.status(401).send("Unauthorized access");
  }
}

module.exports = {adminAuthentication};