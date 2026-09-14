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
        console.log("Authorize called with:", credentials);
        if (!credentials?.email || !credentials?.otp) {
          console.log("Missing credentials");
          return null;
        }

        const email = credentials.email.toLowerCase();
        const storedData = await otpStore.get(email);
        console.log("Stored data for", email, ":", storedData);

        if (!storedData) {
          console.log("No stored data found");
          return null;
        }

        if (Date.now() > storedData.expiresAt) {
          console.log("OTP expired");
          await otpStore.delete(email);
          return null;
        }

        if (storedData.otp !== credentials.otp) {
          console.log("OTP mismatch. Expected:", storedData.otp, "Got:", credentials.otp);
          return null;
        }

        // OTP is valid, remove it
        await otpStore.delete(email);

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
