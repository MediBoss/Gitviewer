// Constantly checks if the user is Autheticated

const jwt = require('jsonwebtoken')
const superagent = require('superagent')

var checkAuth = (request, response, next) => {
  console.log("Authenticating User");
  if (typeof request.cookies.gvToken === "undefined" || request.cookies.gvToken === null) {
    console.log("No token received");
    request.user = null;
  } else {
    var token = request.cookies.gvToken;
    console.log("check auth token " + token);
    superagent
      .get('https://api.github.com/user')
      .set('Authorization', 'token ', + token)
      .then(result => {
        const user = new User(result.body)
        request.user = user
      }).catch( (error) => {
        return response.status(400).send({ err: error})
      })
  }
  next();
};

module.exports = checkAuth
