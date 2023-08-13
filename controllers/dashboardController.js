const express = require('express');
const router = express.Router();
const db = require('../models');


router.get('/dashboard', (req, res) => {
  if (!req.user) {
    return res.redirect('/login'); 
  }

  db.Post.findAll({
    where: {
      UserId: req.user.id,
    },
    include: [db.User],
    order: [['createdAt', 'DESC']],
  })
    .then((posts) => {
      res.render('dashboard', { posts, user: req.user });
    })
    .catch((err) => {
      console.error(err);
      res.status(500).render('error');
    });
});

router.get('/new', (req, res) => {
  if (!req.user) {
    return res.redirect('/login'); 
  }

  res.render('new-post', { user: req.user });
});

router.post('/new', (req, res) => {
  if (!req.user) {
    return res.redirect('/login'); 
  }

  db.Post.create({
    title: req.body.title,
    content: req.body.content,
    UserId: req.user.id,
  })
    .then(() => {
      res.redirect('/dashboard'); 
    })
    .catch((err) => {
      console.error(err);
      res.status(500).render('error'); 
    });
});


module.exports = router;
