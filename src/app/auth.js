import NextAuth from "next-auth";

import Google from "next-auth/providers/google";
import Github from "next-auth/providers/github";
import Discord from "next-auth/providers/discord";
import Credentials from "next-auth/providers/credentials";

import connectToDb from "@/config/db";
import User from "@/models/User";

import { passwordRegex } from "@/lib/helpers";
import { compare } from "bcryptjs";

export const {
  auth,
  handlers: { GET, POST },
  signIn,
} = NextAuth({
  providers: [
    Google,
    Github,
    Discord,
    Credentials({
      credentials: {
        email: {},
        password: {},
      },
      async authorize(credentials) {
        const { email, password } = credentials;

        if (!email || !passwordRegex.test(password)) {
          throw new Error("اطلاعات نامعتبر میباشد !");
        }

        connectToDb();

        const user = await User.findOne({ email: email.toLowerCase().trim() });

        if (!user) {
          throw new Error("کاربری یافت نشد !");
        }

        if (user.provider === "google") {
          throw new Error("لطفا با حساب گوگل خود وارد شوید !");
        }

        if (user.provider === "github") {
          throw new Error("لطفا با حساب گیت هاب خود وارد شوید !");
        }

        if (user.provider === "discord") {
          throw new Error("لطفا با حساب دیسکورد خود وارد شوید !");
        }

        const isPasswordCorrect = await compare(password, user.password);

        if (!isPasswordCorrect) {
          throw new Error("ایمیل یا گذرواژه صحیح نمیباشد !");
        }

        return user;
      },
    }),
  ],
  callbacks: {
    async signIn({ account, profile }) {
      if (
        account.provider === "google" ||
        account.provider === "github" ||
        account.provider === "discord"
      ) {
        connectToDb();

        const user = await User.findOne({
          email: profile.email,
        });

        if (!user) {
          await User.create({
            name:
              account.provider === "discord"
                ? profile.global_name
                : profile.name,
            email: profile.email,
            image:
              account.provider === "google"
                ? profile.picture
                : account.provider === "discord"
                  ? profile.image_url
                  : profile.avatar_url,
            provider: account.provider,
          });
        }

        return true;
      }
      return true;
    },
  },
  session: {
    strategy: "jwt",
  },
  pages: {
    error: "/",
    signIn: "/",
  },
  cookies: {
    pkceCodeVerifier: {
      name: "next-auth.pkce.code_verifier",
      options: {
        httpOnly: true,
        path: "/",
        sameSite: "lax", 
        secure: true, 
      },
    },
  },
});
