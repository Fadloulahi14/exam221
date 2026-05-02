const streamifier = require('streamifier');
const cloudinary = require('../config/cloudinary');
const ApiError = require('../utils/ApiError');

/**
 * Upload un buffer image vers Cloudinary
 * @param {Buffer} fileBuffer - Buffer depuis multer.memoryStorage
 * @param {string} filename - Nom du fichier original
 * @returns {Promise<{url: string, publicId: string}>}
 */
function uploadToCloudinary(fileBuffer, filename = 'image') {
  return new Promise((resolve, reject) => {
    const nameWithoutExt = filename.replace(/\.[^/.]+$/, '').replace(/\s+/g, '_');
    const publicId = `${Date.now()}_${nameWithoutExt}`;

    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: 'supply-api/produits',
        resource_type: 'image',
        public_id: publicId,
        overwrite: false,
      },
      (error, result) => {
        if (error) return reject(new ApiError(500, `Erreur upload Cloudinary: ${error.message}`));
        resolve({ url: result.secure_url, publicId: result.public_id });
      }
    );

    streamifier.createReadStream(fileBuffer).pipe(uploadStream);
  });
}

/**
 * Supprime une image de Cloudinary par son public_id
 * Ne lève pas d'exception en cas d'erreur pour ne pas bloquer la requête principale
 * @param {string} publicId - public_id Cloudinary de l'image
 */
async function deleteFromCloudinary(publicId) {
  if (!publicId) return;
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (err) {
    console.error(`[Cloudinary] Échec suppression ${publicId}:`, err.message);
  }
}

module.exports = { uploadToCloudinary, deleteFromCloudinary };
