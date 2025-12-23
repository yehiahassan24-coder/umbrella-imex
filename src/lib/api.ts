export async function authFetch(url: string, options: RequestInit = {}) {
    // Get CSRF token from sessionStorage
    const csrfToken = typeof window !== 'undefined' ? sessionStorage.getItem('csrf-token') : null;

    const headers = { ...options.headers } as Record<string, string>;

    // Automatically set Content-Type to application/json if body is not FormData
    if (options.body && !(options.body instanceof FormData) && !headers['Content-Type']) {
        headers['Content-Type'] = 'application/json';
    }

    if (csrfToken) {
        headers['x-csrf-token'] = csrfToken;
    }

    const response = await fetch(url, {
        ...options,
        headers,
    });

    if (response.status === 401 || response.status === 403) {
        // Log unauthorized attempts or handle sign out
    }

    return response;
}
