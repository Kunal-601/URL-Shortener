import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) {
      console.log('No file path provided');
      return null;
    }

    console.log('Attempting to upload to Cloudinary:', localFilePath);
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: 'auto',
      folder: 'chat-app/avatars', // Optional: organize uploads
    });

    try {
      fs.unlinkSync(localFilePath);
      console.log('File deleted successfully:', localFilePath);
    } catch (unlinkError) {
      console.error('Error deleting file:', unlinkError);
    }

    return response;
  } catch (error) {
    try {
      fs.unlinkSync(localFilePath);
      console.log('File deleted after error:', localFilePath);
    } catch (unlinkError) {
      console.error('Error deleting file:', unlinkError);
    }
    console.error('Cloudinary Upload Error:', error.message);
    return null;
  }
};

export { uploadOnCloudinary };