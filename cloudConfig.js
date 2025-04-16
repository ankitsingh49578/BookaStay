const cloudinary = require('cloudinary').v2; // for image upload
const {CloudinaryStorage} = require('multer-storage-cloudinary'); // for image upload

// first of all, we need to configure the cloudinary with our credentials which
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET,
});

// Then we need to create a storage object which will be used to store the images in cloudinary
// and we need to pass the cloudinary object to the storage object
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'Book-A-Stay', // The name of the folder in cloudinary
        allowed_formats: ['jpeg', 'png', 'jpg', 'avif'], // The allowed formats for the images
    },
});

// Now we need to export the cloudinary and storage object so that we can use it in other files
module.exports = {
    cloudinary,
    storage,
}

