import { geolocation } from '@vercel/edge';

export const config = {
  matcher: '/:path*',
};

export default function middleware(request: Request) {
  const { country } = geolocation(request);
  
  if (country !== 'UY') {
    return new Response('Access Denied: You must be in Uruguay to view this site.', { status: 403 });
  }
} 