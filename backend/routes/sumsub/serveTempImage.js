const express = require('express');
const path = require('path');
const { getImagePath } = require('./tempImageStorage');

/**
 * Express middleware to serve temporary images
 * @param {express.Request} req - Express request object
 * @param {express.Response} res - Express response object
 * @param {express.NextFunction} next - Express next function
 */
const serveTempImage = (req, res, next) => {
  const filename = req.params.filename;
  
  console.log(`Serving image request for: ${filename}`);
  
  // Security check: ensure filename is safe
  if (!filename || filename.includes('..') || filename.includes('/') || filename.includes('\\')) {
    console.log(`Invalid filename detected: ${filename}`);
    return res.status(400).json({ error: 'Invalid filename' });
  }
  
  // Get image path from storage
  const imagePath = getImagePath(filename);
  
  if (!imagePath) {
    console.log(`Image not found or expired: ${filename}`);
    return res.status(404).json({ error: 'Image not found or expired' });
  }
  
  console.log(`Serving image from path: ${imagePath}`);
  
  // Set appropriate headers
  res.setHeader('Content-Type', 'image/jpeg');
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  
  // Serve the file
  res.sendFile(imagePath, (err) => {
    if (err) {
      console.error(`Error serving image ${filename}:`, err);
      if (!res.headersSent) {
        res.status(500).json({ error: 'Error serving image' });
      }
    }
  });
};

module.exports = { serveTempImage };
