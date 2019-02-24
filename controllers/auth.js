//-----------------------------------------------
// Middleware to handle the Authentifacation Flow
//------------------------------------------------

const app = require('express')
const router = app.Router()
const User = require('../models/user')
const jwt = require("jsonwebtoken")
const superagent = require("superagent")
const cookieParser = require("cookie-parser")

// Endpoint to login with Github SDK
router.get("/user/signin/callback", (request, response) =>{

  const code = request.param('code')
  // Make a POST request to Github API to retrieve the token
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
       response.cookie("gvToken", github_token, { maxAge: 900000 })
       if (github_token !== undefined) {
         // Make a GET request to Github API with the token to grabe the user object
         superagent
           .get('https://api.github.com/user')
           .set('Authorization', 'token ' + github_token)
           .then(result => {

             // Save the retrieved user in the DB for future actions
             const user = new User(result.body)
             user.save().then( (savedUser) => {
               response.redirect("https://www.google.com")
             })
             .catch( (error) => {
               return response.status(400).send({ err: error })
             })
         }).catch( (error) => {
           return response.status(400).send({ err: error })
         })
     }
    }).catch( (error) => {
      console.log(error.message);
    })
})

// Endppoint to sign out the user
router.get('/logout', function(request, response){
  response.clearCookie('gvToken')
  response.redirect("https://www.google.com")
})
module.exports = router
