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
        async ({ params, set }) => {
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
      async ({ body, set }) => {
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
          500: t.Object({ message: t.String() }),
        },
        tags: ["Department"],
      },
    )
    .put(
        "/:id",
        async ({ params, body, set }) => {
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
            404: t.Object({ message: t.String() }),
            500: t.Object({ message: t.String() }),
          },
          tags: ["Department"], 
        }
    )
     .delete(
        "/:id",
        async ({ params, set }) => {
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
            404: t.Object({ message: t.String() }),
            500: t.Object({ message: t.String() }),
          },
          tags: ["Department"],
        },
      )

}
