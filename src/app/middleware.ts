import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('token')
  
  if (!token && !request.nextUrl.pathname.startsWith('/login')) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  if (token && request.nextUrl.pathname.startsWith('/login')) {
    return NextResponse.redirect(new URL('/products', request.url))
  }

  if (request.method === 'POST' && request.nextUrl.pathname === '/api/token') {
    const { token } = await request.json();
    if (token) {
      const response = NextResponse.next();
      response.cookies.set('token', token.access, { httpOnly: true });
      return response;
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/products/:path*',
    '/cart/:path*',
    '/profile/:path*',
    '/login'
  ]
}