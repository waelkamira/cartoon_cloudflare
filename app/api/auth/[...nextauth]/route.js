import NextAuth from 'next-auth/next';
import { authOptions } from '../../authOptions/route';
export const runtime = 'nodejs'; // استخدم Node.js بدلاً من Edge

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
