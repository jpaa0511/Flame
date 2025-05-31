import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('auth_token')?.value;
  const pathname = request.nextUrl.pathname;

  const isAuthPage = pathname.startsWith('/login') || pathname.startsWith('/register');
  const isProtectedRoute = pathname.startsWith('/feed') || 
                          pathname.startsWith('/chat') || 
                          pathname.startsWith('/matches') || 
                          pathname.startsWith('/profile');

  // Si está autenticado y va a la raíz o páginas de auth, redirigir a feed
  if (token && (pathname === '/' || isAuthPage)) {
    return NextResponse.redirect(new URL('/feed', request.url));
  }

  // Si no está autenticado y va a una ruta protegida, redirigir a login
  if (!token && isProtectedRoute) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/',
    '/feed/:path*',
    '/chat/:path*',
    '/matches/:path*',
    '/profile/:path*',
    '/login',
    '/register'
  ]
}; 