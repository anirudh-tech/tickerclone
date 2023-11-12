const multer = require('multer');
const path = require('path');
const multerS3 = require('multer-s3');
const AWS = require('aws-sdk');

// handling file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/uploads/'); 
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname)); 
  },
});
// const s3 = new AWS.S3({
//   accessKeyId: 'YOUR_ACCESS_KEY',
//   secretAccessKey: 'YOUR_SECRET_KEY',
// });

// const s3Storage = multerS3({
//   s3: s3,
//   bucket: 'your-s3-bucket-name',
//   acl: 'public-read', // Set the appropriate ACL permissions
//   contentType: multerS3.AUTO_CONTENT_TYPE,
//   key: (req, file, cb) => {
//     cb(null, 'public/uploads/' + Date.now() + '-' + file.originalname);
//   },
// });

const upload = multer({  storage });

module.exports = upload