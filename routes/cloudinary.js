const express = require('express');
const router = express.Router();

//controllers
const { uploadImage, uploadVideo, remove } = require('../controllers/cloudinary');

//routes
router.post('/upload-image', uploadImage);
router.post('/upload-video', uploadVideo);
router.post('/remove-image', remove);

module.exports = router;
