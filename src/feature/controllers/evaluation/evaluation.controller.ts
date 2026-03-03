import { EvaluationService } from "../../services/evaluation/evaluation.service";
import { EvaluationSchema } from "../../services/evaluation/evaluation.schema";
import { t, Elysia } from "elysia";

export namespace EvaluationController {
  export const evaluationController = new Elysia({ prefix: "/evaluations" })
    .get(
      "/",
      async () => {
        return await EvaluationService.findAll();
      },
      {
        response: {
          200: t.Array(EvaluationSchema),
        },
        500: t.Object({ message: t.String() }),
        tags: ["Evaluation"],
      },
    )
    .get(
      "/:id",
      async ({ params, set }) => {
        try {
          const evaluation = await EvaluationService.findById(params.id);
          if (!evaluation) {
            set.status = 404;
            return { message: "Evaluation not found" };
          }
          return evaluation;
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
          200: EvaluationSchema,
          404: t.Object({ message: t.String() }),
          500: t.Object({ message: t.String() }),
        },
        tags: ["Evaluation"],
      },
    )
    .post(
      "/",
      async ({ body, set }) => {
        try {
          const newEvaluation = await EvaluationService.create(body);
          set.status = 201;
          return newEvaluation;
        } catch (error) {
          set.status = 500;
          return { message: "Internal server error" };
        }
      },
      {
        body: t.Omit(EvaluationSchema, ["id", "createdAt"]),
        response: {
          201: EvaluationSchema,
          500: t.Object({ message: t.String() }),
        },
        tags: ["Evaluation"],
      },
    )
    .put(
      "/:id",
      async ({ params, body, set }) => {
        try {
          const updatedEvaluation = await EvaluationService.update(params.id, body);
          if (!updatedEvaluation) {
            set.status = 404;
            return { message: "Evaluation not found" };
          }
          return updatedEvaluation;
        } catch (error) {
          set.status = 500;
          return { message: "Internal server error" };
        }
      },
      {
        params: t.Object({
          id: t.String(),
        }),
        body: t.Omit(EvaluationSchema, ["id", "createdAt"]),
        response: {
          200: EvaluationSchema,
          404: t.Object({ message: t.String() }),
          500: t.Object({ message: t.String() }),
        },
        tags: ["Evaluation"],
      },
    )
    .delete(
      "/:id",
      async ({ params, set }) => {
        try {
          await EvaluationService.deleteById(params.id);
          return { message: "Evaluation deleted successfully" };
        } catch (error: any) {
          if (error.code === "P2025") {
            set.status = 404;
            return { message: "Evaluation not found" };
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
        tags: ["Evaluation"],
      },
    );
}
