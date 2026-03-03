import { IndicatorService } from "../../services/indicator/indicator.service";
import { IndicatorSchema } from "../../services/indicator/indicator.schema";
import { t, Elysia } from "elysia";

export namespace IndicatorController {
  export const indicatorController = new Elysia({ prefix: "/indicators" })
    .get(
      "/",
      async () => {
        return await IndicatorService.findAll();
      },
      {
        response: {
          200: t.Array(IndicatorSchema),
        },
        500: t.Object({ message: t.String() }),
        tags: ["Indicator"],
      },
    )
    .get(
      "/:id",
      async ({ params, set }) => {
        try {
          const indicator = await IndicatorService.findById(params.id);
          if (!indicator) {
            set.status = 404;
            return { message: "Indicator not found" };
          }
          return indicator;
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
          200: IndicatorSchema,
          404: t.Object({ message: t.String() }),
          500: t.Object({ message: t.String() }),
        },
        tags: ["Indicator"],
      },
    )
    .get(
      "/topic/:topicId",
      async ({ params, set }) => {
        try {
          return await IndicatorService.findByTopicId(params.topicId);
        } catch (error) {
          set.status = 500;
          return { message: "Internal server error" };
        }
      },
      {
        params: t.Object({
          topicId: t.String(),
        }),
        response: {
          200: t.Array(IndicatorSchema),
          500: t.Object({ message: t.String() }),
        },
        tags: ["Indicator"],
      }
    )
    .post(
      "/",
      async ({ body, set }) => {
        try {
          const newIndicator = await IndicatorService.create(body);
          set.status = 201;
          return newIndicator;
        } catch (error) {
          set.status = 500;
          return { message: "Internal server error" };
        }
      },
      {
        body: t.Omit(IndicatorSchema, ["id", "createdAt"]),
        response: {
          201: IndicatorSchema,
          500: t.Object({ message: t.String() }),
        },
        tags: ["Indicator"],
      },
    )
    .put(
      "/:id",
      async ({ params, body, set }) => {
        try {
          const updatedIndicator = await IndicatorService.update(params.id, body);
          if (!updatedIndicator) {
            set.status = 404;
            return { message: "Indicator not found" };
          }
          return updatedIndicator;
        } catch (error) {
          set.status = 500;
          return { message: "Internal server error" };
        }
      },
      {
        params: t.Object({
          id: t.String(),
        }),
        body: t.Omit(IndicatorSchema, ["id", "createdAt", "topicId"]),
        response: {
          200: IndicatorSchema,
          404: t.Object({ message: t.String() }),
          500: t.Object({ message: t.String() }),
        },
        tags: ["Indicator"],
      },
    )
    .delete(
      "/:id",
      async ({ params, set }) => {
        try {
          await IndicatorService.deleteById(params.id);
          return { message: "Indicator deleted successfully" };
        } catch (error: any) {
          if (error.code === "P2025") {
            set.status = 404;
            return { message: "Indicator not found" };
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
        tags: ["Indicator"],
      },
    );
}
