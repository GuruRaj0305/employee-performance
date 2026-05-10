const express = require("express");
const { userAuthentication } = require("./middleware/auth.middleware");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const { ALLOWED_CORS_ORIGINS } = require("../config/config");

const app = express();

app.use(
  cors({
    origin: ALLOWED_CORS_ORIGINS,
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.use(express.json());
app.use(cookieParser());

app.use(express.urlencoded({ extended: true }));


app.use('/api', require('./routes'));


module.exports = app;
