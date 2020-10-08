var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ChatUserToRoomSchema = new Schema({
    username: {
        type: String,
    },
    message: {
        type: String,
    },
    created_date: {
        type: String,
    },
    roomName: {
        type: String,
    }
});

module.exports = mongoose.model('ChatUserToRoom', ChatUserToRoomSchema);