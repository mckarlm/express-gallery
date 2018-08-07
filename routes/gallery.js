const express = require('express');
const router = express.Router();
const Gallery = require('../db/models/Gallery');

router.route('/')
  .get('/', (req, res)=>{
    return Gallery
      .query('where', 'id', '>', '0')
      .fetchAll()
      .then(photos => {
        return res.json(photos);
      })
      .catch(err => {
        return res.json({message: err.message});
      });
  })

// router.route('/')

module.exports = router;