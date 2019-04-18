//-----------------------------------------------
// Middleware to handle the Authentifacation Flow
//------------------------------------------------

const express = require('express')
const appJS = require('../app')
const router = express.Router()
const User = require('../models/user')
const superagent = require("superagent")


// Endppoint to sign out the user
router.get('/logout', function(request, response){
  response.clearCookie('gvToken')
  response.redirect("https://www.google.com")
})
module.exports = router
