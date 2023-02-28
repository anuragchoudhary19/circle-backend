const express = require('express');
const router = express.Router();

//controllers
const {
  uploadImage,
  uploadVideo,
  uploadImagePrivate,
  uploadVideoPrivate,
  remove,
} = require('../controllers/cloudinary');

//routes
router.post('/upload-image', uploadImage);
router.post('/upload-video', uploadVideo);
router.post('/upload-image-private', uploadImagePrivate);
router.post('/upload-video-private', uploadVideoPrivate);
router.post('/remove-image', remove);

module.exports = router;
