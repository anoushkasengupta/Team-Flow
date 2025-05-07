import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

// Add paths that don't require authentication
const publicPaths = [
  '/',
  '/home',
  '/about',
  '/docs',
  '/auth/login',
  '/auth/register',
  '/api/login',
  '/api/register',
  '/api/test-connection',
];

// Flag to track if we've already initialized the socket
let socketInitialized = false;

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  return NextResponse.next();
}

// Configure which paths the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public/).*)',
  ],
};
