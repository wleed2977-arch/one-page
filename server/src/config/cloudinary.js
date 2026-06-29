import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME || 'mock-cloud',
  api_key: process.env.CLOUDINARY_KEY || 'mock-key',
  api_secret: process.env.CLOUDINARY_SECRET || 'mock-secret',
});

export default cloudinary;
