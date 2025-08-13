const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// Create temp directory if it doesn't exist
const tempDir = path.join(__dirname, 'temp_images');
if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir, { recursive: true });
}

// Store to track image metadata and cleanup timers
const imageStore = new Map();

/**
 * Save binary image data to temporary file and return URL
 * @param {Buffer} imageData - Binary image data
 * @param {string} imageId - Unique identifier for the image
 * @param {string} position - Position of the image (front, back, etc.)
 * @param {string} docType - Type of document
 * @param {string} country - Country code
 * @returns {Object} Object containing URL and metadata
 */
const saveTemporaryImage = (imageData, imageId, position, docType, country) => {
  // Generate unique filename
  const timestamp = Date.now();
  const randomId = crypto.randomBytes(8).toString('hex');
  const filename = `${imageId}_${position}_${timestamp}_${randomId}.jpg`;
  const filePath = path.join(tempDir, filename);
  
  // Save image to file
  console.log(`Saving image: ${filename}, size: ${imageData.length} bytes`);
  fs.writeFileSync(filePath, imageData);
  
  // Generate URL (assuming the server is running on the same domain)
  const baseUrl = process.env.API_BASE_URL || 'http://localhost:3001';
  const imageUrl = `${baseUrl}/api/sumsub/temp-image/${filename}`;
  
  // Store metadata
  const imageInfo = {
    filePath,
    filename,
    imageId,
    position,
    docType,
    country,
    createdAt: new Date(),
    expiresAt: new Date(Date.now() + 30 * 60 * 1000) // 30 minutes from now
  };
  
  imageStore.set(filename, imageInfo);
  
  // Set cleanup timer
  setTimeout(() => {
    cleanupImage(filename);
  }, 30 * 60 * 1000); // 30 minutes
  
  return {
    url: imageUrl,
    position,
    docType,
    country,
    expiresAt: imageInfo.expiresAt
  };
};

/**
 * Clean up a specific image file
 * @param {string} filename - Name of the file to delete
 */
const cleanupImage = (filename) => {
  const imageInfo = imageStore.get(filename);
  if (imageInfo) {
    try {
      // Delete file if it exists
      if (fs.existsSync(imageInfo.filePath)) {
        fs.unlinkSync(imageInfo.filePath);
        console.log(`Cleaned up temporary image: ${filename}`);
      }
    } catch (error) {
      console.error(`Error cleaning up image ${filename}:`, error);
    } finally {
      // Remove from store
      imageStore.delete(filename);
    }
  }
};

/**
 * Get image file path by filename
 * @param {string} filename - Name of the file
 * @returns {string|null} File path if exists, null otherwise
 */
const getImagePath = (filename) => {
  const imageInfo = imageStore.get(filename);
  if (imageInfo && fs.existsSync(imageInfo.filePath)) {
    return imageInfo.filePath;
  }
  return null;
};

/**
 * Clean up all expired images (called periodically)
 */
const cleanupExpiredImages = () => {
  const now = new Date();
  for (const [filename, imageInfo] of imageStore.entries()) {
    if (now > imageInfo.expiresAt) {
      cleanupImage(filename);
    }
  }
};

// Set up periodic cleanup every 5 minutes
setInterval(cleanupExpiredImages, 5 * 60 * 1000);

module.exports = {
  saveTemporaryImage,
  getImagePath,
  cleanupImage,
  cleanupExpiredImages
};
