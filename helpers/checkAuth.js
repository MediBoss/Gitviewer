// Middleware to Authorize the user with proper token
const jwt = require('jsonwebtoken')
const superagent = require('superagent')

var checkAuth = (request, response, next) => {
  if (typeof request.cookies.gvToken === "undefined" || request.cookies.gvToken === null) {
    request.user = null;
  } else {

    var token = request.cookies.gvToken;
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
