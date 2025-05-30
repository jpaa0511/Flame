import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('auth_token')?.value;
  const pathname = request.nextUrl.pathname;

  const isAuthPage = pathname.startsWith('/login') || pathname.startsWith('/register');

  // Si el usuario tiene sesión y va a la página de inicio (/) lo redirigimos a /feed
  if (token && pathname === '/') {
    return NextResponse.redirect(new URL('/feed', request.url));
  }

  // Si no hay sesión y va a una ruta protegida, redirigir a /login
  const isProtectedRoute = pathname.startsWith('/feed');
  if (!token && isProtectedRoute) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Si hay sesión y va a login o register, redirigir a /feed
  if (token && isAuthPage) {
    return NextResponse.redirect(new URL('/feed', request.url));
  }

  return NextResponse.next();
}

// Configura las rutas que serán evaluadas por el middleware
export const config = {
  matcher: ['/', '/feed/:path*', '/login', '/register']
};

