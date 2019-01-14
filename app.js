// Mini socket server to interact with the chrome extension


require('dotenv').config()
var express = require("express");
const assert = require('assert');
const exphds = require("express-handlebars");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
var bodyParser = require('body-parser');
var app = express()
var http = require("http").Server(app);
var io = require('socket.io')(http);
var path = require('path');
const User = require("./user");
const nodemailer = require("nodemailer")
const port = process.env.PORT || 3000;

// DATABASE SET UP
const MongoClient = require('mongodb').MongoClient;
const URI = 'mongodb://localhost:27017';
const databaseName = 'gitviwrdb';
var database;
var user_collection;


function queryAndSendEmail(handle){

  var user_object;
  user_collection.find().toArray(function(err, result){

    result.forEach(function(object){
      if(object.github_handle == handle){
        console.log(object.github_handle)
        //emailUser(handle, object.email_address);
      }
    })
  });
}

MongoClient.connect(URI, function(error, connected_database) {
  if(error) throw error
  if(!error){

    database = connected_database.db(databaseName);
    user_collection = database.collection('users');

  };
});


var current_user = {
  name: "Medi Assumani",
  github_handle: "MediBoss",
  email_address: process.env.MEDI_EMAIL
};

app.use(express.static("public"));
mongoose.connect('mongodb://localhost/gitviwrdb', {useNewUrlParser: true});

io.on('connection', function(socket){
  //User.findByID
  socket.on("github event", function(data){
    if (typeof data != 'undefined'){
      queryAndSendEmail(data);
    }

  });
});


// // async..await is not allowed in global scope, must use a wrapper
async function emailUser(github_handle, target_email){

  console.log("Email fetched : " + target_email);

  var transporter = nodemailer.createTransport({
   service: 'gmail',
   auth: {
          user: `${process.env.GITVIWR_ACCOUNT_EMAIL}`,
          pass: `${process.env.GITVIWR_ACCOUNT_PASSWORD}`
      }
  });

  // setup email data with unicode symbols
  let mailOptions = {
    from: `${process.env.GITVIWR_ACCOUNT_EMAIL}`, // sender address
    to: target_email, // list of receivers
    subject: "Gitviwr Notification", // Subject line
    text: current_user.name+" has viewed Your Github Handle "+ github_handle
  };

  // send mail with defined transport object
  console.log("Emailing " + target_email+ "...");
  let info = await transporter.sendMail(mailOptions)

  console.log("Email sent to " + github_handle);

}

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.engine('handlebars', exphds({ defaultLayout: 'main'}));
app.set('view engine', 'handlebars');


app.get("/new-user", function(request, response){
  response.render('new-user');
});

app.post("/users", function(request, response){
  User.create(request.body)
    .then( (user) => {
      console.log(user);
    response.redirect('https://www.github.com');
    })
})

// SERVER BOOTING UP
http.listen(port);
module.exports = app;
