// This controller handles the user Auth and Autorization

const app = require('express')
const router = app.Router()
const User = require('../models/user')
const jwt = require("jsonwebtoken")


router.post("/user/signin", (request, response) =>{
  // Add Auth with Github API
})
