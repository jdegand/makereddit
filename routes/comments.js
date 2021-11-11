const express = require('express');
const router = express.Router({mergeParams: true});
const auth = require('./helpers/auth');
const Room = require('../models/room');
const Post = require('../models/post');
const Comment = require('../models/comment');

// Comments new
router.get('/new', auth.requireLogin, (req, res, next) => {
  Room.findById(req.params.roomId, function(err, room) {
    if(err) { console.error(err) };
      //room = room.toObject();
    Post.findById(req.params.postId, function(err, post) {
      if(err) { console.error(err) };
      //post = post.toObject();
      res.render('comments/new', { post: post, room: room });
    });
  })
});

router.post('/', auth.requireLogin, (req, res, next) => {
    Room.findById(req.params.roomId, function(err, room) {
      if(err) { console.error(err) };
      //room = room.toObject();
      Post.findById(req.params.postId, function(err, post) {
        if(err) { console.error(err) };
        //post = post.toObject();

        let comment = new Comment(req.body);
        post.comments.unshift(comment);
  
        post.save(function(err, post) {
          if(err) { console.error(err) };
  
          comment.save(function(err, comment) {
            if(err) { console.error(err) };
  
            return res.redirect(`/rooms/${room._id}`);
          });
        });
      });
    });
  });

module.exports = router;