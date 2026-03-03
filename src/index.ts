import { Elysia } from "elysia";
import dotenv from "dotenv";
import swagger from "@elysiajs/swagger";
import cors from "@elysiajs/cors";
import { appController } from "./feature/controllers";
import jwt from "@elysiajs/jwt";
import { staticPlugin } from "@elysiajs/static";
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
  .use(
    jwt({
      name: "jwt",
      secret: process.env.JWT_SECRET!,
      exp: "1h",
    }),
  )
  .use(appController)
  .get("/", () => "ok")
  .listen(process.env.PORT || 3000);

console.log(
  `🦊 Elysia is running at http://${app.server?.hostname}:${app.server?.port}/docs`,
);
