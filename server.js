var express = require("express"),
    app = express(),
    imageSearch = require('node-google-image-search'),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    SearchTerm = require("./models/search-term");
mongoose.connect("mongodb://ens0:taktoja@ds151141.mlab.com:51141/image_search");

app.set("view engine", "ejs");
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: false }));

var term = "",
    offset = 0;

app.get("/", function(req, res) {
    res.render("start");
    
});

app.post("/imagesearch", function(req, res) {
    term = req.body.term;
    SearchTerm.create({term: term}, function(err, term) {
        if(err) {
            console.log(err);
        } else {
            console.log(term);
        }
    });
    offset = req.body.number;
    console.log(req.body.number);
    console.log(term);
    res.redirect("/imagesearch/" + term + "?offset=" + offset);
});

app.get("/latest/imagesearch", function(req, res) {
    SearchTerm.find({}).sort('-when').limit(10).select("term when -_id").exec(function(err, terms){
        if(err) {
            console.log(err);
        } else {
            res.send(terms);
        }
    });
});

app.get("/imagesearch/:searchTerm", function(req, res) {
    term = req.params.searchTerm;
    var result = [];
    offset = Number(req.query.offset);
    //console.log(offset);
    var results = imageSearch(term, callback, offset, 10);
    
    function callback(results) {
        results.forEach(function(item) {
            var image = {};
            image.url = item.link;
            image.snippet = item.snippet;
            image.thumbnail = item.image.thumbnailLink;
            image.context = item.image.contextLink;
            result.push(image);
        });
            console.log(offset);
            res.send(result);
        }
});

app.get("*", function(req, res) {
    res.render("error404");
});

app.listen(process.env.PORT, process.env.ID, function() {
    console.log("Server is on!");
})