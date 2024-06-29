var mongoose = require('mongoose');
var plm = require('passport-local-mongoose');


mongoose.connect('mongodb://localhost/Jarvis');

var userSchema = mongoose.Schema({
  username: String,
  password: String,
  sentMsg:[{
    type:mongoose.Schema.Types.ObjectId,
    ref:"msg"
  }],
  receivedMsg:[{
    type:mongoose.Schema.Types.ObjectId,
    ref:"msg"
  }]
})

userSchema.plugin(plm);

module.exports = mongoose.model('user', userSchema);
