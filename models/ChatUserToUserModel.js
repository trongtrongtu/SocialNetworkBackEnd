var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ChatUserToUserSchema = new Schema({
    user: {
        type: String,
    },
    data: {
        type: String,
    },
    time: {
        type: String,
    },
    usernamefriend: {
        type: String,
    },
    image: {
        type: String,
    },
    key: {
        type: String,
    },
});

module.exports = mongoose.model('ChatUserToUser', ChatUserToUserSchema);