const express = require('express');
const upload = require('express-fileupload');
const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const axios = require('axios');
const ejs = require('ejs');
const _ = require('lodash')
var Schema = mongoose.Schema;
// Make a request for a user with a given ID

var app = express();

app.use(express.static("public/css"));
app.use(express.static("public/js"));
app.set('view engine', 'ejs');

mongoose.connect('mongodb://localhost:27017/beachhack2', { useNewUrlParser: true });
//joining path of directory 

app.use(upload()); // configure middleware
app.use(bodyParser.urlencoded({ extended: false }));

const cropSchema = new Schema({ crop_type: { type: String, unique: true }, market_value: Number, fertilizers: [{ type: String }] })

const Crop = mongoose.model('Crop', cropSchema);

app.get('/', function (req, res) {
  res.render('index');
});

app.post("/", function (req, res) {
  // console.log(req.body);
  const cropType = req.body['crop-type'];
  const marketValue = req.body['market-value'];
  const fertilizers = req.body['fertilizers'];
  const fertilizersArray = _.split(fertilizers, " ");
  console.log(fertilizersArray);
  const cropData = new Crop({ crop_type: cropType, market_value: marketValue, fertilizers: fertilizersArray });
  cropData.save().then(() => console.log("Crop data was successfully written")).catch(()=>{
    console.log("Unable to save the files");
    Crop.findOneAndUpdate({ crop_type: cropType }, { $set: { market_value: marketValue }, $set: { fertilizers: fertilizersArray }} ,{ new: true }, (err) => console.log("Data was updated",err))
  });

    // try {
  // } catch{
  //   cropData.findOneAndUpdate({ crop_type: cropType }, { crop_type: cropType, market_value: marketValue, fertilzers: fertilizersArray }, options, () => console.log("Data was updated"))
  // }
});

app.listen(4000, () => console.log(`Example app listening on port 4000!`));