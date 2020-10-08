var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ChatUserToUserSchema = new Schema({
    username: {
        type: String,
    },
    message: {
        type: String,
    },
    created_date: {
        type: String,
    },
    usernamefriend: {
        type: String,
    }
});

module.exports = mongoose.model('ChatUserToUser', ChatUserToUserSchema);