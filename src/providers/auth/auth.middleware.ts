import { Elysia } from "elysia";
import { jwtPlugin } from "../jwt/jwt.provider";

// Interface for what we expect in the JWT payload
export interface AuthPayload {
  id: string;
  username: string;
  role: "ADMIN" | "EVALUATOR" | "EVALUATEE";
}

export const authContext = new Elysia({ name: "authContext" })
  .use(jwtPlugin)
  .derive(async ({ jwt, headers }) => {
    try {
      const authorization = headers["authorization"];
      console.log(`[AUTH-DERIVE] Header:`, authorization ? "Exists" : "MISSING");

      if (!authorization || !authorization.startsWith("Bearer ")) {
        return { user: null };
      }

      const token = authorization.split(" ")[1];
      console.log(`[AUTH-DERIVE] Token found, length:`, token.length);

      const payload = await jwt.verify(token);
      console.log(`[AUTH-DERIVE] Payload:`, payload ? "VALID" : "INVALID");

      if (!payload) {
        return { user: null };
      }

      return { user: payload as any as AuthPayload };
    } catch (e: any) {
      console.log(`[AUTH-DERIVE] EXCEPTION:`, e.message);
      return { user: null };
    }
  });

export const requireAuth = (app: Elysia) =>
  app.use(authContext)
    .onBeforeHandle(({ user, set, request }: any) => {
      console.log(`[AUTH-CHECK] ${new URL(request.url).pathname}, User:`, user?.id || "anonymous");
      if (!user) {
        set.status = 401;
        return { message: "Unauthorized: Invalid or missing token" };
      }
    });
