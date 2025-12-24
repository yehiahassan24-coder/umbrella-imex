import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { headers } from 'next/headers';
import { rateLimit } from '@/lib/ratelimit';
import { uploadFile } from '@/lib/storage';
import { validateImageMagicBytes } from '@/lib/sanitize';

export async function POST(request: Request) {
    try {
        // 1. Rate Limiting (5 uploads per minute per user/IP)
        const ip = (await headers()).get('x-forwarded-for') || '127.0.0.1';
        const limitResult = await rateLimit(`upload:${ip}`, 5, 60);
        if (!limitResult.success) {
            return NextResponse.json({ error: 'Too many uploads. Please wait a minute.' }, { status: 429 });
        }

        const formData = await request.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
        }

        if (file.size > 5 * 1024 * 1024) {
            return NextResponse.json({ error: 'File too large (Max 5MB).' }, { status: 413 });
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // 3. MAGIC BYTE VALIDATION (prevents MIME type spoofing)
        const magicByteCheck = validateImageMagicBytes(buffer);
        if (!magicByteCheck.valid) {
            return NextResponse.json({
                error: 'Invalid file type. File content does not match allowed image formats.'
            }, { status: 400 });
        }

        // 4. MIME Type Validation (secondary check)
        const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
        if (!allowedTypes.includes(file.type) || file.type !== magicByteCheck.mimeType) {
            return NextResponse.json({
                error: 'Invalid file type. Only JPG, PNG, WEBP, and GIF are allowed.'
            }, { status: 400 });
        }

        // 4. Secure Filename Generation
        const fileExtension = file.name.split('.').pop()?.toLowerCase() || 'bin';
        const uniqueName = `${crypto.randomUUID()}.${fileExtension}`;

        const isProd = process.env.NODE_ENV === 'production';
        const storageType = process.env.UPLOAD_STORAGE_TYPE;

        // ❌ Remove Base64 Fallback & Enforce Cloud for Production
        if (isProd && storageType !== 's3') {
            return NextResponse.json({
                error: 'Production storage misconfigured. Cloud storage (S3/R2) is required.'
            }, { status: 500 });
        }

        let fileUrl: string;

        if (storageType === 's3') {
            fileUrl = await uploadFile(buffer, uniqueName, file.type);
        } else if (!isProd) {
            // Development Fallback: Local Storage
            fileUrl = await uploadFile(buffer, uniqueName, file.type);
        } else {
            return NextResponse.json({ error: 'Unsupported storage configuration' }, { status: 500 });
        }

        return NextResponse.json({ url: fileUrl });
    } catch (error) {
        console.error('Upload Error:', error);
        return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
    }
}
