
import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import connectDB from "./db";
import User from "../models/user";
import bcrypt from "bcryptjs";

// Extend NextAuth types
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      role?: string | null;
    };
  }

  interface User {
    id: string;
    role?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role?: string | null;
  }
}

export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt" }, // JWT token required for middleware
  providers: [
    CredentialsProvider({ //when someone login trigger the function and which argument a Object
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "example@gmail.com" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        await connectDB(); // Connect to MongoDB

        const user = await User.findOne({ email: credentials.email });
        if (!user) throw new Error("No user found with this email");

        const isValid = await bcrypt.compare(credentials.password, user.password);
        if (!isValid) throw new Error("Invalid password");

        return {
          id: user.id.toString(),
          name: user.name,
          email: user.email,
          role: user.role ?? "user", // default role is "user"
        };
      },
    }),
  ],
  callbacks: {
  // JWT callback – login বা session update হলে token assign
  async jwt({ token, user }) {
    if (user) {
      token.id = user.id;
      token.role = user.role ?? "user"; // default role "user"
    }
    return token;
  },

  // Session callback – frontend session তৈরী হবে
  async session({ session, token }) {
    if (session.user) {
      session.user.id = token.id as string;

      // Middleware safe – role সবসময় token থেকে নাও
      session.user.role = token.role ?? "user";
    
    }
    // Debug purpose (production এ remove করা যাবে)
    console.log("Session data:", session);

    return session;
  },
},
  secret:process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/login", // redirect unauthenticated users
  },
};

export default NextAuth(authOptions);
