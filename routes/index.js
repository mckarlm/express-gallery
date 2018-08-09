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
    const loginMessage = {
      message: 'Please log in.',
      login: true
    };
    const username = req.session.passport;
    console.log(req.session)
    if (!username){
      return res.render('pages/absoluteRoot', loginMessage)
    }
    return res.render('pages/absoluteRoot', username.user);
  })

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

router.route('/login/forgotpassword')
  .get((req, res)=>{
    return res.render('pages/getForgotPassword');
  })

router.route('/login/success')
  .get((req, res)=>{
    const cookie = req.session.passport.user;
    const noCookie = {
      message: 'Hey! Seems you forgot to log in!'
    }
    if (!cookie){
      res.redirect('/');
    }
    return res.render('pages/getLoginSuccess')
  })

module.exports = router;