var express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");

//var axios = require("axios");
//var cheerio = require("cheerio");

//var db = require("./models");

var PORT = (process.env.PORT || 3000);

//Intializes express 
var app = express();
app.use(logger("dev"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

var exphbs = require("express-handlebars");

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");


// If deployed, use the deployed database. Otherwise use the local mongoHeadlines database
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";
// Set mongoose to leverage built in JavaScript ES6 Promises
// Connect to the Mongo DB
mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI)

//Need to add in web scrapper here 
var routes = require("./controllers/mainController.js");

app.use(routes);

app.listen(PORT, function() {
  console.log("App running on port " + PORT + "!");
});

