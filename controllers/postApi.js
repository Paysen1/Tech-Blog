const express = require('express');
const router = express.Router();
const db = require('../models');


router.post('/api/posts', (req, res) => {
  if (!req.user) {
    return res.status(401).json({ error: 'You must be logged in to create a post.' });
  }

  db.Post.create({
    title: req.body.title,
    content: req.body.content,
    UserId: req.user.id,
  })
    .then((post) => {
      res.status(201).json(post);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: 'An error occurred while creating the post.' });
    });
});

router.get('/api/posts', (req, res) => {
  db.Post.findAll({
    include: [db.User], 
    order: [['createdAt', 'DESC']],
  })
    .then((posts) => {
      res.json(posts);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: 'An error occurred while retrieving posts.' });
    });
});

router.get('/api/posts/:postId', (req, res) => {
  db.Post.findOne({
    where: {
      id: req.params.postId,
    },
    include: [db.User],
  })
    .then((post) => {
      if (!post) {
        return res.status(404).json({ error: 'Post not found.' });
      }
      res.json(post);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: 'An error occurred while retrieving the post.' });
    });
});

router.put('/api/posts/:postId', (req, res) => {
  if (!req.user) {
    return res.status(401).json({ error: 'You must be logged in to update a post.' });
  }

  db.Post.update(
    {
      title: req.body.title,
      content: req.body.content,
    },
    {
      where: {
        id: req.params.postId,
        UserId: req.user.id,
      },
    }
  )
    .then((rowsUpdated) => {
      if (rowsUpdated[0] === 0) {
        return res.status(404).json({ error: 'Post not found or you do not have permission to update.' });
      }
      res.status(204).send();
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: 'An error occurred while updating the post.' });
    });
});

router.delete('/api/posts/:postId', (req, res) => {
  if (!req.user) {
    return res.status(401).json({ error: 'You must be logged in to delete a post.' });
  }

  db.Post.destroy({
    where: {
      id: req.params.postId,
      UserId: req.user.id,
    },
  })
    .then((rowsDeleted) => {
      if (rowsDeleted === 0) {
        return res.status(404).json({ error: 'Post not found or you do not have permission to delete.' });
      }
      res.status(204).send();
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: 'An error occurred while deleting the post.' });
    });
});

module.exports = router;
