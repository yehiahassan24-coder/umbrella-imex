import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

// Storage Configuration
const storageType = process.env.UPLOAD_STORAGE_TYPE || 'local';

// S3 Client Configuration (for AWS S3 or Cloudflare R2)
const s3Client = storageType === 's3' ? new S3Client({
    region: process.env.AWS_REGION || 'auto',
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
    },
    // For R2, set AWS_S3_ENDPOINT (e.g., https://<account-id>.r2.cloudflarestorage.com)
    endpoint: process.env.AWS_S3_ENDPOINT,
}) : null;

/**
 * Handles file uploads to either local storage or S3-compatible cloud storage.
 * @param buffer The file data as a Buffer
 * @param filename The unique filename to save as
 * @param contentType The MIME type of the file
 */
export async function uploadFile(buffer: Buffer, filename: string, contentType: string = 'image/jpeg'): Promise<string> {
    if (storageType === 'local') {
        const uploadDir = join(process.cwd(), 'public/uploads');
        try {
            await mkdir(uploadDir, { recursive: true });
        } catch (e) {
            // Directory likely exists
        }
        const path = join(uploadDir, filename);
        await writeFile(path, buffer);
        return `/uploads/${filename}`;
    }

    if (storageType === 's3') {
        if (!s3Client || !process.env.AWS_BUCKET_NAME) {
            throw new Error('S3 storage is enabled but credentials or bucket name are missing.');
        }

        try {
            await s3Client.send(new PutObjectCommand({
                Bucket: process.env.AWS_BUCKET_NAME,
                Key: `uploads/${filename}`,
                Body: buffer,
                ContentType: contentType,
            }));

            // Construct URL - for R2 or custom domains, use AWS_S3_PUBLIC_URL
            if (process.env.AWS_S3_PUBLIC_URL) {
                return `${process.env.AWS_S3_PUBLIC_URL}/uploads/${filename}`;
            }

            // Default S3 URL
            const region = process.env.AWS_REGION || 'us-east-1';
            return `https://${process.env.AWS_BUCKET_NAME}.s3.${region}.amazonaws.com/uploads/${filename}`;
        } catch (error) {
            console.error('Cloud Storage Error:', error);
            throw new Error('Failed to upload file to cloud storage.');
        }
    }

    throw new Error(`Unsupported storage type: ${storageType}`);
}
