var router = global.router;
let Post = require('../models/Post');
var mongoose = require('mongoose');

router.get('/list_all_post', (request, response) => {
  Post.find({}).limit(100).sort({ name: 1 }).select({
    title: 1,
    image: 1,
    imagePublicId: 1,
    author: 1,
    likes: 1,
    comments: 1,
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
    title: request.body.title,
    image: request.body.image,
    imagePublicId: request.body.imagePublicId,
    author: request.body.author,
    likes: request.body.likes,
    comments: request.body.comments
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
          title: request.body.title,
          image: request.body.image,
          imagePublicId: request.body.imagePublicId,
          author: request.body.author,
          likes: request.body.likes,
          comments: request.body.comments,
          messege: "Create room successfully"
        }
      });
    }
  });
});
module.exports = router;
