import { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Simple middleware without NextAuth for now
  return;
}

export const config = {
  matcher: [],
};