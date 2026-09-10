import { put } from '@vercel/blob';

/**
 * Uploads a file to Vercel Blob storage.
 * In production, ensure BLOB_READ_WRITE_TOKEN is set in Vercel.
 */
export async function uploadFile(file: File | Blob, path: string) {
  try {
    const blob = await put(path, file, {
      access: 'public',
    });

    return blob.url;
  } catch (error) {
    console.error('File upload failed:', error);
    throw new Error('Failed to upload file to production storage.');
  }
}

/**
 * Example Cloudinary upload (commented out as Vercel Blob is preferred for Vercel hosting)
 *
 * import { v2 as cloudinary } from 'cloudinary';
 *
 * cloudinary.config({
 *   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
 *   api_key: process.env.CLOUDINARY_API_KEY,
 *   api_secret: process.env.CLOUDINARY_API_SECRET,
 * });
 *
 * export async function uploadToCloudinary(fileUri: string) {
 *   const res = await cloudinary.uploader.upload(fileUri);
 *   return res.secure_url;
 * }
 */
