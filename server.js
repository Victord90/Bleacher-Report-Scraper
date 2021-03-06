const express = require("express");
const logger = require("morgan")
const exphbs = require("express-handlebars");
const mongoose = require("mongoose");

const axios = require("axios");
const cheerio = require("cheerio");

const db = require("./models");

const PORT = process.env.PORT || 3000;

const app = express();


app.use(logger("dev"));
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

mongoose.connect(MONGODB_URI, { useNewUrlParser: true });


app.get("/", function(req, res) {
  res.render("index");
});

/// A GET route for scraping bleacher report
app.get("/scrape", function(req, res) {
  axios.get("https://bleacherreport.com/").then(function(response) {
    const $ = cheerio.load(response.data);

    $(".articleTitle").each(function(i, element) {
      let result = {};

      result.title = $(this)
      .children("h3")
      .text();
      result.link = $(this)
      
      .attr("href");


      db.Article.create(result)
        .then(function(dbArticle) {
          console.log(dbArticle);
        })
        .catch(function(err) {
          console.log(err);
        });
    });

  });
});


app.get("/articles", function(req, res) {
  db.Article.find({})
    .then(function(dbArticle) {
      res.json(dbArticle);
    })
    .catch(function(err) {
      res.json(err)
    });
});


app.get("/articles/:id", function(req, res) {
  db.Article.findOne({_id: req.params.id })
    .populate("note")
    .then(function(dbArticle){
      res.json(dbArticle);
    })
    .catch(function(err) {
      res.json(err);
    });
});


app.post("/articles/:id", function(req, res) {
  db.Note.create(req.body)
    .then(function(dbNote) {
      return db.Article.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true });
    })
    .then(function(dbArticle) {
      res.json(dbArticle);
    })
    .catch(function(err) {
      res.json(err);
    });
});




app.listen(PORT, function() {
    console.log("App running on port " + PORT + "!");
  });
