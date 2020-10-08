var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CreateRoomSchema = new Schema({
    username: {
        type: String,
    },
    roomNameCreate: {
        type: String,
    },
    passwordRoom: {
        type: String,
    },
});

module.exports = mongoose.model('CreateRoom', CreateRoomSchema);