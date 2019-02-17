// Constantly checks if the user is Autheticated

var checkAuth = (request, response, next) => {
  console.log("checking auth");
  if (typeof request.cookies.gvToken === "undefined" || request.cookies.gvToken === null) {
    console.log("No token received");
    request.user = null;
  }

  var token = request.cookies.gvToken;
  console.log("check auth token " + token);
  console.log("checking auth");
  next();
};



//module.exports = checkAuth
