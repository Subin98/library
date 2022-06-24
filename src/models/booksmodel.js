const mongoose = require("mongoose");

const schema = mongoose.Schema;

const BookSchema = new schema({

    authorName: String,
    authorImg:String,
    bookName: String,
    bookImg: String,
    bookContent:String,
    datePublished:{
        type: Date,
        default:Date.now
    }


});

const books = mongoose.model('books',BookSchema);
module.exports= books;