// middleware.js
import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';
import { secretKey } from './config/secret';

export async function middleware(req) {
  const token = req.cookies.get('token');

  if (!token) {
    return NextResponse.redirect(new URL('/login', req.url));
  }
  try {
    const { payload } = await jwtVerify(
      token.value,
      new TextEncoder().encode(secretKey)
    );
  } catch (err) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  return NextResponse.next();
}

// Apply the middleware to the /dashboard path
export const config = {
  matcher: '/dashboard/:path*',
};
