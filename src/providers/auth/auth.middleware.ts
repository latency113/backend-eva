import { Elysia } from "elysia";
import jwt from "@elysiajs/jwt";

// Interface for what we expect in the JWT payload
export interface AuthPayload {
  id: string;
  username: string;
  role: "ADMIN" | "EVALUATOR" | "EVALUATEE";
}

export const authMiddleware = new Elysia({ name: "auth.middleware" })
  .use(
    jwt({
      name: "jwt",
      secret: process.env.JWT_SECRET || "fallback_secret",
    })
  )
  .resolve(async ({ jwt, headers }) => {
    try {
      const authorization = headers["authorization"];
      if (!authorization || !authorization.startsWith("Bearer ")) {
        return { user: { role: "auth_header_missing", orig: authorization } };
      }

      const token = authorization.split(" ")[1];
      const payload = await jwt.verify(token);

      if (!payload) {
        return { user: { role: "payload_verification_failed", token } };
      }

      return { user: payload as any as AuthPayload };
    } catch (e: any) {
      return { user: { role: "auth_exception", error: e.message } };
    }
  });

export const requireAuth = new Elysia()
  .use(authMiddleware)
  .onBeforeHandle(({ user, set }: any) => {
    if (!user) {
      set.status = 401;
      return { message: "Unauthorized: Invalid or missing token" };
    }
  });
