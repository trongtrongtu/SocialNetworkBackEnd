var router = global.router;
let Post = require('../models/Post');
let Like = require('../models/Like');
let Follow = require('../models/Follow');
let Comment = require('../models/Comment');
const User = require('../models/User');
var mongoose = require('mongoose');
let fs = require('fs');
const URL = 'http://localhost:3001'

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
          if(item.image){
            item.image = `${URL}/open_image?image_name=${item.image}`
          }
          let userId = item.author
          User.findOne({ _id: userId }).limit(100).sort({}).select({
            fullName: 1,
            username: 1,
            image: 1,
          }).exec((err, user) => {
            item['author'] = user;
            if ((item.likes && (item.likes).length) > 0) {
              let likeArr = item.likes
              likeArr.map((item1, index1) => {
                Like.findOne({ _id: item1 }).limit(100).sort({ user: 1 }).select({
                  user: 1,
                  post: 1,
                }).exec((err, like) => {
                  likeItem.push(like)
                  if (likeItem.length == likeArr.length) {
                    if ((item.comments && (item.comments).length) > 0) {
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
                                  messege: "Query successfully"
                                });
                              }
                            }
                          })
                        })
                      })
                    } else {
                      item['likes'] = likeItem;
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
                          messege: "Query successfully"
                        });
                      }
                    }
                  }
                })
              })
            } else if ((item.comments && (item.comments).length) > 0) {
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
                          messege: "Query successfully"
                        });
                      }
                    }
                  })
                })
              })
            } else {
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
                  messege: "Query successfully"
                });
              }
            }
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
          messege: "Query successfully"
        });
      }
    }
  });
});

router.get('/post_detail', (request, response) => {
  Post.findOne({ _id: request.query.postId }).limit(100).sort({}).select({
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
      let likeItem = []
      let commentItem = []
      if(postArr.image){
        postArr.image = `${URL}/open_image?image_name=${postArr.image}`
      }
      let userId = postArr.author
      User.findOne({ _id: userId }).limit(100).sort({}).select({
        fullName: 1,
        username: 1,
        image: 1,
      }).exec((err, user) => {
        postArr['author'] = user;
        if ((postArr.likes && (postArr.likes).length) > 0) {
          let likeArr = postArr.likes
          likeArr.map((item1, index1) => {
            Like.findOne({ _id: item1 }).limit(100).sort({ user: 1 }).select({
              user: 1,
              post: 1,
            }).exec((err, like) => {
              likeItem.push(like)
              if (likeItem.length == likeArr.length) {
                if ((postArr.comments && (postArr.comments).length) > 0) {
                  let commentsArr = postArr.comments
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
                          postArr['likes'] = likeItem;
                          postArr['comments'] = commentItem;
                          response.json({
                            result: "ok",
                            data: {
                              getPost: postArr,
                              __typename: "PostPayload"
                            },
                            messege: "Query successfully"
                          });
                        }
                      })
                    })
                  })
                } else {
                  postArr['likes'] = likeItem;
                  response.json({
                    result: "ok",
                    data: {
                      getPost: postArr,
                      __typename: "PostPayload"
                    },
                    messege: "Query successfully"
                  });
                }
              }
            })
          })
        } else if ((postArr.comments && (postArr.comments).length) > 0) {
          let commentsArr = postArr.comments
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
                  postArr['comments'] = commentItem;
                  response.json({
                    result: "ok",
                    data: {
                      getPost: postArr,
                      __typename: "PostPayload"
                    },
                    messege: "Query successfully"
                  });
                }
              })
            })
          })
        } else {
          response.json({
            result: "ok",
            data: {
              getPost: postArr,
              __typename: "PostPayload"
            },
            messege: "Query successfully"
          });
        }
      })
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
                              messege: "Query successfully"
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
          messege: "Query successfully"
        });
      }
    }
  });
});

router.post('/create_post', (request, response, next) => {
  let formidable = require('formidable');
  // parse a file upload
  var form = new formidable.IncomingForm();
  form.uploadDir = "./uploads";
  form.keepExtensions = true;
  form.maxFieldsSize = 10 * 1024 * 1024; //10 MB
  form.multiples = true;
  form.parse(request, (err, fields, files) => {
    if (err) {
      response.json({
        result: "failed",
        data: {},
        messege: `Cannot upload images.Error is : ${err}`
      });
    }
    else {
      var arrayOfFiles = [];
      if (files[""] instanceof Array) {
        arrayOfFiles = files[""];
      } else {
        arrayOfFiles.push(files[""]);
      }

      if (arrayOfFiles.length > 0) {
        var fileNames = [];
        arrayOfFiles.forEach((eachFile) => {
          // fileNames.push(eachFile.path)
          fileNames.push(eachFile&&eachFile.path&&eachFile.path.split('/')[1]);
        });
        const newRoom = new Post({
          title: fields.title,
          image: fileNames&&fileNames[0],
          imagePublicId: fileNames&&fileNames[0]&&fileNames[0].split('.')&&(fileNames[0].split('.'))[0],
          author: fields.authorId,
          likes: [],
          comments: []
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
                title: fields.title,
                image: fileNames[0],
                imagePublicId: fileNames&&fileNames[0]&&fileNames[0].split('.')&&(fileNames[0].split('.'))[0],
                author: fields.authorId,
                likes: [],
                comments: [],
                messege: "Create successfully"
              }
            });
          }
        });
      } else {
        response.json({
          result: "failed",
          data: {},
          numberOfImages: 0,
          messege: "No images to upload !"
        });
      }
    }
  });
});

router.post('/upload_images', (request, response, next) => {
  let formidable = require('formidable');
  // parse a file upload
  var form = new formidable.IncomingForm();
  form.uploadDir = "./uploads";
  form.keepExtensions = true;
  form.maxFieldsSize = 10 * 1024 * 1024; //10 MB
  form.multiples = true;
  form.parse(request, (err, fields, files) => {
    if (err) {
      response.json({
        result: "failed",
        data: {},
        messege: `Cannot upload images.Error is : ${err}`
      });
    }

    var arrayOfFiles = [];
    if (files[""] instanceof Array) {
      arrayOfFiles = files[""];
    } else {
      arrayOfFiles.push(files[""]);
    }

    if (arrayOfFiles.length > 0) {
      var fileNames = [];
      arrayOfFiles.forEach((eachFile) => {
        // fileNames.push(eachFile.path)
        fileNames.push(eachFile.path.split('/')[1]);
      });
      response.json({
        result: "ok",
        data: fileNames,
        numberOfImages: fileNames.length,
        messege: "Upload images successfully"
      });
    } else {
      response.json({
        result: "failed",
        data: {},
        numberOfImages: 0,
        messege: "No images to upload !"
      });
    }
  });
});

router.get('/open_image', (request, response, next) => {
  let imageName = "uploads/" + request.query.image_name;
  fs.readFile(imageName, (err, imageData) => {
    if (err) {
      response.json({
        result: "failed",
        messege: `Cannot read image.Error is : ${err}`
      });
      return;
    }
    response.writeHead(200, { 'Content-Type': 'image/jpeg' });
    response.end(imageData); // Send the file data to the browser.
  });
});

module.exports = router;
