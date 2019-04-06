// This controller handles the user Auth and Autorization

const express = require('express')
const rootApp = require('../app')
const router = express.Router()
const User = require('../models/user')
const superagent = require("superagent")

// Endpoint to get the user's access token with Github SDK
router.get("/user/signin/callback", (request, response) =>{
  console.log("hi");
  
  const code = request.param('code')
  superagent
    .post('https://github.com/login/oauth/access_token')
    .send({
       client_id: `${process.env.GITHUB_CLIENT_ID}`,
       client_secret: `${process.env.GITHUB_CLIENT_SECRET}`,
       code: `${code}`
     })
    .set('Accept', 'application/json')
    .then(result => {
       let github_token = result.body.access_token
       if (github_token !== undefined) {
       superagent
         .get('https://api.github.com/user')
         .set('Authorization', 'token ' + github_token)
         .then(result => {
           const user = new User(result.body)
           user.save().then( (savedUser) => {
            
            // TODO : Send token to chrome extension
              app.
             // TODO: Create a page of confirmation to redirect users
           })
           .catch( (error) => {
             console.log(error.message);
             return response.status(400).send({ err: error })
           })
       }).catch( (error) => {
         console.log(error.message);
       })
     }
    }).catch( (error) => {
      console.log(error.message);
    })
})

router.get('/logout', function(request, response){
  // TODO: Clear the cookies
  response.clearCookie('gvToken')
  // TODO: Redirect user to a different page
})
module.exports = router
