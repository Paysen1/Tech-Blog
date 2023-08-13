const express = require('express');
const router = express.Router();
const db = require('../models');


router.get('/', (req, res) => {
  db.Post.findAll({
    include: [db.User],
    order: [['createdAt', 'DESC']],
  })
    .then((posts) => {
      res.render('home', { posts, user: req.user });
    })
    .catch((err) => {
      console.error(err);
      res.status(500).render('error');
    });
});

router.get('/post/:postId', (req, res) => {
  db.Post.findOne({
    where: {
      id: req.params.postId,
    },
    include: [db.User],
  })
    .then((post) => {
      if (!post) {
        return res.status(404).render('not-found');
      }
      db.Comment.findAll({
        where: {
          PostId: post.id,
        },
        include: [db.User],
        order: [['createdAt', 'ASC']],
      }).then((comments) => {
        res.render('single-post', { post, comments, user: req.user });
      });
    })
    .catch((err) => {
      console.error(err);
      res.status(500).render('error');
    });
});


module.exports = router;
