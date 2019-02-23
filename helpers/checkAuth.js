// Constantly checks if the user is Autheticated

const jwt = require('jsonwebtoken')
const superagent = require('superagent')
var checkAuth = (request, response, next) => {
  if (typeof request.cookies.gvToken === "undefined" || request.cookies.gvToken === null) {
    console.log("No token received");
    request.user = null;
  }

  var token = request.cookies.gvToken;
  console.log("check auth token " + token);

  next();
};

module.exports = checkAuth
