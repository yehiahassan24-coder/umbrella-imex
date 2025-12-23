import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { headers } from 'next/headers';
import { rateLimit } from '@/lib/ratelimit';
import { uploadFile } from '@/lib/storage';

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

        // 2. Size Validation (1MB limit for Base64 safety)
        if (file.size > 1 * 1024 * 1024) {
            return NextResponse.json({ error: 'File too large (Max 1MB). For larger images, use an external URL.' }, { status: 413 });
        }

        // 3. MIME Type Validation
        const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml'];
        if (!allowedTypes.includes(file.type)) {
            return NextResponse.json({ error: 'Invalid file type. Only JPG, PNG, WEBP, and SVG are allowed.' }, { status: 400 });
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // 4. Secure Filename Generation
        const fileExtension = file.name.split('.').pop()?.toLowerCase() || 'bin';
        const uniqueName = `${crypto.randomUUID()}.${fileExtension}`;

        // 5. check for cloud storage config
        const hasCloudStorage = process.env.UPLOAD_STORAGE_TYPE === 's3' || process.env.BLOB_READ_WRITE_TOKEN;

        let fileUrl: string;

        if (hasCloudStorage) {
            fileUrl = await uploadFile(buffer, uniqueName, file.type);
        } else {
            // Fallback: Return Base64 Data URI (Works in Vercel with no config)
            const base64String = buffer.toString('base64');
            fileUrl = `data:${file.type};base64,${base64String}`;
        }

        return NextResponse.json({ url: fileUrl });
    } catch (error) {
        console.error('Upload Error:', error);
        return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
    }
}
