//-----------------------------------------------
// Middleware to handle the Authentifacation Flow
//------------------------------------------------

const express = require('express')
const appJS = require('../app')
const router = express.Router()
const User = require('../models/user')
const superagent = require("superagent")

// // Endpoint to login with Github SDK
// router.get("/user/signin/callback", (request, response) =>{

//   const code = request.param('code')
//   // Make a POST request to Github API to retrieve the token
//   superagent
//     .post('https://github.com/login/oauth/access_token')
//     .send({
//        client_id: `${process.env.GITHUB_CLIENT_ID}`,
//        client_secret: `${process.env.GITHUB_CLIENT_SECRET}`,
//        code: `${code}`
//      })
//     .set('Accept', 'application/json')
//     .then(result => {

//       // Retreive the token and set it as a cookie for future requests
//        let github_token = result.body.access_token
//        if (github_token !== undefined) {
//        superagent
//          .get('https://api.github.com/user')
//          .set('Authorization', 'token ' + github_token)
//          .then(result => {
//            const user = new User(result.body)
//            user.save().then( (savedUser) => {
//               console.log(savedUser);
              
            
//             // TODO : Send token to chrome extension
//             //appJrS.se
//              // TODO: Create a page of confirmation to redirect users
//            })
//            .catch( (error) => {
//              console.log(error.message);
//              return response.status(400).send({ err: error })
//            })
//        }).catch( (error) => {
//          console.log(error.message);
//        })
//      }
//     }).catch( (error) => {
//       console.log(error.message);
//     })
// })

// Endppoint to sign out the user
router.get('/logout', function(request, response){
  response.clearCookie('gvToken')
  response.redirect("https://www.google.com")
})
module.exports = router
