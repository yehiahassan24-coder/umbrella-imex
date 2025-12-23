// Helper function to get cookie value
function getCookie(name: string): string | null {
    if (typeof document === 'undefined') return null;
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
    return null;
}

export async function authFetch(url: string, options: RequestInit = {}) {
    // Get CSRF token from client-readable cookie
    const csrfToken = getCookie('csrf-token-client');

    const headers = { ...options.headers } as Record<string, string>;

    // Automatically set Content-Type to application/json if body is not FormData
    if (options.body && !(options.body instanceof FormData) && !headers['Content-Type']) {
        headers['Content-Type'] = 'application/json';
    }

    // Add CSRF token to header for validation
    if (csrfToken) {
        headers['x-csrf-token'] = csrfToken;
    }

    const response = await fetch(url, {
        ...options,
        headers,
        credentials: 'include', // Ensure cookies are sent
    });

    if (response.status === 401 || response.status === 403) {
        // Redirect to login on unauthorized
        if (typeof window !== 'undefined' && window.location.pathname.startsWith('/admin/dashboard')) {
            window.location.href = '/admin';
        }
    }

    return response;
}
