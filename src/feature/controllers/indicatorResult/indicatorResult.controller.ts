import { IndicatorResultService } from "../../services/indicatorResult/indicatorResult.service";
import { IndicatorResultSchema } from "../../services/indicatorResult/indicatorResult.schema";
import { t, Elysia } from "elysia";

export namespace IndicatorResultController {
  export const indicatorResultController = new Elysia({ prefix: "/indicator-results" })
    .get(
      "/",
      async () => {
        return await IndicatorResultService.findAll();
      },
      {
        response: {
          200: t.Array(IndicatorResultSchema),
        },
        500: t.Object({ message: t.String() }),
        tags: ["IndicatorResult"],
      },
    )
    .get(
      "/:id",
      async ({ params, set }) => {
        try {
          const result = await IndicatorResultService.findById(params.id);
          if (!result) {
            set.status = 404;
            return { message: "IndicatorResult not found" };
          }
          return result;
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
          200: IndicatorResultSchema,
          404: t.Object({ message: t.String() }),
          500: t.Object({ message: t.String() }),
        },
        tags: ["IndicatorResult"],
      },
    )
    .get(
      "/indicator/:indicatorId",
      async ({ params, set }) => {
        try {
          return await IndicatorResultService.findByIndicatorId(params.indicatorId);
        } catch (error) {
          set.status = 500;
          return { message: "Internal server error" };
        }
      },
      {
        params: t.Object({
          indicatorId: t.String(),
        }),
        response: {
          200: t.Array(IndicatorResultSchema),
          500: t.Object({ message: t.String() }),
        },
        tags: ["IndicatorResult"],
      }
    )
    .get(
      "/assignment/:assignmentId",
      async ({ params, set }) => {
        try {
          return await IndicatorResultService.findByAssignmentId(params.assignmentId);
        } catch (error) {
          set.status = 500;
          return { message: "Internal server error" };
        }
      },
      {
        params: t.Object({
          assignmentId: t.String(),
        }),
        response: {
          200: t.Array(IndicatorResultSchema),
          500: t.Object({ message: t.String() }),
        },
        tags: ["IndicatorResult"],
      }
    )
    .post(
      "/",
      async ({ body, set }) => {
        try {
          const newResult = await IndicatorResultService.create(body);
          set.status = 201;
          return newResult;
        } catch (error) {
          set.status = 500;
          return { message: "Internal server error" };
        }
      },
      {
        body: t.Omit(IndicatorResultSchema, ["id", "createdAt"]),
        response: {
          201: IndicatorResultSchema,
          500: t.Object({ message: t.String() }),
        },
        tags: ["IndicatorResult"],
      },
    )
    .put(
      "/:id",
      async ({ params, body, set }) => {
        try {
          const updatedResult = await IndicatorResultService.update(params.id, body);
          if (!updatedResult) {
            set.status = 404;
            return { message: "IndicatorResult not found" };
          }
          return updatedResult;
        } catch (error) {
          set.status = 500;
          return { message: "Internal server error" };
        }
      },
      {
        params: t.Object({
          id: t.String(),
        }),
        body: t.Omit(IndicatorResultSchema, ["id", "createdAt", "indicatorId", "assignmentId"]),
        response: {
          200: IndicatorResultSchema,
          404: t.Object({ message: t.String() }),
          500: t.Object({ message: t.String() }),
        },
        tags: ["IndicatorResult"],
      },
    )
    .delete(
      "/:id",
      async ({ params, set }) => {
        try {
          await IndicatorResultService.deleteById(params.id);
          return { message: "IndicatorResult deleted successfully" };
        } catch (error: any) {
          if (error.code === "P2025") {
            set.status = 404;
            return { message: "IndicatorResult not found" };
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
        tags: ["IndicatorResult"],
      },
    );
}
