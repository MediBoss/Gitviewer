//  The User model

const mongoose = require("mongoose");

module.exports = mongoose.model('User', {
  first_name: String,
  last_name: String,
  email_address: String,
  github_handle: String
});
