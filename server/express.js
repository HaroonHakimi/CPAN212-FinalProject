const methodOverride = require("method-override");
const session = require("express-session");
const path = require("path");
const express = require("express");
const mongoose = require("mongoose");
const app = express();

const mongoUri =
  "mongodb+srv://admin:<admin>@cluster0.njdz2nl.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
mongoose
  .connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB Atlas"))
  .catch((err) => console.error("MongoDB connection error:", err));

app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));

module.exports = app;
