const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

/**
 * Uploads an image file to Cloudinary using an unsigned preset.
 * Hardened with pre-upload validation and detailed error reporting.
 */
export async function uploadImage(file: File): Promise<string> {
  
  if (!CLOUD_NAME || !UPLOAD_PRESET) {
    const missing = !CLOUD_NAME ? 'VITE_CLOUDINARY_CLOUD_NAME' : 'VITE_CLOUDINARY_UPLOAD_PRESET';
    throw new Error(`Cloudinary Configuration Error: Missing ${missing} environment variable.`);
  }

  
  if (!file || !(file instanceof File)) {
    throw new Error('Validation Error: No valid file provided for upload.');
  }

  if (!file.type.startsWith('image/')) {
    throw new Error(`Validation Error: File type "${file.type}" is not a supported image format.`);
  }

  const MAX_SIZE = 5 * 1024 * 1024; // 5MB limit
  if (file.size > MAX_SIZE) {
    throw new Error(`Validation Error: File size (${(file.size / 1024 / 1024).toFixed(2)}MB) exceeds the 5MB limit.`);
  }

  
  const CLOUDINARY_URL = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', UPLOAD_PRESET);

  // Debugging log (Metadata only)
//   console.log('[Cloudinary] Initiating upload...', {
//     name: file.name,
//     type: file.type,
//     size: `${(file.size / 1024).toFixed(2)}KB`,
//     endpoint: `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/...`
//   });

  try {
    // 4. Execute Fetch
    const response = await fetch(CLOUDINARY_URL, {
      method: 'POST',
      body: formData,
    });

    // 5. Unified Error Handling
    if (!response.ok) {
      let errorMessage = `Upload failed with status ${response.status}`;
      
      try {
        const errorData = await response.json();
        // Extract Cloudinary-specific error if available
        errorMessage = errorData.error?.message || errorData.message || errorMessage;
        console.error('[Cloudinary] Server Error Payload:', errorData);
      } catch (parseError) {
        console.error('[Cloudinary] Could not parse error response JSON', parseError);
      }

      throw new Error(`Cloudinary Error: ${errorMessage}`);
    }

    
    const data = await response.json();
    
    if (!data.secure_url) {
      console.error('[Cloudinary] Success response missing secure_url:', data);
      throw new Error('Cloudinary Error: Response was successful but secure_url was not returned.');
    }

    console.log('[Cloudinary] Upload successful:', data.secure_url);
    return data.secure_url;

  } catch (networkError: any) {
    
    if (networkError.name === 'TypeError' && networkError.message === 'Failed to fetch') {
      throw new Error('Network Error: Could not connect to Cloudinary. Please check your internet connection or CORS settings.');
    }
    
    
    if (networkError.message.includes('Cloudinary Error') || networkError.message.includes('Validation Error')) {
      throw networkError;
    }

    throw new Error(`Upload Process Error: ${networkError.message || 'An unexpected error occurred during the upload process.'}`);
  }
}
