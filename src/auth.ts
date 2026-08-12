import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import Credentials from "next-auth/providers/credentials";
import Facebook from "next-auth/providers/facebook";
import Google from "next-auth/providers/google";
import type { AppProviders } from "@auth/core/providers";
import { promoteUserToAdmin } from "@/features/auth/server/auth.repository";
import { findUserProfileById } from "@/features/profile/server/profile.repository";
import { verifyEmailLoginCode } from "@/features/auth/server/email-otp.service";
import { prisma } from "@/server/database/prisma";

const providers: AppProviders = [
  Credentials({
    id: "email-code",
    name: "Email code",
    credentials: { email: { type: "email" }, code: { type: "text" } },
    async authorize(credentials) {
      const email =
        typeof credentials?.email === "string" ? credentials.email : "";
      const code =
        typeof credentials?.code === "string" ? credentials.code : "";
      return verifyEmailLoginCode(email, code);
    },
  }),
];

if (process.env.AUTH_GOOGLE_ID && process.env.AUTH_GOOGLE_SECRET)
  providers.push(Google({ allowDangerousEmailAccountLinking: true }));
if (process.env.AUTH_FACEBOOK_ID && process.env.AUTH_FACEBOOK_SECRET)
  providers.push(Facebook({ allowDangerousEmailAccountLinking: true }));

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma as never),
  session: { strategy: "jwt" },
  providers,
  pages: { signIn: "/" },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role =
          user.email?.toLowerCase() ===
          process.env.ADMIN_EMAIL?.trim().toLowerCase()
            ? "ADMIN"
            : user.role;
      }

      // The profile is the source of truth for fields displayed throughout the
      // app. Refresh it whenever Auth.js reads the JWT so long-lived sessions do
      // not keep a stale name or avatar in the header.
      if (token.id) {
        const profile = await findUserProfileById(token.id as string);
        if (profile) {
          token.name = profile.name;
          token.picture = profile.image;
          token.role = profile.role;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as typeof session.user.role;
        session.user.name = token.name;
        session.user.image = token.picture;
      }
      return session;
    },
  },
  events: {
    async signIn({ user }) {
      if (
        user.email &&
        process.env.ADMIN_EMAIL &&
        user.email.toLowerCase() ===
          process.env.ADMIN_EMAIL.trim().toLowerCase()
      )
        await promoteUserToAdmin(user.email);
    },
  },
});
