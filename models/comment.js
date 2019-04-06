const mongoose = require("mongoose");

//comment - text, author

const commentSchema = new mongoose.Schema({
    text: String,
    author: String
});

module.exports =  mongoose.model("Comment", commentSchema);

