const axios = require('axios');
const FormData = require('form-data');
const ApiError = require('../utils/ApiError');

const IMGBB_UPLOAD_URL = 'https://api.imgbb.com/1/upload';

/**
 * Upload un buffer image vers ImgBB via base64
 * @param {Buffer} fileBuffer - Buffer de l'image (depuis multer.memoryStorage)
 * @param {string} filename - Nom du fichier
 * @returns {Promise<{url: string, deleteUrl: string, id: string}>}
 */
async function uploadToImgBB(fileBuffer, filename = 'image') {
  if (!process.env.IMGBB_API_KEY) {
    throw new ApiError(500, 'IMGBB_API_KEY non configurée');
  }

  try {
    const form = new FormData();
    form.append('image', fileBuffer.toString('base64'));
    form.append('name', filename);

    const response = await axios.post(IMGBB_UPLOAD_URL, form, {
      params: { key: process.env.IMGBB_API_KEY },
      headers: form.getHeaders(),
      maxContentLength: Infinity,
      maxBodyLength: Infinity,
    });

    if (!response.data?.success) {
      throw new ApiError(500, 'Échec de l\'upload sur ImgBB');
    }

    return {
      url: response.data.data.url,
      deleteUrl: response.data.data.delete_url,
      id: response.data.data.id,
    };
  } catch (err) {
    if (err instanceof ApiError) throw err;
    throw new ApiError(500, `Erreur upload ImgBB: ${err.message}`);
  }
}

module.exports = { uploadToImgBB };
