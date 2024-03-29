const express = require('express');
const router = express.Router();

const auth = require('./helpers/auth');
const Room = require('../models/room');
const posts = require('./posts');

const Post = require('../models/post');

// Rooms index
router.get('/', (req, res, next) => {
  Room.find({}, function(err, rooms) { 
    if(err) {
      console.error(err);
    } else {
      var database=[];
      for(var i=0;i<rooms.length;i++)
      {
          database[i]=rooms[i].toObject();
      }
      res.render('rooms/index', { rooms: database });
    }
  });
});

// Rooms new
router.get('/new', auth.requireLogin, (req, res, next) => {
    res.render('rooms/new');
});

// Rooms show
router.get('/:id', auth.requireLogin, (req, res, next) => {
  Room.findById(req.params.id, function(err, room) {
    if(err) { console.error(err) };
    //room = room.toObject();
    Post.find({ room: room }).sort({ points: -1 }).populate('comments').exec(function(err, posts) {
      if(err) { console.error(err) };
      var database=[];
      for(var i=0;i<posts.length;i++)
      {
          database[i]=posts[i].toObject();
      }
      res.render('rooms/show', { room: room, posts: database, roomId:req.params.id });
    })
  });
});

/*
router.get('/:id', auth.requireLogin, (req, res, next) => {
  Room.findById(req.params.id, function(err, room) {
    if(err) { console.error(err) };

    Post.find({ room: room }).populate('comments').exec(function(err, posts) {
      if(err) { console.error(err) };

      res.render('rooms/show', { room: room, posts: posts, roomId: req.params.id });
    });
  });
});
*/

// Rooms edit
router.get('/:id/edit', auth.requireLogin, (req, res, next) => {
  Room.findById(req.params.id, function(err, room) {
    if(err) { console.error(err) };

    res.render('rooms/edit', { room: room });
  });
});

// Rooms create
router.post('/', auth.requireLogin, (req, res, next) => {
  let room = new Room(req.body);

  room.save(function(err, room) {
    if(err) { console.error(err) };

    return res.redirect('/rooms');
  });
});

// Rooms update
router.post('/:id', auth.requireLogin, (req, res, next) => {
  Room.findByIdAndUpdate(req.params.id, req.body, function(err, room) {
    if(err) { console.error(err) };

    res.redirect('/rooms/' + req.params.id);
  });
});

router.use('/:roomId/posts', posts)

module.exports = router;