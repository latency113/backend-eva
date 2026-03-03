import { UserService } from "../../services/user/user.service";
import { UserSchema } from "../../services/user/user.schema";
import Elysia, { t } from "elysia";

export namespace UserController {
  export const userController = new Elysia({ prefix: "/users" })
  .get(
    "/",
    async ({ query }) => {
      const { role } = query as { role?: string };
      return await UserService.findAll(role);
    },
    {
      body: t.Omit(UserSchema, ["password", "createdAt"]),
      response: {
        201: t.Array(t.Omit(UserSchema, ["password"])),
      },
      409: t.Object({ message: t.String() }),
      500: t.Object({ message: t.String() }),
      tags: ["User"],
    },
  )
  .post(
    "/",
    async ({ body }) => {
      try {
        const newUser = await UserService.create(body);
        return newUser;
      } catch (error) {
        if (error instanceof Error && error.message.includes("Unique constraint failed")) {
          return { message: "Email already exists" };
        }
        return { message: "Internal server error" };
      }
    },
    {
      body: t.Omit(UserSchema, ["id", "createdAt"]),
      response: {
        201: (UserSchema),
        409: t.Object({ message: t.String() }),
        500: t.Object({ message: t.String() }),
      },
      tags: ["User"],
    },
  )
  .put('/:id',
    async ({ params, body }) => {
      try {
        const updatedUser = await UserService.update(params.id, body);
        return updatedUser;
      } catch (error) {
        return { message: "Internal server error" };
      }
    },
    {
      params: t.Object({
        id: t.String(),
      }),
      body: t.Omit(UserSchema, ["id", "createdAt"]),
      response: {
        201: UserSchema,
        404: t.Object({ message: t.String() }),
        500: t.Object({ message: t.String() }),
      },
      tags: ["User"],
    },
  )
  .delete(
    "/:id",
    async ({ params }) => {
      try {
        await UserService.deleteById(params.id);
        return { message: "User deleted successfully" };
      } catch (error) {
        return { message: "Internal server error" };
      }
    },
    {
      params: t.Object({
        id: t.String(),
      }),
      response: {
        200: t.Object({ message: t.String() }),
        404: t.Object({ message: t.String() }),
        500: t.Object({ message: t.String() }),
      },
      tags: ["User"],
    },
  )
}
