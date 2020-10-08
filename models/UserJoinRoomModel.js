var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserJoinRoomSchema = new Schema({
    username: {
        type: String,
    },
    roomNameJoin: {
        type: String,
    }
});

module.exports = mongoose.model('UserJoinRoom', UserJoinRoomSchema);