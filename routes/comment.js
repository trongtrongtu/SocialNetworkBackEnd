var router = global.router;
let Comment = require('../models/Comment');
var mongoose = require('mongoose');

router.get('/list_all_comment', (request, response) => {
  Comment.find({}).limit(100).sort({ user: 1 }).select({
    comment: 1,
    post: 1,
    author: 1,
    createdAt: 1,
    updatedAt: 1
  }).exec((err, follow) => {
    if (err) {
      response.json({
        result: "failed",
        data: [],
        messege: `Error is : ${err}`
      });
    } else {
      response.json({
        result: "ok",
        data: follow,
        messege: "Query successfully"
      });
    }
  });
});
router.post('/create_comment', (request, response) => {
  const newFollow = new Comment({
    comment: request.body.comment,
    post: request.body.post,
    author: request.body.author,
  });
  newFollow.save((err) => {
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
          comment: request.body.comment,
          post: request.body.post,
          author: request.body.author,
          messege: "Create successfully"
        }
      });
    }
  });
});
module.exports = router;