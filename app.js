// Mini socket server to interact with the chrome extension


require('dotenv').config()
var express = require("express");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
var app = express()
var http = require("http").Server(app);
var io = require('socket.io')(http);
var path = require('path');
const User = require("./user");
const nodemailer = require("nodemailer")
const port = process.env.PORT || 3000;

// Dummy User Data
var decoy_one = {
  name: "Rinni Swift",
  github_handle: "RinniSwift",
  email_address: process.env.RINNI_EMAIL
};

var decoy_two = {
  name: "Medi Assumani",
  github_handle: "MediBoss",
  email_address: process.env.MEDI_EMAIL
}

var decoy_three = {
  name: "Noah WoodWard",
  github_handle: "woodward4422",
  email_address: process.env.NOAH_EMAIL
};

var current_user = {
  name: "Medi Assumani",
  github_handle: "MediBoss",
  email_address: process.env.MEDI_EMAIL
};

app.use(express.static("public"));

mongoose.connect('mongodb://localhost/gitviwr', {useNewUrlParser: true});

io.on('connection', function(socket){
  //User.findByID
  socket.on("github event", function(data){
    if (typeof data != 'undefined'){
      console.log("Profile viewed : "+ data)
      main(data)
    }

  });
});

function matchHandleWithUser(github_handle){
  if (decoy_one.github_handle == github_handle){
    return decoy_one.email_address;

  } else if (decoy_two.github_handle == github_handle){

    return decoy_two.email_address;
  } else if (decoy_three.github_handle == github_handle){

    return decoy_three.email_address;
  }
}

// async..await is not allowed in global scope, must use a wrapper
async function main(github_handle){

  var target_email = matchHandleWithUser(github_handle)
  console.log("Email fetched : " + target_email);
  console.log(process.env.GITVIWR_ACCOUNT_EMAIL)

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

  console.log("Message sent: %s", info.messageId);

}

// SERVER BOOTING UP
http.listen(port);
