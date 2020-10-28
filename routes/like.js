var router = global.router;
let Like = require('../models/Like');
var mongoose = require('mongoose');

router.get('/list_all_like', (request, response) => {
  Like.find({}).limit(100).sort({ user: 1 }).select({
    user: 1,
    post: 1,
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
        messege: "Query room successfully"
      });
    }
  });
});
router.post('/create_like', (request, response) => {
  const newLike = new Like({
    user: request.body.user,
    post: request.body.post,
  });
  newLike.save((err) => {
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
          user: request.body.user,
          post: request.body.post,
          messege: "Create room successfully"
        }
      });
    }
  });
});
module.exports = router;