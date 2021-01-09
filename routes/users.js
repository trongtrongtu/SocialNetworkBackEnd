var router = global.router;
let User = require('../models/User');
var mongoose = require('mongoose');

router.get('/list_all_users_suggestions', (request, response) => {
  User.find({}).limit(100).sort({ user: 1 }).select({
    fullName: 1,
    email: 1,
    username: 1,
    image: 1,
    imagePublicId: 1,
    coverImage: 1,
    coverImagePublicId: 1,
    followers: 1,
    following: 1,
    posts: 1,
    isOnline: 1,
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
        data: { suggestPeople: follow },
        messege: "Query successfully"
      });
    }
  });
});

router.get('/profile', (request, response) => {
  let userId = request.query.userId
  User.findOne({ _id: userId }).limit(100).sort({ user: 1 }).select({
    fullName: 1,
    email: 1,
    username: 1,
    image: 1,
    imagePublicId: 1,
    coverImage: 1,
    coverImagePublicId: 1,
    followers: 1,
    following: 1,
    posts: 1,
    isOnline: 1,
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
        data: { getUser: follow },
        messege: "Query successfully"
      });
    }
  });
});

router.get('/authUser', (request, response) => {
  let userId = request.query.userId
  User.findOne({ _id: userId }).limit(100).sort({ user: 1 }).select({
    fullName: 1,
    email: 1,
    username: 1,
    image: 1,
    imagePublicId: 1,
    coverImage: 1,
    coverImagePublicId: 1,
    followers: 1,
    following: 1,
    posts: 1,
    isOnline: 1,
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
        data: { getAuthUser: follow },
        messege: "Query successfully"
      });
    }
  });
});

router.post('/sign_up', (request, response) => {
  const newUser = new User({
    fullName: request.body.fullName,
    email: request.body.email,
    username: request.body.username,
    passwordResetToken: request.body.passwordResetToken,
    passwordResetTokenExpiry: request.body.passwordResetTokenExpiry,
    password: request.body.password,
    image: request.body.image,
    imagePublicId: request.body.imagePublicId,
    coverImage: request.body.coverImage,
    coverImagePublicId: request.body.coverImagePublicId,
    isOnline: request.body.isOnline,
    messages: request.body.messages,
  });
  newUser.save((err) => {
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
          fullName: request.body.fullName,
          email: request.body.email,
          username: request.body.username,
          passwordResetToken: request.body.passwordResetToken,
          passwordResetTokenExpiry: request.body.passwordResetTokenExpiry,
          password: request.body.password,
          image: request.body.image,
          imagePublicId: request.body.imagePublicId,
          coverImage: request.body.coverImage,
          coverImagePublicId: request.body.coverImagePublicId,
          isOnline: request.body.isOnline,
          messages: request.body.messages,
          messege: "Create successfully"
        }
      });
    }
  });
});

router.get('/login', (request, response) => {
  let login = {
    username: request.query.username,
    password: request.query.password
  };
  User.find(login).limit(100).sort().select({
    username: 1,
    password: 1,
  }).exec((err, users) => {
    if (err) {
      response.json({
        result: "failed",
        data: [],
        messege: `Error is : ${err}`
      });
    } else if (users.length == 0) {
      response.json({
        result: "failed_login",
        data: users,
        messege: "Query check of login failed"
      });
    } else {
      response.json({
        result: "ok",
        data: users && users[0],
        messege: "Query check of login successfully"
      });
    }
  });
});
module.exports = router;