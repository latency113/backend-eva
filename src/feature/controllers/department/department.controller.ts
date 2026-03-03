import { DepartmentService } from "../../services/department/department.service";
import { DepartmentSchema } from "../../services/department/department.schema";
import { t, Elysia } from "elysia";

export namespace DepartmentController {
  export const departmentController = new Elysia({ prefix: "/departments" })
    .get(
      "/",
      async () => {
        return await DepartmentService.findAll();
      },
      {
        response: {
          200: t.Array(DepartmentSchema),
        },
        500: t.Object({ message: t.String() }),
        tags: ["Department"],
      },
    )
    .get(
      "/:id",
      async (context) => {
        const { params, set } = context as any;
        try {
          const department = await DepartmentService.findById(params.id);
          if (!department) {
            set.status = 404;
            return { message: "Department not found" };
          }
          return department;
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
          200: DepartmentSchema,
          404: t.Object({ message: t.String() }),
          500: t.Object({ message: t.String() }),
        },
        tags: ["Department"],
      },
    )
    .post(
      "/",
      async (context) => {
        const { body, set, user } = context as any;
        if (user?.role !== "ADMIN") {
          set.status = 403;
          return { message: "Forbidden: Only ADMIN can create departments" };
        }
        try {
          const newDepartment = await DepartmentService.create(body);
          set.status = 201;
          return newDepartment;
        } catch (error) {
          set.status = 500;
          return { message: "Internal server error" };
        }
      },
      {
        body: t.Omit(DepartmentSchema, ["id", "createdAt"]),
        response: {
          201: DepartmentSchema,
          403: t.Object({ message: t.String() }),
          500: t.Object({ message: t.String() }),
        },
        tags: ["Department"],
      },
    )
    .put(
      "/:id",
      async (context) => {
        const { params, body, set, user } = context as any;
        if (user?.role !== "ADMIN") {
          set.status = 403;
          return { message: "Forbidden: Only ADMIN can update departments" };
        }
        try {
          const updatedDepartment = await DepartmentService.update(params.id, body);
          if (!updatedDepartment) {
            set.status = 404;
            return { message: "Department not found" };
          }
          return updatedDepartment;
        } catch (error) {
          set.status = 500;
          return { message: "Internal server error" };
        }
      },
      {
        params: t.Object({
          id: t.String(),
        }),
        body: t.Omit(DepartmentSchema, ["id", "createdAt"]),
        response: {
          200: DepartmentSchema,
          403: t.Object({ message: t.String() }),
          404: t.Object({ message: t.String() }),
          500: t.Object({ message: t.String() }),
        },
        tags: ["Department"],
      }
    )
    .delete(
      "/:id",
      async (context) => {
        const { params, set, user } = context as any;
        if (user?.role !== "ADMIN") {
          set.status = 403;
          return { message: "Forbidden: Only ADMIN can delete departments" };
        }
        try {
          await DepartmentService.deleteById(params.id);
          return { message: "Department deleted successfully" };
        } catch (error: any) {
          if (error.code === 'P2025') {
            set.status = 404;
            return { message: "Department not found" };
          }
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
        tags: ["Department"],
      },
    )

}
