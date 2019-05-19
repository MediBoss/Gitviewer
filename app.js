//--------------------------------------------------------------------
// Entry point of the socket server that supports the chrome extension
//--------------------------------------------------------------------

// Import needed modules and dependecies
require('dotenv').config()
require("./database/gitviwr-db")
const express = require("express")
const bodyParser = require('body-parser')
const app = express()
const http = require("http").Server(app)
const io = require('socket.io')(http)
const path = require("path")
const users = require('./controllers/users')
const auth = require('./controllers/auth')
const User = require('./models/user')
const mailer = require("./helpers/mailer")
const port = process.env.PORT || 3000
var clients = []
const passport = require("passport")
var GithubStrategy = require('passport-github').Strategy


// SETTING MIDDLEWARES

app.use(passport.initialize())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, 'views')))
app.use(users)
app.use(auth)

passport.use(new GithubStrategy({
  clientID: `${process.env.GITHUB_CLIENT_ID}`,
  clientSecret: `${process.env.GITHUB_CLIENT_SECRET}`,
  callbackURL: "https://gitviewerserver.herokuapp.com/user/signin/callback"
},
function(accessToken, refreshToken, profile, callback) {

  const user = new User(profile._json)
  user.save().then( (savedUser) => {

    setUpCurrentUser(savedUser)
    return callback(null, profile)

  }).catch( (error) => {
    return callback(null, error)
  })
}
))

passport.serializeUser(function(user, done) {
  // placeholder for custom user serialization
  // null is for errors
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  // placeholder for custom user deserialization.
  // maybe you are going to get the user from mongo by id?
  // null is for errors
  done(null, user);
});

// Creates socket connection with the chrome extension
io.on('connection', function(socket){
  
  //clients.push(socket.id)
  socket.on("github event", function(gitvierw){
    //console.log(`RECEIVE FROM : ${socket.id}`)
    
  //  // chrome extension sends the handle viewed and the user who has done the viewing.
    if (typeof gitvierw != 'undefined' && gitvierw != null && gitvierw.viewed !== 'settings'){
       queryUser(gitvierw.viewed, gitvierw.viewer)
    }
  })
})

/**
 * Looks up the viewed github handle in the data base
 * @param {*} viewed_handle - the github handle that has been viewed 
 * @param {*} current_user - the user who has viewed a specific github handle
 */
function queryUser(viewed_handle, current_user){

  User.findOne( {login: viewed_handle}, function(err, user) {
    
    // Do nothing if the user with that handle is not found in the data base
    if(err || user == null){
      return 
    }
  
    
    // Update the amount of views of the user with that github handle
    updateViewerCount(user._id, user.view_count)
    updateCountOnClient(user._id)
    mailer.emailUser(current_user, user)
  } )
}

/**
 * Updates the the viewer counter of the viewed profile in the database
 * @param {*} id - The ID of the user whose profile was viewed
 * @param {*} currentCount - The current view counter of the user whose profile was viewed
 */
function updateViewerCount(id, currentCount){

  User.findOneAndUpdate({ _id: id}, {$set:{view_count: currentCount + 1}}, (err, user) => {
    if (err) {
      console.log("something went wrong")
    }
  })
}

/**
 *  Updates the chrome extension label that shows the amount of views a user has.
 * @param {*} id - The ID of the user whose profile was viewed
 */ 
function updateCountOnClient(id){
  
  io.on('connection', function(socket){

    User.findOne({ _id: id}, (err, user) =>{
      io.to(`${socket.id}`).emit('count update', `${user.view_count}`)
    })
  })
}
/**
 * Sends the chrome extension the user who has signed-in via Github OAuth to be cached.
 * @param {*} user - the user who has signed-in via Github Auth.
 */
function setUpCurrentUser(user){

  io.on('connection', function(socket){
    socket.emit(`current user`, `${user.login}`)
  })
}

app.get("/error", (request, response) => {
  response.send("Oops an error happend while authenticating your account. Email me at mediassumani49@gmail.com and I will take a look at the issue and get back to you.")
})

app.get("/success", (request, response) => {
  response.sendFile(path.join(__dirname+'/views'+'/logged-in.html'))
})

app.get("/logout", (request, response) => {
  response.send('successfully logged out')
})

// Endpoint to login with Github SDK - will be moved to its own module
app.get("/user/signin/callback", passport.authenticate('github', { failureRedirect: '/error' }),
  function(req, res) {
    res.redirect("/success")
  }
)

// SERVER BOOTING UP
http.listen(port)
module.exports = app
