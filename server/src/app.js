const express = require("express");
const { userAuthentication } = require('./middleware/auth.middleware');
const cookieParser = require('cookie-parser');

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use(express.urlencoded({ extended: true }));

// Health check endpoint, also containes in gateway health check, but this is for direct access to server health check
app.get("/_healthz", (req, res) => {
  console.log("Health check endpoint hit");
  return res.status(200).json({
    success: true,
    message: "Server is running successfully",
  });
});

app.use(userAuthentication);



module.exports = app;