
// Import needed modules and dependecies
require('dotenv').config()
const express = require("express")
const mongoose = require("mongoose")
const bodyParser = require('body-parser')
const cookieParser = require("cookie-parser")
const jwt = require("jsonwebtoken")
const app = express()
const http = require("http").Server(app)
const io = require('socket.io')(http)
const path = require('path')
const users = require('./controllers/users')
const checkAuth = require("./helpers/checkAuth")
const mailer = require('./helpers/mailer')
const auth = require('./controllers/auth')
const port = process.env.PORT || 3000

// SETTING UP VIEWS AND MIDDLEWARES
app.use(bodyParser.json())
app.use(cookieParser())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(checkAuth)
app.use(users)
app.use(auth)

// DATABASE SET UP & CONNECTION
const MongoClient = require('mongodb').MongoClient
const nodemailer = require('nodemailer')
const databaseName = 'gitviwrdb'
let database
let user_collection

mongoose.connect('mongodb://localhost/gitviwrdb', {useNewUrlParser: true});
MongoClient.connect(process.env.MONGODB_URI, { useNewUrlParser: true }, function(error, connected_database) {
  if(error) throw error
  // connects to the local mongodb database if no error found
  if(!error){
    // uses the users collection for CRUD operations
    database = connected_database.db(databaseName)
    user_collection = database.collection('users')
  }
})


// SOCKET LISTENING ON EVENTS FROM THE CHROME EXTENSION
io.on('connection', function(socket){
  socket.on("github event", function(github_handle){
    if (typeof github_handle != 'undefined'){
       queryUser(github_handle)
    }
  })
})

// Look up the the github_handle in the data base
function queryUser(github_handle){

  user_collection.find().toArray(function(err, result){
    result.forEach(function(object){
      // Emails the user if found in DB, also update the extension
      if(object.login == github_handle){

        updateViewerCount(object._id, object.view_count)
        mailer.emailUser(github_handle, object.email, object.name, object.view_count)
        updateCountOnClient(object._id)
      }else{
        console.log("User Not Found in DB");
        return
      }
    })
  })
}

// Update the view count of the user in the database
function updateViewerCount(id, currentCount){

  user_collection.updateOne(
    {_id: id},
    {$set:{ view_count: currentCount + 1 }}
  )
}

// Update the chrome extension label that shows the view count
function updateCountOnClient(id){

  io.on('connection', function(socket){
    user_collection.findOne({ _id: id}, (err, user) =>{
      socket.emit('count update', `${user.view_count}`)
    })
  })
}


// SERVER BOOTING UP
http.listen(port)
module.exports = app
