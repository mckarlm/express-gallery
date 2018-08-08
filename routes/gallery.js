const express = require('express');
const router = express.Router();
const Gallery = require('../db/models/Gallery');

router.route('/new')
  .get((req, res)=>{
    return res.render('pages/getNew')
  })

// GET       DONE
// POST      DONE
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
        console.log(image)
        return res.render('pages/getId')
      })
      .catch(err => {
        return res.json({ message: err.message })
      })
  })
  .put((req, res) => {
    const id = req.params.id;
    let { author, link, description } = req.body;
    author = author.trim();
    link = link.trim();

    return new Gallery({id})
      .save({author: author, link: link, description: description})
      .then(image => {
        if(!image){
          return res.json({message: 'Invalid image'})
        }
        return res.json({message: 'Successful edit'})
      })
  })
  .delete((req, res) => {
    const id = req.params.id;
    return new Gallery({ id: id })
      .destroy()
      .then(image => {
        if (!image) {
          return res.json({ message: 'Image not found' })
          // const invalidPhotoErr = new Error('Image not found');
          // invalidPhotoErr.statusCode = 404;
          // throw invalidPhotoErr;
        }
        return res.json({ message: 'Image successfully deleted' })
      })
      .catch(err => {
        return res.json({ message: err.message })
      })
  })

router.route('/:id/edit')
  .get((req, res)=>{
    return res.render('pages/getEdit')
  })

module.exports = router;