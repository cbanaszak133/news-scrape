
var express = require("express");

var router = express.Router();

var db = require("../models/");

var axios = require("axios");
var cheerio = require("cheerio");


router.get("/scrape", function(req, res) {

	axios.get("https://www.npr.org/sections/news/").then(function(response) {

		var $ = cheerio.load(response.data);

		$("div.item-info").each(function(i, element) {
			var result = {};

			result.title = $(this).children("h2.title").children("a").text();
			result.link = $(this).children("h2.title").children("a").attr("href");
			result.summary = $(this).children("p.teaser").children("a").text();

			db.Headline.create(result)
				.then(function(dbHeadline) {
					console.log(dbHeadline);
				})
				.catch(function(err) {
					return res.json(err);
				})
		});

		res.send("Scrape complete!");
	});
});

//Need to add in GET and POST routes here

router.get("/", function(req, res) {
	db.Headline.find({})
		.then(function(dbHeadline) {
			var newObj = {
				headline: dbHeadline
			};
			res.render("index", newObj);
		})
		.catch(function(err){
			res.json(err)
		});
});

module.exports = router;