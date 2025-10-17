import type { NextAuthConfig } from 'next-auth';
 
export const authConfig = {
  pages: {
    signIn: '/auth/login',
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnDashboard = nextUrl.pathname.startsWith('/admin') || 
                           nextUrl.pathname.startsWith('/tutor') || 
                           nextUrl.pathname.startsWith('/student');
      
      if (isOnDashboard) {
        if (isLoggedIn) return true;
        return false; // Redirect unauthenticated users to login page
      } else if (isLoggedIn) {
        // Redirect authenticated users to their dashboard based on role
        const role = auth.user.role;
        if (role === 'admin') {
          return Response.redirect(new URL('/admin', nextUrl));
        } else if (role === 'tutor') {
          return Response.redirect(new URL('/tutor', nextUrl));
        } else {
          return Response.redirect(new URL('/student', nextUrl));
        }
      }
      return true;
    },
  },
  providers: [], // Add providers with an empty array for now
} satisfies NextAuthConfig;