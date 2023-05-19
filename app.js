const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const _ = require('lodash');
const mongoose = require('mongoose');

mongoose.set('strictQuery', true);
mongoose.connect("mongodb://localhost:27017/blogDB");

const postSchema = new mongoose.Schema({
    title:String,
    content:String
});

const Post = mongoose.model("Post",postSchema);

const homeStartingContent = "This is the home page of the blogpost. here we can upload our daily routine  ";
const aboutContent = "This is the About page of Blogproject. Here you will get information about blogpost ";
const contactContent = "'This is the contact page of blogpost. here you will get information about us where you can contact us ";

const app = express();

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));
app.set('view engine','ejs');


app.get("/",(req, res)=>{
    Post.find({},(err,foundPost)=>{
        if(err){
            //console.log(err)
        }
        else{
            res.render("home", {homeContent : homeStartingContent, postArray:foundPost});
        }
    })

})

app.get("/about",(req,res)=>{
    res.render("about",{aContent : aboutContent})
})

app.get("/contact", (req,res)=>{
    res.render("contact",{cContent : contactContent})
})

app.get("/compose", (req,res)=>{
    res.render("compose",{})
})

app.post("/compose",(req,res)=>{
    let com = req.body.compose
    let combody = req.body.compose_body
    let post1 = new Post({
        title : com,
        content : combody
    })
    post1.save((err)=>{
        if(!err){
            res.redirect("/")
        }
    });
    
})

app.get("/posts/:_id",(req,res)=>{
      let match = (req.params._id);

      Post.find({},(err,foundPost)=>{
        foundPost.forEach((element) => {
            var storedTitle = element._id;
            if(match == storedTitle){
                res.render("post", {Title: element.title, Body: element.content})
              }
              else{
                //console.log(err);
              }
        });
    })
})

app.listen("3000",()=>{
    console.log("Server is running on port 3000");
})