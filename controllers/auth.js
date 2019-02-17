// This controller handles the user Auth and Autorization

const app = require('express')
const router = app.Router()
const User = require('../models/user')
const jwt = require("jsonwebtoken")
const superagent = require("superagent")
const cookieParser = require("cookier-parser")

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
       const github_token = result.body.access_token
       if (token !== undefined) {
       superagent
         .get('https://api.github.com/user')
         .set('Authorization', 'token ' + github_token)
         .then(result => {
           const user = new User(result.body)
           user.save().then( (savedUser) => {
             gitviwr_token = jwt.sign({ _id: savedUser._id}, process.env.JWT_SECRET, { expiresIn: "60 days"})
             response.cookie('gvToken', gitviwr_token, {
                makeAge: 900000,
                httpOnly: true
              })
             // TODO: Create a page of confirmation to redirect users
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
