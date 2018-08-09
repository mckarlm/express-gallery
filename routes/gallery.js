const express = require('express');
const router = express.Router();
const Gallery = require('../db/models/Gallery');

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
      });
  })
  .get((req, res) => {
    return Gallery
      .query('where', 'id', '>', '0')
      .fetchAll()
      .then(images => {
        const imageObj = {};
        imageObj.allModels = images.models;
        return res.render('pages/getRoot', imageObj);
      })
      .catch(err => {
        return res.json({ message: err.message });
      });
  });

router.route('/:id')
  .get((req, res) => {
    const id = req.params.id;
    return new Gallery()
      .where({ id: id })
      .fetch()
      .then(image => {
        const imageObj = image.attributes;
        if (!image) {
          const invalidPhotoErr = new Error('Image not found');
          invalidPhotoErr.statusCode = 404;
          throw invalidPhotoErr;
        }
        return res.render('pages/getId', imageObj);
      })
      .catch(err => {
        return res.json({ message: err.message });
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
          return res.json({message: 'Invalid image'});
        }
        return res.json({message: 'Successful edit'});
      })
  })
  .delete((req, res) => {
    const id = req.params.id;
    return new Gallery({ id: id })
      .destroy()
      .then(image => {
        if (!image) {
          return res.json({ message: 'Image not found' });
        }
        return res.json({ message: 'Image successfully deleted' });
      })
      .catch(err => {
        return res.json({ message: err.message });
      });
  });

router.route('/:id/edit')
  .get((req, res)=>{
    return res.render('pages/getEdit');
  })

module.exports = router;