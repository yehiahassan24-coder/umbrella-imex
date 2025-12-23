import { NextResponse } from 'next/server';

export async function POST() {
    const response = NextResponse.json({ success: true });
    response.cookies.delete('admin-token');
    response.cookies.delete('csrf-token');
    response.cookies.delete('csrf-token-client');
    response.cookies.delete('is-authenticated');
    return response;
}
