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
const users = require('./controllers/users')
const auth = require('./controllers/auth')
const User = require('./models/user')
const superagent = require("superagent")
const mailer = require("./helpers/mailer")
const port = process.env.PORT || 3000

// SETTING MIDDLEWARES
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(users)
app.use(auth)


// Creates socket connection with the chrome extension
io.on('connection', function(socket){
  
  socket.on("github event", function(gitvierw){
    
    // chrome extension sends the handle viewed and the user who has done the viewing.
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
    mailer.emailUser(current_user, user)
    updateCountOnClient(user._id)
  } )
}

/**
 * Updates the the viewer counter of the viewed profile in the database
 * @param {*} id - The ID of the user whose profile was viewed
 * @param {*} currentCount - The current view counter of the user whose profile was viewed
 */
function updateViewerCount(id, currentCount){

  //User.updateOne({ _id: id}, {$set:{ view_count: currentCount + 1 }})
  User.updateOne(
    {_id: id},
    {$set:{ view_count: currentCount + 1 }}
  )

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
      socket.emit('count update', `${user.view_count}`)
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

// Endpoint to login with Github SDK - will be moved to its own module
app.get("/user/signin/callback", (request, response) =>{

  const code = request.param('code')
  // Make a POST request to Github API to retrieve the user's token
  superagent
    .post('https://github.com/login/oauth/access_token')
    .send({
       client_id: `${process.env.GITHUB_CLIENT_ID}`,
       client_secret: `${process.env.GITHUB_CLIENT_SECRET}`,
       code: `${code}`
     })
    .set('Accept', 'application/json')
    .then(result => {

      // Retreive the token and set it as a cookie for future requests
       let github_token = result.body.access_token
       if (github_token !== undefined) {

        // Makes a request to Github API to get back the user object after Authorizing Gitviwr.
       superagent
         .get('https://api.github.com/user')
         .set('Authorization', 'token ' + github_token)
         .then(result => {
           
           const user = new User(result.body)
           user.save().then( (savedUser) => {
              setUpCurrentUser(savedUser)
              response.redirect("https://github.com")
           })
           .catch( (error) => {
             return response.status(400).send({ err: error })
           })
       }).catch( (error) => {
        return response.status(400).send({ err: error })
       })
     }
    }).catch( (error) => {
      return response.status(400).send({ err: error })
    })
})


// SERVER BOOTING UP
http.listen(port)
module.exports = app
