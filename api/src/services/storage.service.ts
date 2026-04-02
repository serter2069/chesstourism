import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import path from 'path';
import crypto from 'crypto';

const STORAGE_ENDPOINT = process.env.STORAGE_ENDPOINT;
const STORAGE_BUCKET = process.env.STORAGE_BUCKET || 'chesstourism';
const STORAGE_ACCESS_KEY = process.env.STORAGE_ACCESS_KEY;
const STORAGE_SECRET_KEY = process.env.STORAGE_SECRET_KEY;
const STORAGE_REGION = process.env.STORAGE_REGION || 'us-east-1';

let s3Client: S3Client | null = null;

if (STORAGE_ENDPOINT && STORAGE_ACCESS_KEY && STORAGE_SECRET_KEY) {
  s3Client = new S3Client({
    endpoint: STORAGE_ENDPOINT,
    region: STORAGE_REGION,
    credentials: {
      accessKeyId: STORAGE_ACCESS_KEY,
      secretAccessKey: STORAGE_SECRET_KEY,
    },
    forcePathStyle: true,
  });
}

function generateKey(originalName: string): string {
  const ext = path.extname(originalName).toLowerCase();
  const id = crypto.randomUUID();
  return `tournaments/photos/${id}${ext}`;
}

export async function uploadFile(
  buffer: Buffer,
  originalName: string,
  mimeType: string,
): Promise<string> {
  const key = generateKey(originalName);

  if (!s3Client) {
    // Graceful degradation: return placeholder URL when storage not configured
    console.warn('Storage not configured, returning placeholder URL');
    return `https://placeholder.storage/${key}`;
  }

  try {
    await s3Client.send(
      new PutObjectCommand({
        Bucket: STORAGE_BUCKET,
        Key: key,
        Body: buffer,
        ContentType: mimeType,
      }),
    );

    // Return public URL (MinIO with public bucket or proxy)
    const publicUrl = `${STORAGE_ENDPOINT}/${STORAGE_BUCKET}/${key}`;
    return publicUrl;
  } catch (err) {
    console.error('S3 upload error:', err);
    throw new Error('Failed to upload file');
  }
}
