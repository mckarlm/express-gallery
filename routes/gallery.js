const express = require('express');
const router = express.Router();
const Gallery = require('../db/models/Gallery');


// POST, GET
router.route('/')
  .post((req, res) => {
    let { author, link, description } = req.body;
    author = author.trim();
    link = link.trim();

    return new Gallery({ author, link, description })
      .save()
      .then(image => {
        return res.json(image);
      })
      .catch(err => {
        return res.json({ message: err.message });
      })
  })
  .get((req, res) => {
    return Gallery
      .query('where', 'id', '>', '0')
      .fetchAll()
      .then(images => {
        return res.json(images);
      })
      .catch(err => {
        return res.json({ message: err.message });
      });
  })

// GET, PUT, DELETE
router.route('/:id')
  .get((req, res) => {
    const id = req.params.id;
    return new Gallery()
      .where({ id: id })
      .fetch()
      .then(image => {
        if (!image) {
          const invalidPhotoErr = new Error('Image not found');
          invalidPhotoErr.statusCode = 404;
          throw invalidPhotoErr;
        }
        return res.json(image);
      })
      .catch(err => {
        return res.json({ message: err.message })
      })
  })
  .delete((req, res)=>{
    const id = req.params.id;
    return new Gallery({id : id})
      .destroy()
      .then(image =>{
        if (!image) {
          const invalidPhotoErr = new Error('Image not found');
          invalidPhotoErr.statusCode = 404;
          throw invalidPhotoErr;
        }
        return res.json(image)
      })
      .catch(err => {
        return res.json({message: err.message})
      })
  })
  .put((req, res)=>{
    const id = req.params.id;
    
  })

// router.route('/new')
// .get(req, res => {

// })

module.exports = router;