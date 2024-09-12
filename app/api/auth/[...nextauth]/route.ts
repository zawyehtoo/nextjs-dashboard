import NextAuth from "next-auth"
import { authConfig } from "@/auth.config"

const handler = NextAuth(authConfig);

export { GET, POST } from "@/auth"; // change the route to the auth.ts path if it's not the same