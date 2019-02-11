//----------------------------------------------------------------
// This File defines the User Model and its Methods.
//----------------------------------------------------------------
var mongoose = require("mongoose");
const Schema = mongoose.Schema

const UserSchema = new Schema({
  name: String,
  login: String,
  email: String,
  view_count: Number,
  join_date: Date
})


UserSchema.pre("save", function(next){
  const now = new Date()
  this.join_date = now
  this.view_count = 0
  next();
})
module.exports = mongoose.model("User", UserSchema)
