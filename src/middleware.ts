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
  const { pathname } = request.nextUrl;

  // Allow public paths (exact match or subpath)
  if (publicPaths.some(path => pathname === path || pathname.startsWith(path + '/'))) {
    return NextResponse.next();
  }

  // Check for token in cookies
  const token = request.cookies.get('token')?.value;

  if (!token) {
    // Redirect to login if no token is present
    const url = new URL('/auth/login', request.url);
    url.searchParams.set('from', pathname);
    return NextResponse.redirect(url);
  }

  try {
    // Verify token
    jwt.verify(token, JWT_SECRET);

    // Only initialize socket once and only on dashboard pages
    if (!socketInitialized && !pathname.startsWith('/api/')) {
      try {
        socketInitialized = true; // Set flag immediately to prevent duplicate calls
        console.log('Middleware: Initializing socket connection');
        
        // Construct absolute URL for fetching
        const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';
        const host = request.headers.get('host') || '';
        const socketUrl = `${protocol}://${host}/api/socket`;
        
        // Make a non-blocking request to initialize socket
        fetch(socketUrl)
          .then(response => {
            if (!response.ok) {
              throw new Error(`Socket initialization failed with status: ${response.status}`);
            }
            return response.json();
          })
          .then(data => console.log('Socket initialized:', data))
          .catch(err => {
            console.error('Failed to initialize socket:', err);
            // Reset flag to allow retrying on next request
            socketInitialized = false;
          });
      } catch (error) {
        console.error('Socket initialization error:', error);
        socketInitialized = false; // Reset flag to allow retrying on next request
      }
    }
    
    // Continue with the request
    return NextResponse.next();
  } catch {
    // If token is invalid, redirect to login
    const url = new URL('/auth/login', request.url);
    url.searchParams.set('from', pathname);
    return NextResponse.redirect(url);
  }
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