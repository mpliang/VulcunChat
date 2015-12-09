var mongoose = require('mongoose');

var UserSchema = new mongoose.Schema({
  full_name: String,
  email: String,
  city: String
});

var User = mongoose.model('User', UserSchema);

module.exports = User;
