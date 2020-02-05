const express = require("express");
const mongoose = require("mongoose");

const axios = require("axios");
const cherrio = require("cheerio");

const db = require("./models");

const PORT = process.env.PORT || 3000;

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Make public a static folder
app.use(express.static("public"));


app.set("views", "./views");
app.engine(
  "handlebars",
  exphbs({
    defaultLayout: "main"
  })
);
app.set("view engine", "handlebars");

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

mongoose.connect(MONGODB_URI);











app.listen(PORT, function() {
    console.log("App running on port " + PORT + "!");
  });