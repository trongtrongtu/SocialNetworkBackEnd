var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
    username: {
        type: String,
    },
    password: {
        type: String,
    },
    dia_chi: {
        type: String,
    },
    gioi_tinh: {
        type: String,
    },
    ngay_sinh: {
        type: String,
    },
    email: {
        type: String,
    },
    sdt: {
        type: String,
    },
});

module.exports = mongoose.model('User', UserSchema);