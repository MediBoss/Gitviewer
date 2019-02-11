// This controller handles the user Auth and Autorization

const app = require('express')
const router = app.Router()
const User = require('../models/user')
const jwt = require("jsonwebtoken")
const superagent = require("superagent")

// Endpoint to get the user's access token with Github SDK
router.get("/user/signin/callback", (request, response) =>{

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
       const token = result.body.access_token
       if (token !== undefined) {
       superagent
         .get('https://api.github.com/user')
         .set('Authorization', 'token ' + token)
         .then(result => {
           const user = new User(result.body)
           user.save().then( (savedUser) => {
             // TODO: PERSIST AS THE CURRENT USER
           })
           .catch( (error) => {
             console.log(error.message);
           })
       }).catch( (error) => {
         console.log(error.message);
       })
     }
    }).catch( (error) => {
      console.log(error.message);
    })
})

module.exports = router
