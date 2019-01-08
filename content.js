
// Returns the github handle of the visited gihub pages
(function () {
  var user_url = window.location.pathname.split('/');
  const user_github_handle = user_url[1];
  console.log(user_github_handle);
}());
