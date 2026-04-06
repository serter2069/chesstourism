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

// Thrown when the uploaded file fails type or size validation.
// Callers should catch this and return 400 (not 500).
export class UploadValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'UploadValidationError';
  }
}

// Per-category upload constraints
const UPLOAD_CONFIGS = {
  avatar: {
    allowedMimes: ['image/jpeg', 'image/png', 'image/webp'],
    maxBytes: 5 * 1024 * 1024, // 5 MB
    prefix: 'avatars',
  },
  'tournament-photo': {
    allowedMimes: ['image/jpeg', 'image/png', 'image/webp'],
    maxBytes: 10 * 1024 * 1024, // 10 MB
    prefix: 'tournaments/photos',
  },
  document: {
    allowedMimes: ['application/pdf'],
    maxBytes: 20 * 1024 * 1024, // 20 MB
    prefix: 'documents',
  },
} as const;

export type UploadCategory = keyof typeof UPLOAD_CONFIGS;

function generateKey(prefix: string, originalName: string): string {
  const ext = path.extname(originalName).toLowerCase();
  const id = crypto.randomUUID();
  return `${prefix}/${id}${ext}`;
}

async function putToS3(key: string, buffer: Buffer, mimeType: string): Promise<string> {
  if (!s3Client) {
    // Graceful degradation: return placeholder URL when storage not configured
    console.warn('Storage not configured, returning placeholder URL');
    return `https://placeholder.storage/${key}`;
  }

  await s3Client.send(
    new PutObjectCommand({
      Bucket: STORAGE_BUCKET,
      Key: key,
      Body: buffer,
      ContentType: mimeType,
    }),
  );

  // Return public URL (MinIO with public bucket or proxy)
  return `${STORAGE_ENDPOINT}/${STORAGE_BUCKET}/${key}`;
}

/**
 * Central upload entry point.
 * Validates MIME type and file size for the given category, then uploads to S3.
 *
 * Throws UploadValidationError (→ 400) on invalid type/size.
 * Throws Error (→ 500) on S3 failure.
 */
export async function validateAndUpload(
  buffer: Buffer,
  mimeType: string,
  originalName: string,
  category: UploadCategory,
): Promise<string> {
  const config = UPLOAD_CONFIGS[category];

  if (!(config.allowedMimes as readonly string[]).includes(mimeType)) {
    throw new UploadValidationError(
      `Invalid file type "${mimeType}". Allowed: ${config.allowedMimes.join(', ')}`,
    );
  }

  if (buffer.length > config.maxBytes) {
    const maxMB = config.maxBytes / (1024 * 1024);
    throw new UploadValidationError(`File too large. Maximum size is ${maxMB}MB`);
  }

  const key = generateKey(config.prefix, originalName);

  try {
    return await putToS3(key, buffer, mimeType);
  } catch (err) {
    console.error(`S3 upload error [${category}]:`, err);
    throw new Error('Failed to upload file');
  }
}

// ---------------------------------------------------------------------------
// Legacy wrappers — kept for backward compatibility, prefer validateAndUpload
// ---------------------------------------------------------------------------

export async function uploadFile(
  buffer: Buffer,
  originalName: string,
  mimeType: string,
): Promise<string> {
  return validateAndUpload(buffer, mimeType, originalName, 'tournament-photo');
}

export async function uploadAvatar(
  buffer: Buffer,
  originalName: string,
  mimeType: string,
): Promise<string> {
  return validateAndUpload(buffer, mimeType, originalName, 'avatar');
}
