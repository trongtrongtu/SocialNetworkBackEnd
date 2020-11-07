var router = global.router;
let Post = require('../models/Post');
let Like = require('../models/Like');
let Follow = require('../models/Follow');
let Comment = require('../models/Comment');
const User = require('../models/User');
var mongoose = require('mongoose');

router.get('/list_all_post', (request, response) => {
  Post.find({}).limit(100).sort({ name: 1 }).select({
    title: 1,
    image: 1,
    imagePublicId: 1,
    author: 1,
    likes: 1,
    comments: 1,
    createdAt: 1,
    updatedAt: 1
  }).exec((err, postArr) => {
    if (err) {
      response.json({
        result: "failed",
        data: [],
        messege: `Error is : ${err}`
      });
    } else {
      let dataArr = []
      if (postArr && postArr.length > 0) {
        postArr.map((item, index) => {
          let likeItem = []
          let commentItem = []
          let userId = item.author
          User.findOne({ _id: userId }).limit(100).sort({}).select({
            fullName: 1,
            username: 1,
            image: 1,
          }).exec((err, user) => {
            item['author'] = user;
            let likeArr = item.likes
            likeArr.map((item1, index1) => {
              Like.findOne({ _id: item1 }).limit(100).sort({ user: 1 }).select({
                user: 1,
                post: 1,
              }).exec((err, like) => {
                likeItem.push(like)
                if (likeItem.length == likeArr.length) {
                  let commentsArr = item.comments
                  commentsArr.map((item2, index2) => {
                    Comment.findOne({ _id: item2 }).limit(100).sort({ user: 1 }).select({
                      comment: 1,
                      post: 1,
                      author: 1,
                    }).exec((err, comments) => {
                      let userId = comments.author
                      User.findOne({ _id: userId }).limit(100).sort({}).select({
                        fullName: 1,
                        username: 1,
                        image: 1,
                      }).exec((err, user) => {
                        comments['author'] = user
                        commentItem.push(comments)
                        if (commentItem.length == commentsArr.length) {
                          item['likes'] = likeItem;
                          item['comments'] = commentItem;
                          dataArr.push(item)
                          if (dataArr.length == postArr.length) {
                            response.json({
                              result: "ok",
                              data: {
                                getFollowedPosts: {
                                  count: `${postArr.length}`,
                                  posts: dataArr,
                                  __typename: "PostsPayload"
                                }
                              },
                              messege: "Query room successfully"
                            });
                          }
                        }
                      })
                    })
                  })
                }
              })
            })
          })
        })
      } else {
        response.json({
          result: "ok",
          data: {
            getFollowedPosts: {
              count: `${postArr.length}`,
              posts: [],
              __typename: "PostsPayload"
            }
          },
          messege: "Query room successfully"
        });
      }
    }
  });
});

router.get('/list_all_post_user', (request, response) => {
  Post.find({ author: request.query.userId }).limit(100).sort({}).select({
    title: 1,
    image: 1,
    imagePublicId: 1,
    author: 1,
    likes: 1,
    comments: 1,
    createdAt: 1,
    updatedAt: 1
  }).exec((err, postArr) => {
    if (err) {
      response.json({
        result: "failed",
        data: [],
        messege: `Error is : ${err}`
      });
    } else {
      let dataArr = []
      if (postArr && postArr.length > 0) {
        postArr.map((item, index) => {
          let likeItem = []
          let commentItem = []
          let userId = item.author
          User.findOne({ _id: userId }).limit(100).sort({}).select({
            fullName: 1,
            username: 1,
            image: 1,
          }).exec((err, user) => {
            item['author'] = user;
            let likeArr = item.likes
            likeArr.map((item1, index1) => {
              Like.findOne({ _id: item1 }).limit(100).sort({ user: 1 }).select({
                user: 1,
                post: 1,
              }).exec((err, like) => {
                likeItem.push(like)
                if (likeItem.length == likeArr.length) {
                  let commentsArr = item.comments
                  commentsArr.map((item2, index2) => {
                    Comment.findOne({ _id: item2 }).limit(100).sort({ user: 1 }).select({
                      comment: 1,
                      post: 1,
                      author: 1,
                    }).exec((err, comments) => {
                      let userId = comments.author
                      User.findOne({ _id: userId }).limit(100).sort({}).select({
                        fullName: 1,
                        username: 1,
                        image: 1,
                      }).exec((err, user) => {
                        comments['author'] = user
                        commentItem.push(comments)
                        if (commentItem.length == commentsArr.length) {
                          item['likes'] = likeItem;
                          item['comments'] = commentItem;
                          dataArr.push(item)
                          if (dataArr.length == postArr.length) {
                            response.json({
                              result: "ok",
                              data: {
                                getUserPosts: {
                                  count: `${postArr.length}`,
                                  posts: dataArr,
                                  __typename: "UserPostsPayload"
                                }
                              },
                              messege: "Query room successfully"
                            });
                          }
                        }
                      })
                    })
                  })
                }
              })
            })
          })
        })
      } else {
        response.json({
          result: "ok",
          data: {
            getUserPosts: {
              count: `${postArr.length}`,
              posts: [],
              __typename: "UserPostsPayload"
            }
          },
          messege: "Query room successfully"
        });
      }
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
