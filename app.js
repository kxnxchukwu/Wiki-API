const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/wikiDB', { useNewUrlParser: true});

const app = express();
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

const articleSchema = new mongoose.Schema({
  title: String,
  content: String
});

const Article = mongoose.model("Article", articleSchema);

app.use(express.static("public"));

///////////////////////////////////////////////////////////////////////// Requests Targeting A Articles /////////////////////////////////////////////////////////////////////////

app.route("/articles")
    .get(function(req, res) {
        Article.find(function(err, foundArticles) {
            if (err) {
                res.send(err);
            }
            else {
                res.send(foundArticles);
            }
        });
    })
    .post(function(req, res) {
        const newArticle = new Article({
            title: req.body.title,
            content: req.body.content
        });
    
        newArticle.save(function (err){
            if (err) {
                res.send(err);
            }
            else {
                res.send("Successfully Added One New Article!");
            }
        });
    })
    .delete(function(req, res) {
        Article.deleteMany(function(err) {
            if (err) {
                res.send(err);
            }
            else {
                res.send("Successfully Deleted All the Articles.");
            }
        });
});

///////////////////////////////////////////////////////////////////////// Requests Targeting A Specific Article /////////////////////////////////////////////////////////////////////////


app.route("/articles/:articleTitle")
    .get(function(req, res) {
        Article.findOne({"title": req.params.articleTitle}, function(err, article) {
            if (err) {
                res.send("No Article Matching that Parameter.");
            }
            else {
                res.send(article);
            }
        })
    })
    .put(function(req, res) {
        Article.replaceOne(
            {"title": req.params.articleTitle}, 
            {title: req.body.title, content: req.body.content},
            function (err, result){
                if (err) {
                    res.send(err)
                }
                else {
                    res.send("Updated Article Successfully!")
                }
            })
    })
    .patch(function(req, res) {
        Article.updateOne(
            {"title": req.params.articleTitle}, 
            {$set: req.body},
            function (err, result){
                if (err) {
                    res.send(err)
                }
                else {
                    res.send("Patched Article Successfully!")
                }
            })
    })
    .delete(function(req, res) {
        Article.deleteOne(
            {"title": req.params.articleTitle},
            function (err, result){
                if (err) {
                    res.send(err)
                }
                else {
                    res.send("Deleted Article Successfully!")
                }
            })
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});