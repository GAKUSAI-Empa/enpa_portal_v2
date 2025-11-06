import NextAuth from 'next-auth';

declare module 'next-auth' {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      id: number;
      username: string;
      email: string;
      role_id: number;
      chatwork_id: string;
      company_id: number;
      accessToken: string;
      sub?: string;
      iat?: number;
      exp?: number;
      jti?: string;
    };
  }
}
