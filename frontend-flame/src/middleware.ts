import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('auth_token')?.value;
  const isAuthPage = request.nextUrl.pathname.startsWith('/login') || 
                    request.nextUrl.pathname.startsWith('/register');

  // Si no hay token y no estamos en una página de auth, redirigir a login
  if (!token && !isAuthPage) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Si hay token y estamos en una página de auth, redirigir a feed
  if (token && isAuthPage) {
    return NextResponse.redirect(new URL('/feed', request.url));
  }

  return NextResponse.next();
}

// Configurar las rutas que deben ser protegidas
export const config = {
  matcher: ['/feed/:path*', '/login', '/register']
}; 