import { UserService } from "../../services/user/user.service";
import { UserSchema } from "../../services/user/user.schema";
import Elysia, { t } from "elysia";

export namespace UserController {
  export const userController = new Elysia({ prefix: "/users" })
    .get(
      "/",
      async (context) => {
        const { query } = context as any;
        const { role } = query;
        return await UserService.findAll(role);
      },
      {
        response: {
          200: t.Array(t.Omit(UserSchema, ["password"])),
        },
        500: t.Object({ message: t.String() }),
        tags: ["User"],
      },
    )
    .post(
      "/",
      async (context) => {
        const { body, set, user } = context as any;
        if (user?.role !== "ADMIN") {
          set.status = 403;
          return { message: "Forbidden: Only ADMIN can create users" };
        }
        try {
          const newUser = await UserService.create(body);
          set.status = 201;
          return newUser;
        } catch (error) {
          if (error instanceof Error && error.message.includes("Unique constraint failed")) {
            set.status = 409;
            return { message: "Email already exists" };
          }
          set.status = 500;
          return { message: "Internal server error" };
        }
      },
      {
        body: t.Omit(UserSchema, ["id", "createdAt"]),
        response: {
          201: (UserSchema),
          403: t.Object({ message: t.String() }),
          409: t.Object({ message: t.String() }),
          500: t.Object({ message: t.String() }),
        },
        tags: ["User"],
      },
    )
    .put('/:id',
      async (context) => {
        const { params, body, set, user } = context as any;
        if (user?.role !== "ADMIN") {
          set.status = 403;
          return { message: "Forbidden: Only ADMIN can update users" };
        }
        try {
          const updatedUser = await UserService.update(params.id, body);
          return updatedUser;
        } catch (error) {
          set.status = 500;
          return { message: "Internal server error" };
        }
      },
      {
        params: t.Object({
          id: t.String(),
        }),
        body: t.Omit(UserSchema, ["id", "createdAt", "password"]),
        response: {
          200: UserSchema,
          403: t.Object({ message: t.String() }),
          404: t.Object({ message: t.String() }),
          500: t.Object({ message: t.String() }),
        },
        tags: ["User"],
      },
    )
    .delete(
      "/:id",
      async (context) => {
        const { params, set, user } = context as any;
        if (user?.role !== "ADMIN") {
          set.status = 403;
          return { message: "Forbidden: Only ADMIN can delete users" };
        }
        try {
          await UserService.deleteById(params.id);
          return { message: "User deleted successfully" };
        } catch (error) {
          set.status = 500;
          return { message: "Internal server error" };
        }
      },
      {
        params: t.Object({
          id: t.String(),
        }),
        response: {
          200: t.Object({ message: t.String() }),
          403: t.Object({ message: t.String() }),
          404: t.Object({ message: t.String() }),
          500: t.Object({ message: t.String() }),
        },
        tags: ["User"],
      },
    )
}
