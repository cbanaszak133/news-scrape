
var db = require("../models/");

var axios = require("axios");
var cheerio = require("cheerio");

module.exports = function(router){

	//Scraper route
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


	//When you land on the homepage, load all scraped articles
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

	//Route for the saved article page
	router.get("/saved", function(req, res) {
		db.Headline.find({
			saved: true
		})
			.then(function(dbHeadline) {
				var newObj = {
					headline: dbHeadline
				};
				res.render("saved", newObj);
			})
			.catch(function(err) {
				res.json(err)
			});
	});

	//When the modal opens, get all of the comments for a particular headline
	router.get("/comments/:id", function(req, res) {
		db.Headline.findOne({'_id':req.params.id})
			.populate('notes')
			.then(function(dbHeadline) {
				res.json(dbHeadline);
			})
			.catch(function(err) {
				res.json(err);
			})		
	});

	//Make a new comment for a specific headline
	router.post("/comments/:id", function(req, res) {
		db.Note.create(req.body)
			.then(function(dbNote) {
				return db.Headline.findOneAndUpdate({"_id": req.params.id}, { $push: { notes: dbNote._id } }, { new: true });
			})
		    .then(function(dbHeadline) {
		      res.json(dbHeadline);
		    })
		    .catch(function(err) {	      
		      res.json(err);
		    })	
	});

	//Save an article
	router.put("/save/:id", function(req, res) {
		db.Headline.update(
			{ _id: req.params.id },
			{ $set: {saved: true } }
		)
			.then(function(dbHeadline) {
				res.json(dbHeadline);
			})
			.catch(function(err) {
				res.json(err);
			})
	});

	//Unsave an article
	router.put("/unsave/:id", function(req, res) {
		db.Headline.update(
			{ _id: req.params.id },
			{ $set: {saved: false } }
		)
			.then(function(dbHeadline) {
				res.json(dbHeadline);
			})
			.catch(function(err) {
				res.json(err);
			})
	});

	//Delete a comment
	router.delete("/comments/:id", function(req, res) {
		db.Note.remove({_id:req.params.id})
			.then(function(dbNote){
				res.json(dbNote);
			})
			.catch(function(err){
				res.json(err);
			})
	});


}
