const axios = require('axios');
const crypto = require('crypto');
const { getApplicantData } = require('./getApplicantData');
const { getDocumentImages } = require('./getDocumentImages');
const { getApplicantMetadata } = require('./getApplicantMetadata');
const { saveTemporaryImage } = require('./tempImageStorage');



const getSumsubKYCStatus = async (userId) => {
  const APP_TOKEN = process.env.SUMSUB_TOKEN;
  const APP_SECRET = process.env.SUMSUB_KEY;

  if (!APP_TOKEN || !APP_SECRET) {
    throw new Error('Sumsub credentials not configured. Please set SUMSUB_TOKEN and SUMSUB_KEY environment variables.');
  }

  if (!userId) {
    throw new Error('userId is required');
  }

  try {
    // Get applicant data - pass userId as externalUserId
    const applicantData = await getApplicantData({ externalUserId: userId });

    // Extract document images using the applicantId and inspectionId from applicant data
    const documentImages = [];
    
    if (applicantData && applicantData.id && applicantData.inspectionId) {
      try {
        // Get applicant metadata to find available image IDs
        const metadata = await getApplicantMetadata(applicantData.id);
        
        // Extract image IDs and positions from metadata
        const imageInfo = [];
        if (metadata && metadata.items) {
          metadata.items.forEach(item => {
            if (item.id && !item.deactivated) {
              const position = item.idDocDef?.idDocSubType || 'unknown';
              imageInfo.push({
                id: item.id,
                position: position,
                docType: item.idDocDef?.idDocType || 'unknown',
                country: item.idDocDef?.country || 'unknown'
              });
            }
          });
        }
        
        // If no image info found in metadata, try with default 'main' image ID
        if (imageInfo.length === 0) {
          imageInfo.push({
            id: 'main',
            position: 'main',
            docType: 'unknown',
            country: 'unknown'
          });
        }
        
        // Get document images for each image ID
        for (const image of imageInfo) {
          try {
            const imageData = await getDocumentImages(applicantData.inspectionId, image.id);
            
            // Save image to temporary storage and get URL
            const tempImageInfo = saveTemporaryImage(
              imageData, 
              image.id, 
              image.position, 
              image.docType, 
              image.country
            );
            
            documentImages.push({
              inspectionId: applicantData.inspectionId,
              imageId: image.id,
              position: image.position,
              docType: image.docType,
              country: image.country,
              url: tempImageInfo.url,
              expiresAt: tempImageInfo.expiresAt
            });
          } catch (imageError) {
            console.error(`Error fetching document image ${image.id} (${image.position}) for inspection ${applicantData.inspectionId}:`, imageError);
            // Continue even if individual image fetch fails
          }
        }
      } catch (metadataError) {
        console.error(`Error fetching applicant metadata for ${applicantData.id}:`, metadataError);
        // Fallback to trying with 'main' image ID if metadata fetch fails
        try {
          const imageData = await getDocumentImages(applicantData.inspectionId, 'main');
          
          // Save fallback image to temporary storage
          const tempImageInfo = saveTemporaryImage(
            imageData, 
            'main', 
            'main', 
            'unknown', 
            'unknown'
          );
          
          documentImages.push({
            inspectionId: applicantData.inspectionId,
            imageId: 'main',
            position: 'main',
            docType: 'unknown',
            country: 'unknown',
            url: tempImageInfo.url,
            expiresAt: tempImageInfo.expiresAt
          });
        } catch (fallbackError) {
          console.error(`Error fetching fallback document image for inspection ${applicantData.inspectionId}:`, fallbackError);
        }
      }
    }

    return {
      userId: userId,
      applicantData: applicantData,
      documentImages: documentImages
    };

  } catch (error) {
    console.error('Error in getSumsubKYCStatus:', error);
    
    // Check if it's a 404 error (user not found/not started KYC)
    if (error.message && error.message.includes('404')) {
      console.log('User not found in Sumsub (404) - returning null');
      return null;
    }
    
    throw error;
  }
};

module.exports = { getSumsubKYCStatus };
