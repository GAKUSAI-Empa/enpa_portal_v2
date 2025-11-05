import { APIUserLogin } from '@/app/login/api/accountAPI';
import NextAuth, { AuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
export const authOptions: AuthOptions = {
  // Configure one or more authentication providers
  providers: [
    CredentialsProvider({
      // The name to display on the sign in form (e.g. "Sign in with...")
      name: 'Credentials',
      // `credentials` is used to generate a form on the sign in page.
      // You can specify which fields should be submitted, by adding keys to the `credentials` object.
      // e.g. domain, username, password, 2FA token, etc.
      // You can pass any HTML attribute to the <input> tag through the object.
      credentials: {
        username: { label: 'username', type: 'text', placeholder: 'username' },
        password: { label: 'password', type: 'password' },
      },
      async authorize(credentials, req) {
        try {
          process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0'; // disable self-signed certificate
          const res = await APIUserLogin(credentials?.username, credentials?.password);
          const data = res.data;

          // Kiểm tra response
          if (res.status === 200 && data?.user) {
            const user = {
              accessToken: data.access_token,
              ...data.user,
            };
            return user;
          }

          return null;
        } catch (e: any) {
          throw new Error(e.response?.data?.detail || 'Can not login');
        }
      },
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  debug: true,
  callbacks: {
    async jwt({ token, user, account, trigger, session }) {
      console.log(token);
      if (trigger === 'update') {
        return { ...token, ...session.user };
      }
      return { ...token, ...user };
    },
    async session({ session, token, user }) {
      session.user = token as any; // same type as session user

      return session;
    },
  },
  // secret: process.env.JWT_SECRET, //Đã sử dụng NEXTAUTH_SECRET trong .env
  pages: {
    signIn: '/login',
  },
};
export default NextAuth(authOptions);
