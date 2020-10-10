var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PostSchema = new Schema({
  name: {
    type: String,
  },
  userImg: {
    type: String,
  },
  text: {
    type: String,
  },
  created_date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Post', PostSchema);