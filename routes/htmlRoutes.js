const db = require("../models");

module.exports = function(app) {

    app.get("/", function(req, res) {
        db.Article.findAll({}).then(function(dbArticles) {
            res.render("index", {
                Article: dbArticles
            });
        });
    });
}