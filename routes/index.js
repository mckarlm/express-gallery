// LIBRARIES/PACKAGES
const express = require('express');
const bcrypt = require('bcrypt');
const passport = require('passport');
const LocalStrategy = require('passport-local');

// OWN CODE
const gallery = require('./gallery');
const User = require('../db/models/User');
const auth = require('../extra/auth');

// VARIABLES
const saltRounds = 12;
const router = express.Router();

// sort later
router.use('/gallery', gallery);

// ROUTES
// router.route('/')
//   .get((req, res) => {
//   console.log('??????')
//   console.log({user: req.user});
//   console.log('???')
//   res.render('pages/absoluteRoot', {user: req.user});
// })

router.route('/new')
  .get((req, res) => {
    return res.render('pages/getNew');
  });

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


module.exports = router;