var router = global.router;
let Post = require('../models/PostModel');
var mongoose = require('mongoose');

router.get('/list_all_post', (request, response) => {
  Post.find({}).limit(100).sort({ name: 1 }).select({
    _id: 1,
    name: 1,
    userImg: 1,
    text: 1,
    created_date: 1,
  }).exec((err, post) => {
    if (err) {
      response.json({
        result: "failed",
        data: [],
        messege: `Error is : ${err}`
      });
    } else {
      response.json({
        result: "ok",
        data: post,
        messege: "Query room successfully"
      });
    }
  });
});
router.post('/create_post', (request, response) => {
  const newRoom = new Post({
    name: request.body.name,
    userImg: request.body.userImg,
    text: request.body.text,
  });
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
          name: request.body.name,
          userImg: request.body.userImg,
          text: request.body.text,
          messege: "Create room successfully"
        }
      });
    }
  });
});
module.exports = router;
