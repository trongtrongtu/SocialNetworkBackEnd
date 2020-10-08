const express = require('express');
const app = express();
const _findIndex = require('lodash/findIndex') // npm install lodash --save
const _map = require('lodash/map');
const server = require('http').Server(app);
let ChatUserToRoom = require('./models/ChatUserToRoomModel');
let ChatUserToUser = require('./models/ChatUserToUserModel')
const port = (process.env.OPENSHIFT_NODEJS_PORT || process.env.PORT || 3001);
const io = require('socket.io')(server);
server.listen(port, () => console.log('Server running in port ' + port));

var cors = require('cors');
var index = require('./routes/index');
var users = require('./routes/users');
var room = require('./routes/room');
var message = require('./routes/message');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

let userOnline = []; //danh sách user dang online
const messages = [];
const messagesFriend = [];
let roomName = '';
let count = 0;
let ids = _map(messages, 'id');
let max = Math.max(...ids);
/**
 * Connect DB:
 Step 1:
 -Mở mogoDB:
 mongo --port 27017

 -Tạo Database có tên DBReact trong robo3t sau đó sử dụng câu lệnh:
 use DBReact

 -Sau đó tiếp tục dùng câu lệnh để tạo user và password:
 db.createUser({
   user: "admin",
   pwd: "admin",
   roles: [ "readWrite", "dbAdmin", "dbOwner" ]
 })

 Step 2:
 -Kết nối mongdDB:

 mongo --port 27017 -u "admin" -p "admin" --authenticationDatabase "DBReact"

-Kết nối thành công sẽ hiển thị trên terminal "connect DB successfully"
 */
var mongoose = require('mongoose');
let options = {
    db: { native_parser: true },
    server: { poolSize: 5 },
    user: 'admin',
    pass: 'admin'
};

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/DBReact').then(
    () => {
        console.log("connect DB successfully");
    },
    err => {
        console.log('Connection failed. Error:' + err);
    }
);

io.on('connection', function (socket) {
    console.log(socket.id + ': connected');
    //lắng nghe khi người dùng thoát
    socket.on('disconnect', function () {
        console.log(socket.id + ': disconnected')
        $index = _findIndex(userOnline, ['id', socket.id]);
        userOnline.splice($index, 1);
        io.sockets.emit('updateUesrList', userOnline);
    })
    //lắng nghe khi có người gửi tin nhắn
    socket.on('newMessage', data => {
        messages.push({
            id: max + 1,
            userId: data.user.id,
            message: data.data,
            userName: data.user.name,
            time: data.timeM
        })
        let chatMessage = new ChatUserToRoom({
            username: data.user.name,
            message: data.data,
            created_date: data.timeM,
            roomName: data.roomName
        });
        chatMessage.save();
        //gửi lại tin nhắn cho tất cả các user dang online
        io.sockets.emit('newMessage', {
            data: data.data,
            user: data.user,
            timeM: data.timeM,
            roomName: data.roomName
        });
    })
    socket.on('newMessageFriend', data => {
        messagesFriend.push({
            id: max + 1,
            userId: data.user.id,
            message: data.data,
            userName: data.user.name,
            time: data.timeM
        })
        let chatMessage = new ChatUserToUser({
            username: data.user.name,
            message: data.data,
            created_date: data.timeM,
            usernamefriend: data.usernamefriend
        });
        chatMessage.save();
        //gửi lại tin nhắn cho tất cả các user dang online
        io.sockets.emit('newMessageFriend', {
            data: data.data,
            user: data.user,
            timeM: data.timeM,
            usernamefriend: data.usernamefriend
        });
    })
    socket.on('createRoom', data => {
        roomName = data.room
    })
    //lắng nghe khi có người login
    socket.on('login', data => {
        // kiểm tra xem tên đã tồn tại hay chưa
        if (userOnline.indexOf(data) >= 0) {
            socket.emit('loginFail'); //nếu tồn tại rồi thì gửi socket fail
        } else {
            // nếu chưa tồn tại thì gửi socket login thành công
            socket.emit('loginSuccess', { data, messages });
            for (let i = 0; i < userOnline.length; i++) {
                if (userOnline[i].name == data.username) {
                    count = 1;
                    userOnline[i].id = socket.id;
                    userOnline[i].roomName = data.roomName;
                }
            }
            if (count == 0) {
                {
                    userOnline.push({
                        id: socket.id,
                        name: data.username,
                        roomName: data.roomName
                    })
                }
            }
            io.sockets.emit('updateUesrList', userOnline);// gửi danh sách user dang online
        }
        console.log(userOnline)
    })

});

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/users', users);
app.use('/room', room);
app.use('/message', message);
app.use('/', index);

app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;