var router = global.router;
let Follow = require('../models/Follow');
var mongoose = require('mongoose');

router.get('/list_all_follow', (request, response) => {
  Follow.find({}).limit(100).sort({ user: 1 }).select({
    user: 1,
    follower: 1,
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
router.post('/create_follow', (request, response) => {
  const newFollow = new Follow({
    user: request.body.user,
    follower: request.body.follower,
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
          user: request.body.user,
          follower: request.body.follower,
          messege: "Create room successfully"
        }
      });
    }
  });
});
module.exports = router;