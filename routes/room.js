var router = global.router;
let CreateRoom = require('../models/CreateRoomModel');
let UserJoinRoom = require('../models/UserJoinRoomModel');
var mongoose = require('mongoose');

router.get('/list_all_createroom', (request, response) => {
    CreateRoom.find({}).limit(100).sort({ name: 1 }).select({
        _id: 1,
        username: 1,
        roomNameCreate: 1,
    }).exec((err, createrooms) => {
        if (err) {
            response.json({
                result: "failed",
                data: [],
                messege: `Error is : ${err}`
            });
        } else {
            response.json({
                result: "ok",
                data: createrooms,
                messege: "Query room successfully"
            });
        }
    });
});
router.get('/list_all_users_join_room', (request, response) => {  //  
    UserJoinRoom.find({}).limit(100).sort({ name: 1 }).select({
        _id: 1,
        username: 1,
        roomNameJoin: 1,
    }).exec((err, joinrooms) => {
        if (err) {
            response.json({
                result: "failed",
                data: [],
                messege: `Error is : ${err}`
            });
        } else {
            response.json({
                result: "ok",
                data: joinrooms,
                messege: "Query room successfully"
            });
        }
    });
});
router.get('/list_all_users_with_room', (request, response) => {  // tra ve toan bo user trong room
    let roomNameJoin = request.query.roomNameJoin;
    UserJoinRoom.find({ roomNameJoin }).limit(100).sort({ name: 1 }).select({
        _id: 1,
        username: 1,
        roomNameJoin: 1,
    }).exec((err, joinrooms) => {
        if (err) {
            response.json({
                result: "failed",
                data: [],
                messege: `Error is : ${err}`
            });
        } else {
            response.json({
                result: "ok",
                data: joinrooms,
                messege: "Query room successfully"
            });
        }
    });
});
router.get('/user_create_room', (request, response) => {
    let roomNameCreate = request.query.roomName;
    CreateRoom.find({ roomNameCreate }).limit(100).sort({ name: 1 }).select({
        _id: 1,
        username: 1,
        roomNameCreate: 1,
    }).exec((err, createrooms) => {
        if (err) {
            response.json({
                result: "failed",
                data: [],
                messege: `Error is : ${err}`
            });
        } else {
            response.json({
                result: "ok",
                data: createrooms,
                messege: "Query room successfully"
            });
        }
    });
});
router.get('/list_all_rooms_with_user', (request, response) => { 
    let username = request.query.username;
    UserJoinRoom.find({ username }).limit(100).sort({ name: 1 }).select({
        _id: 1,
        username: 1,
        roomNameJoin: 1,
    }).exec((err, joinrooms) => {
        if (err) {
            response.json({
                result: "failed",
                data: [],
                messege: `Error is : ${err}`
            });
        } else {
            response.json({
                result: "ok",
                data: joinrooms,
                messege: "Query room successfully"
            });
        }
    });
});

router.post('/create_room', (request, response) => {
    let roomNameCreate = request.body.roomNameCreate;
    CreateRoom.find({ roomNameCreate }).limit(100).sort({ name: 1 }).select({
        roomNameCreate: 1
    }).exec((err, createrooms) => {
        if (createrooms.length == 1) {
            count = 1;
            response.json({
                result: "failed",
                data: createrooms,
                messege: "Room already exists "
               
            });
        } else {
            const newRoom = new CreateRoom({
                username: request.body.username,
                roomNameCreate: request.body.roomNameCreate,
                passwordRoom: request.body.passwordRoom,
            });
            const joinRoom = new UserJoinRoom({
                username: request.body.username,
                roomNameJoin: request.body.roomNameCreate,
            });
            joinRoom.save();
            newRoom.save((err) => {
                debugger;
                if (err) {
                    response.json({
                        result: "failed",
                        data: {},
                        messege: `Error is : ${err}`
                    });
                } else {
                    response.json({
                        result: "ok",
                        data: {
                            username: request.body.username,
                            roomNameCreate: request.body.roomNameCreate,
                            passwordRoom: request.body.passwordRoom,
                            messege: "Create room successfully"
                        }
                    });
                }
            });
        }
    });
});
router.post('/join_room', (request, response) => {
    let roomNameCreate = request.body.roomNameJoin;
    let roomNameJoin = request.body.roomNameJoin;
    let count = 0;
    UserJoinRoom.find({ roomNameJoin }).limit(100).sort({ name: 1 }).select({
        username: 1
    }).exec((err, users) => {
        if (users.length == 0) {
            response.json({
                result: "failed_roomName",
                data: [],
                messege: "RoomName wrong"
            });
        } else {
            CreateRoom.find({ roomNameCreate }).limit(100).sort({ name: 1 }).select({
                passwordRoom: 1
            }).exec((err, password) => {
                if (password[0].passwordRoom != request.body.passwordRoom) {
                    response.json({
                        result: "failed_password",
                        data: password,
                        messege: "Password wrong"
                    });
                } else {
                    UserJoinRoom.find({ roomNameJoin }).limit(100).sort({ name: 1 }).select({
                        username: 1
                    }).exec((err, users) => {
                        for (let i = 0; i < users.length; i++) {
                            if (users[i].username == request.body.username) {
                                count = 1;
                                response.json({
                                    result: "failed_joined",
                                    data: password,
                                    messege: "User joined the room"
                                });
                            }
                        }
                        if (count == 0) {
                            const joinRoom = new UserJoinRoom({
                                username: request.body.username,
                                roomNameJoin: request.body.roomNameJoin,
                            });
                            joinRoom.save((err) => {
                                debugger;
                                if (err) {
                                    response.json({
                                        result: "failed",
                                        data: {},
                                        messege: `Error is : ${err}`
                                    });
                                } else {
                                    response.json({
                                        result: "ok",
                                        data: {
                                            username: request.body.username,
                                            roomNameJoin: request.body.roomNameJoin,
                                        },
                                        messege: "Join room successfully"
                                    });
                                }
                            });
                        }
                    });
                }
            });
        }
    });
});

module.exports = router;
