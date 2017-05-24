var mongoose = require("mongoose");

var searchTermSchema = new mongoose.Schema({
    term: String,
    when: { type: Date, required: true, default: Date.now }
});

module.exports = mongoose.model("SearchTerm", searchTermSchema);