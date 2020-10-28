var router = global.router;
let Notification = require('../models/Notification');
let Like = require('../models/Like');
let Post = require('../models/Post');
var mongoose = require('mongoose');

router.get('/list_all_notification', (request, response) => {
  Notification.find({}).limit(100).sort({ user: 1 }).select({
    author: 1,
    user: 1,
    post: 1,
    like: 1,
    follow: 1,
    comment: 1,
    seen: 1,
    createdAt: 1,
    updatedAt: 1
  }).exec((err, notifications) => {
    if (err) {
      response.json({
        result: "failed",
        data: [],
        messege: `Error is : ${err}`
      });
    } else {
      let dataArr = []
      notifications.map((item, index) => {
        let notificationsId = item.like
        Like.findOne({ _id: notificationsId }).limit(100).sort({ user: 1 }).select({
          user: 1,
          post: 1,
        }).exec((err, like) => {
          if (like && like._id) {
            let likeId = like.post
            Post.findOne({ _id: likeId }).limit(100).sort({}).select({
              image: 1,
            }).exec((err, post) => {
              like['post'] = post
              item['like'] = like;
              dataArr.push(item)
              if (dataArr.length == notifications.length) {
                response.json({
                  result: "ok",
                  data: {
                    getUserNotifications: {
                      count: `${notifications.length}`,
                      notifications: dataArr,
                      __typename: "NotificationsPayload"
                    }
                  },
                  messege: "Query room successfully"
                });
              }
            })
          } else {
            dataArr.push(item)
            if (dataArr.length == notifications.length) {
              response.json({
                result: "ok",
                data: {
                  getUserNotifications: {
                    count: `${notifications.length}`,
                    notifications: dataArr,
                    __typename: "NotificationsPayload"
                  }
                },
                messege: "Query room successfully"
              });
            }
          }
        })
      })
    }
  });
});
router.post('/create_notification', (request, response) => {
  const newFollow = new Notification({
    author: request.body.author,
    user: request.body.user,
    post: request.body.post,
    like: request.body.like,
    follow: request.body.follow,
    comment: request.body.comment,
    seen: request.body.seen,
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
          author: request.body.author,
          user: request.body.user,
          post: request.body.post,
          like: request.body.like,
          follow: request.body.follow,
          comment: request.body.comment,
          seen: request.body.seen,
          messege: "Create room successfully"
        }
      });
    }
  });
});
module.exports = router;