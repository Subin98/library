const express = require("express");
const mongoose = require("mongoose");
const users = require("./src/models/usermodel");
const books = require("./src/models/booksmodel");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const path = require('path');


//port
const port = 3000;
const APP = express();

//connection to server
APP.listen(process.env.PORT || port,(err)=>{
    if(err)
        console.log(er);
    else
        console.log("Connected to server on port "+port);
})

//Express Middlewares
APP.use(express.json());
APP.use(express.urlencoded({extended:true}));
APP.use(cors());
APP.use(express.static('./dist/frontend'));

APP.get('/*', function(req, res) {
    res.sendFile(path.join(__dirname + '/dist//frontend/index.html'));
   });
   

function verifyToken(req,res,next)
{
    if(!req.headers.authorization)
    {
        return res.status(401).send("UnAuthorized Request")

    }
    let token = req.headers.authorization.split(' ')[1];
    if(token === "null")
    {
        return res.status(401).send("UnAuthorized Request")
    }
    let payload = jwt.verify(token,"secretkey")
    if(!payload)
    {   
        return res.status(401).send("UnAuthorized Request");
        
    }
    req.userId = payload.subject;
    console.log(req.userId);
    next();

}

//connection to MongoDB using mongoose
var Mdatabase = "mongodb+srv://admin:admin123@cluster0.ljfzfhr.mongodb.net/library";

const Mongodb = "mongodb://localhost:27017/library";
mongoose.connect(Mdatabase || Mongodb,{useNewUrlParser:true});
const db = mongoose.connection;
db.on('error',console.error.bind(console,"connection error"));
db.once('open',()=>{
    console.log("connected to Mongodb");
});

// Routing and controllers

//users
APP.route("/api/adduser")
.post((req,res)=>{
 res.header("Access-Control-Allow-Origin","*");
 res.header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, PATCH");
var user ={
    userName: req.body.User.userName,
    password: req.body.User.password
}    
console.log(user)
var user = new users(user);
user.save();
})
.get((req,res)=>{
    res.send("Hello")
})

APP.route("/api/users")
.get((req,res)=>{
 res.header("Access-Control-Allow-Origin","*");
 res.header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, PATCH");
users.find({},{_id:0,userName:1})
.then(data=>{
    res.send(data);
})
});

APP.route("/api/loginuser")
.post((req,res)=>{
    res.header("Access-Control-Allow-Origin","*");
    res.header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, PATCH");
    let name = req.body.User.userName;
    let password = req.body.User.password;
    users.findOne({userName:req.body.User.userName, password:req.body.User.password},(err,user)=>{
        if(err)
        console.log(err)
        if(user)
        {
            let payload = {subject:name+password};
            let token = jwt.sign(payload,"secretkey");
            console.log(token);
            res.status(200).send({token});
        }
        
        else
        res.status(401).json({
            message:"Invalid credentials"
        });

    });
})

//books
APP.route("/api/addbooks")
.post(verifyToken,(req,res)=>{
 res.header("Access-Control-Allow-Origin","*");
 res.header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, PATCH");
var book = {
    authorName: req.body.Book.authorName,
    authorImg:req.body.Book.authorImg,
    bookName: req.body.Book.bookName,
    bookImg: req.body.Book.bookImg,
    bookContent:req.body.Book.bookContent
}
var book = new books(book);
book.save((err,data)=>{
    if(err)
    console.log(err)
    else
    res.send(data)
});
});

APP.route("/api/books")
.get(verifyToken,(req,res)=>{
 res.header("Access-Control-Allow-Origin","*");
 res.header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, PATCH");
 books.find({},(err,books)=>{
    if(err)
    console.log(err)
    else
    {
        res.status(201).send(books);

    }

 })
});

APP.route("/api/book/:id")
.get(verifyToken,(req,res)=>{
 res.header("Access-Control-Allow-Origin","*");
 res.header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, PATCH");
 let bookid = req.params.id;
 books.findOne({"_id":bookid},(err,book)=>{
    if(err)
    console.log(err)
    else
    {
        res.status(201).send(book);
    }
    

 })
});

APP.route("/api/update-book")
.put(verifyToken,(req,res)=>{
 res.header("Access-Control-Allow-Origin","*");
 res.header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, PATCH");
 var bookid = req.body.BookID;
 var book ={
    authorName: req.body.Book.authorName,
    authorImg:req.body.Book.authorImg,
    bookName: req.body.Book.bookName,
    bookImg: req.body.Book.bookImg,
    bookContent:req.body.Book.bookContent
 }
 books.findByIdAndUpdate({"_id":bookid},{$set:book},(err,data)=>{
if(err)
console.log(err)
else
res.send(data);
 })
});


APP.route("/api/delete-book/:id")
.delete(verifyToken,(req,res)=>{
 res.header("Access-Control-Allow-Origin","*");
 res.header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, PATCH");
 let bookid = req.params.id;
 books.findOneAndDelete({"_id":bookid},(err,book)=>{
    if(err)
    console.log(err)
    else
    {
        res.send(book);
    }
    

 })
});
