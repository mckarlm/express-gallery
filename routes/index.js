// LIBRARIES/PACKAGES
const express = require('express');
const bcrypt = require('bcrypt');
const passport = require('passport');

// OWN CODE
const gallery = require('./gallery');
const User = require('../db/models/User');

// VARIABLES
const saltRounds = 12;
const router = express.Router();


// sort later
router.use('/gallery', gallery);

// ROUTES
router.route('/new')
  .get((req, res)=>{
    return res.render('pages/getNew');
  });

router.route('/register')
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

router.route('/login')
  .post(passport.authenticate('local', {
    successRedirect: '/secret',
    failureRedirect: '/'
  }));

router.route('/logout')
  .get((req, res)=>{
    res.logout();
    res.sendStatus(200);
  });

function isAuthenticated(req, res, next) {
  console.log(req.isAuthenticated())
  if (req.isAuthenticated()){
    next();
  } else {
    res.redirect('/');
  };
};

router.route('/secret')
  .get(isAuthenticated, (req, res)=> {
    console.log('req.user: ', req.user);
    console.log('req.user.id: ', req.user.id);
    console.log('req.username: ', req.user.username);
    res.redirect('/');
  });

module.exports = router;