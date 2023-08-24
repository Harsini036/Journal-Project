//jshint esversion:6
require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const _ = require("lodash");

const app = express();
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

main().catch(err => console.log(err));
 
async function main() {
  await mongoose.connect(process.env.MONGO_URI);
}
 
const homeStartingContent = "Record your thoughts, experiences, and emotions in a private, secure space. Embrace the therapeutic benefits of daily journaling and enhance self-reflection. Our intuitive interface makes journaling a breeze, allowing you to write effortlessly and create a timeline of your life's journey. Set reminders to ensure you never miss a moment. Relive your most cherished memories, track personal growth, and gain valuable insights into your life. Start your daily journaling habit today and embark on a path of self-discovery and mindfulness. Begin writing your story with us!";
const aboutContent = "Welcome to my Simple Daily Journal Website! I believe in the power of daily journaling to inspire personal growth and mindfulness. The main objective of this website is to provide a seamless and intuitive platform  to capture my thoughts, emotions, and experiences in a private and secure space. With a user-friendly interface and convenient features, it makes journaling a delightful and rewarding experience. It helps me in tracking my progress, relieve stress, or simply cherish memories. Hope that this website is designed in such a way to be my faithful companion on my journey of self-discovery. ";
const contactContent = "Hi! I am Harsini, a Under Graduate student. I have completed my UG in CS stream. Currenly undergoing Full Stack Courses. This website is built by me as part of a Web Development course from Angela Yu! Feel free to post about your daily experience here!";
// Creating a schema (similar to collection)
const postsSchema = new mongoose.Schema({
  name: String,
  content : String
});
 

const Post = mongoose.model("Post", postsSchema);
 
const post1 = new Post({
  name : "Day 1",
  content:"Hello this is my very first post in my own Journal project. Waiting for the completion of this project and show to my parents."
});

const post2 = new Post({
  name : "Day 2",
  content:"Still working on this project. Completed my styling works. Currently working on the DB part."
});

const post3 = new Post({
  name : "Day 3",
  content:"Partially completed my DB work. Hoping to complete it within today! Wish me luck!"
});

const post4 = new Post({
  name : "To complete course 4",
  content:"day 4 content"
});
//post4.save();

app.get("/",(req,res)=>{
  Post.find()
  .then(function(posts){
    if(posts.length===0){
      Post.insertMany([post1,post2,post3]).then (function () {
        console.log("Successfully saved all posts");
      }) .catch(function (err) {
        console.log(err);
      }); 
      res.redirect("/");
    }
    else{
      //res.render("list", {listTitle: day, newListItems: items});
      res.render("home",{homeStartContent : homeStartingContent, posts : posts});
    }
    //mongoose.connection.close();
    
  })
  .catch(function(err){
    console.log(err);
  });

});

app.get("/about",(req,res)=>{
    res.render("about.ejs",{aboutContent : aboutContent});
  });
  
app.get("/contact",(req,res)=>{
    res.render("contact.ejs",{contactContent : contactContent});
  });
  
app.get("/compose",(req,res)=>{
    res.render("compose.ejs");
});
  
app.post("/compose",(req,res)=>{
  const data = { title : req.body.postTitle, content : req.body.newPost};
  
  Post.findOne({name:req.body.postTitle})
  .then(postfound=>{
    
      if(!postfound && data.content.length!=0){
          console.log("Doesn't exist");
          const post = new Post({
          name : data.title,
          content : data.content
    });
        
        post.save();
        res.redirect("/");
        //res1.render("list",{listTitle:res.name,newListItems:res.items});
      }
      else{
        console.log("exist");
        console.log(res.items);
        res.redirect("/");
      }
  })
  .catch(err=>{
    console.log(err);
});
  

});

app.get("/posts/:postId",(req,res)=>{
    //var postParam = _.lowerCase(req.params.post);
       //so when postId is mentioned as a route parameter we have to search for that post and render the name and content of the post to the post page which is decidated for that post to be displayed
      var postParam = req.params.postId;
      postParam =  postParam.trim();
      console.log(postParam);
      Post.findOne({_id : postParam})
      .then(postFound=>{
    
        if(postFound){
          console.log("postfound : "+ postFound);
          res.render("post.ejs",{postData : postFound});
          res.redirect("/"+postParam);
          //res1.render("list",{listTitle:res.name,newListItems:res.items});
        }
        else{
          const error = "Post with mentioned Id doesn't exists!";
          res.render("post.ejs",{error: error});
        }
    })
    .catch(err=>{
      console.log(err);
  });
});  
   
let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}
app.listen(3000, function() {
  console.log("Server started on port 3000");
});
