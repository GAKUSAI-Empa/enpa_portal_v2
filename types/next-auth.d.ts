import NextAuth from 'next-auth';

declare module 'next-auth' {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      id: string;
      username: string;
      email: string;
      role_id: string;
      role_name: string;
      company_id: string;
      company_name: string;
      accessToken: string;
      sub?: string;
      iat?: number;
      exp?: number;
      jti?: string;
    };
  }
}
