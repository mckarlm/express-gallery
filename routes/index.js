// LIBRARIES/PACKAGES
const express = require('express');
const bcrypt = require('bcrypt');

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
        name: req.body.name
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