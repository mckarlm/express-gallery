// LIBRARIES/PACKAGES
const express = require('express');
const bcrypt = require('bcrypt');
const passport = require('passport');
const LocalStrategy = require('passport-local');

// OWN CODE
const gallery = require('./gallery');
const User = require('../db/models/User');

// VARIABLES
const saltRounds = 12;
const router = express.Router();

// sort later
router.use('/gallery', gallery);

// ROUTES
router.route('/')
  .get((req,res) => {
    return res.render('pages/absoluteRoot');
  })

router.route('/new')
  .get((req, res) => {
    return res.render('pages/getNew');
  });

passport.serializeUser((user, done) => {
  console.log('serializing');
  return done(null, {
    id: user.id,
    username: user.username
  });
});

passport.deserializeUser((user, done) => {
  console.log('deserializing');
  new User({ id: user.id })
    .fetch()
    .then(user => {
      user = user.toJSON();
      return done(null, {
        id: user.id,
        username: user.username
      });
    })
    .catch(err => {
      console.log(err);
      return done(err);
    });
});

passport.use(new LocalStrategy(function (username, password, done) {
  return new User({ username: username })
    .fetch()
    .then(user => {
      user = user.toJSON();
      console.log(user);
      if (user === null) {
        return done(null, false, { message: 'Wrong Username and/or Password' });
      } else {
        console.log(password, user.password);
        bcrypt.compare(password, user.password)
          .then(samePassword => {
            if (samePassword) {
              console.log(samePassword);
              return done(null, user);
            } else {
              return done(null, false, { message: 'Wrong Username and/or Password' });
            };
          });
      };
    })
    .catch(err => {
      console.log('error: ', err);
      return done(err);
    });
}));

router.route('/register')
  .get((req, res) => {
    res.render('pages/getRegister');
  })
  .post((req, res) => {
  bcrypt.genSalt(saltRounds, (err, salt) => {
    if (err) {
      return res.status(500);
    }
    bcrypt.hash(req.body.password, salt, (err, hashedPassword) => {
      if (err) {
        return res.status(500);
      }
      return new User({
        username: req.body.username,
        password: hashedPassword,
        email: req.body.email,
        full_name: req.body.full_name
      })
        .save()
        .then(user => {
          console.log(user);
          res.redirect('/');
        })
        .catch(err => {
          console.log(err);
          return res.send('Unable to register, please try again.');
        });
    });
  });
});

router.route('/login/forgotpassword')
  .get((req, res)=>{
    res.render('pages/getForgotPassword');
  })

router.route('/login')
  .get((req, res)=>{
    res.render('pages/getLogin');
  })
  .post(passport.authenticate('local', {
  successRedirect: '/secret',
  failureRedirect: '/'
}));


router.route('/logout')
  .get((req, res) => {
  req.logout();
  res.sendStatus(200);
});

function isAuthenticated(req, res, next) {
  // console.log(req.isAuthenticated());
  if (req.isAuthenticated()) {
    next();
  } else {
    res.redirect('/');
  };
};

router.route('/secret')
  .get(isAuthenticated, (req, res) => {
  console.log('req.user: ', req.user);
  console.log('req.user.id: ', req.user.id);
  console.log('req.username: ', req.user.username);
  console.log('HELP ME')
  res.send('SCRUB');
});

module.exports = router;