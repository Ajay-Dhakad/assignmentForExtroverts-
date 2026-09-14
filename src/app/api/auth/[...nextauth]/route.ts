import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { otpStore } from "@/lib/otp-store";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "OTP",
      credentials: {
        email: { label: "Email", type: "email" },
        otp: { label: "OTP", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.otp) {
          return null;
        }

        const storedData = otpStore.get(credentials.email);

        if (!storedData) {
          return null;
        }

        if (Date.now() > storedData.expiresAt) {
          otpStore.delete(credentials.email);
          return null;
        }

        if (storedData.otp !== credentials.otp) {
          return null;
        }

        // OTP is valid, remove it
        otpStore.delete(credentials.email);

        // Return a user object (we can use the email as id for now)
        return { id: credentials.email, email: credentials.email };
      },
    }),
  ],
  pages: {
    signIn: "/",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET || "fallback-secret-for-testing",
});

export { handler as GET, handler as POST };
