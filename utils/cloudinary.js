const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const dotenv = require('dotenv');

dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: 'course_media',
        format: async (req, file) => 'mp4', // Adjust format based on media type
        public_id: (req, file) => file.originalname.split('.')[0]
    }
});

const upload = multer({ storage });

module.exports = { upload, cloudinary };
