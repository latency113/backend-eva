import { Elysia } from "elysia";
import dotenv from "dotenv";
import swagger from "@elysiajs/swagger";
import cors from "@elysiajs/cors";
import { appController } from "./feature/controllers";
import jwt from "@elysiajs/jwt";
import { staticPlugin } from "@elysiajs/static";
import { authContext } from "./providers/auth/auth.middleware";

dotenv.config();

const app = new Elysia()
  .use(cors())
  .use(staticPlugin({
    assets: "public",
    prefix: "/api/v1/public"
  }))
  .use(
    swagger({
      path: "/docs",
    }),
  )
  .use(authContext)
  .use(appController)
  .get("/", () => "ok")
  .listen(process.env.PORT || 3001);

console.log(
  `🦊 Elysia is running at http://${app.server?.hostname}:${app.server?.port}/docs`,
);
