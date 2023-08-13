const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const db = require('../models');
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  db.User.findByPk(id)
    .then((user) => {
      done(null, user);
    })
    .catch((err) => {
      done(err, null);
    });
});

passport.use(
  new LocalStrategy(
    {
      usernameField: 'username', 
      passwordField: 'password',
    },
    (username, password, done) => {
      db.User.findOne({
        where: {
          username: username,
        },
      }).then((user) => {
        if (!user) {
          return done(null, false, { message: 'Incorrect username.' });
        }
        if (!user.validPassword(password)) {
          return done(null, false, { message: 'Incorrect password.' });
        }
        return done(null, user);
      });
    }
  )
);

module.exports = passport;
