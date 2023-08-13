const express = require('express');
const router = express.Router();
const db = require('../models');

router.post('/api/comments', (req, res) => {
  if (!req.user) {
    return res.status(401).json({ error: 'You must be logged in to add a comment.' });
  }

  db.Comment.create({
    text: req.body.text,
    UserId: req.user.id, 
    PostId: req.body.postId,
  })
    .then((comment) => {
      res.status(201).json(comment);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: 'An error occurred while adding the comment.' });
    });
});

router.get('/api/comments/:postId', (req, res) => {
  db.Comment.findAll({
    where: {
      PostId: req.params.postId,
    },
    include: [db.User], 
    order: [['createdAt', 'DESC']],
  })
    .then((comments) => {
      res.json(comments);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: 'An error occurred while retrieving comments.' });
    });
});



module.exports = router;
