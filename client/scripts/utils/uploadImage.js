import { uploadApi } from '../api/upload.api.js';

export const uploadImageFile = async (file) => {
  const res = await uploadApi.uploadImage(file);
  return res.data?.url;
};
