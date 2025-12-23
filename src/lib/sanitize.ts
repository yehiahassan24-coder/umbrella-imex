import DOMPurify from 'isomorphic-dompurify';

/**
 * Sanitize user input to prevent XSS attacks
 * Removes all HTML tags and dangerous content
 */
export function sanitizeInput(input: string): string {
    if (!input) return '';

    // Remove all HTML tags
    return DOMPurify.sanitize(input, {
        ALLOWED_TAGS: [],
        ALLOWED_ATTR: [],
        KEEP_CONTENT: true
    });
}

/**
 * Sanitize HTML content while allowing safe tags
 * Use for rich text content that needs basic formatting
 */
export function sanitizeHTML(html: string): string {
    if (!html) return '';

    return DOMPurify.sanitize(html, {
        ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'p', 'br'],
        ALLOWED_ATTR: []
    });
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Validate and sanitize phone number
 */
export function sanitizePhone(phone: string): string {
    // Remove all non-numeric characters except + and spaces
    return phone.replace(/[^0-9+\s()-]/g, '');
}

/**
 * Check if string contains potential SQL injection patterns
 * (Defense in depth - Prisma already protects against this)
 */
export function containsSQLInjection(input: string): boolean {
    const sqlPatterns = [
        /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|EXECUTE)\b)/i,
        /(--|;|\/\*|\*\/)/,
        /(\bOR\b.*=.*)/i,
        /(\bAND\b.*=.*)/i
    ];

    return sqlPatterns.some(pattern => pattern.test(input));
}

/**
 * Validate file MIME type against magic bytes
 */
export function validateImageMagicBytes(buffer: Buffer): { valid: boolean; mimeType: string | null } {
    const magicBytes = buffer.slice(0, 4).toString('hex');

    const validTypes: Record<string, string> = {
        'ffd8ffe0': 'image/jpeg',
        'ffd8ffe1': 'image/jpeg',
        'ffd8ffe2': 'image/jpeg',
        '89504e47': 'image/png',
        '47494638': 'image/gif',
        '52494646': 'image/webp', // RIFF (WebP)
    };

    const mimeType = validTypes[magicBytes.substring(0, 8)] || null;

    return {
        valid: mimeType !== null,
        mimeType
    };
}
