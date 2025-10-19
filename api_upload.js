const express = require('express');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const streamifier = require('streamifier');

const app = express();
const upload = multer({ storage: multer.memoryStorage() });

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'docfeepkt',
  api_key: process.env.CLOUDINARY_API_KEY || '855878492818922',
  api_secret: process.env.CLOUDINARY_API_SECRET || '_vACaSYKCQL9Wo3KW3KH1d2djX8'
});

// POST /api_upload: Handle image upload to Cloudinary
app.post('/', upload.single('photo'), (req, res) => {
  if (!req.file) {
    return res.json({ imagePath: null });
  }
  const streamUpload = (req) => {
    return new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: 'nurse_emerge' },
        (error, result) => {
          if (result) resolve(result);
          else reject(error);
        }
      );
      streamifier.createReadStream(req.file.buffer).pipe(stream);
    });
  };
  streamUpload(req)
    .then(result => res.json({ imagePath: result.secure_url }))
    .catch(error => {
      console.error('Error uploading image:', error.message);
      res.status(500).json({ error: 'Failed to upload image' });
    });
});

module.exports = app;