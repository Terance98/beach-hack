const express = require('express');
const upload = require('express-fileupload');
const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const axios = require('axios');
const ejs = require('ejs');
const _ = require('lodash')
const session = require('express-session');
var Schema = mongoose.Schema;
// Make a request for a user with a given ID

var app = express();

app.use(express.static("public/css"));
app.use(express.static("public/js"));
app.set('view engine', 'ejs');
app.use(session({
  secret: "Our little secret.",
  resave: false,
  saveUninitialized: false
}));

mongoose.connect('mongodb://localhost:27017/beachhack2', { useNewUrlParser: true });
//joining path of directory 

app.use(upload()); // configure middleware
app.use(bodyParser.urlencoded({ extended: false }));

const cropSchema = new Schema({ crop_type: { type: String, unique: true }, market_value: Number, fertilizers: [{ type: String }] })
const userSchema = new Schema({email: String, password: String})

const Crop = mongoose.model('Crop', cropSchema);
const User = mongoose.model('User', userSchema);

app.get("/", function(req,res){
  // req.session.signInStatus = false
  if(req.session.signInStatus){
    res.render('index');
  }else{
    res.redirect("/login");
  }
});

app.get('/cropInfo', function (req, res) {
  res.render('cropInfo');
});

app.post("/cropInfo", function (req, res) {
  const cropType = req.body['crop-type'];
  const marketValue = req.body['market-value'];
  const fertilizers = req.body['fertilizers'];
  const fertilizersArray = _.split(fertilizers, " ");
  console.log(fertilizersArray);
  const cropData = new Crop({ crop_type: cropType, market_value: marketValue, fertilizers: fertilizersArray });
  cropData.save().then(() => console.log("Crop data was successfully written")).catch(()=>{
    console.log("Unable to save the files");
    Crop.findOneAndUpdate({ crop_type: cropType }, { $set: { market_value: marketValue }, $set: { fertilizers: fertilizersArray }} ,{ new: true }, (err) => console.log("Data was updated"));
  });
});

app.get("/login", function(req,res){
  res.render('login');
});

app.post("/login", function(req,res){
  const email = req.body.email;
  const password = req.body.password;

  User.findOne({email:email,password:password}, function(err,obj){
    console.log(obj);
    req.session.signInStatus = true
    res.redirect("/");
  });
});


app.get("/signup", function(req,res){
  res.render("signup");
});


app.post("/signup", function (req, res) {
  const email = req.body.email;
  const password = req.body.password;

  const userData = new User({ email: email, password: password });
  userData.save().then(() => console.log("User is created!"));
  res.redirect("/");
});

app.get("/map", function(req,res){
  // res.render('map');
  res.sendFile('/home/terance/Desktop/beach-hack/maps.html');
});

// app.post("/cropInfo", (req,res) => {
//   const cropType = req.body['crop-type'];
//   console.log(cropType);
//   Crop.findOne({crop_type: cropType}, function(err, obj){
//     res.json(obj);
//   })
// });

app.listen(4000, () => console.log(`Example app listening on port 4000!`));