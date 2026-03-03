import { EvaluationService } from "../../services/evaluation/evaluation.service";
import { EvaluationSchema } from "../../services/evaluation/evaluation.schema";
import { t, Elysia } from "elysia";
import { authMiddleware, requireAuth, AuthPayload } from "../../../providers/auth/auth.middleware";

export namespace EvaluationController {
  export const evaluationController = new Elysia({ prefix: "/evaluations" })
    .use(authMiddleware)
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
    .use(requireAuth)
    .resolve(async ({ jwt, headers }) => {
      const auth = headers.authorization;
      const token = auth && auth.startsWith("Bearer ") ? auth.split(" ")[1] : null;
      const payload = token ? await jwt.verify(token) : null;
      return { user: payload as any };
    })
    .post(
      "/",
      async (context: any) => {
        const { body, set, user } = context;
        if (user?.role !== "ADMIN") {
          set.status = 403;
          return { message: "Forbidden: Only ADMIN can create evaluations" };
        }
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
          403: t.Object({ message: t.String() }),
          500: t.Object({ message: t.String() }),
        },
        tags: ["Evaluation"],
      },
    )
    .put(
      "/:id",
      async ({ params, body, set, user }: any) => {
        if (user?.role !== "ADMIN") {
          set.status = 403;
          return { message: "Forbidden: Only ADMIN can update evaluations" };
        }
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
          403: t.Object({ message: t.String() }),
          404: t.Object({ message: t.String() }),
          500: t.Object({ message: t.String() }),
        },
        tags: ["Evaluation"],
      },
    )
    .patch(
      "/:id",
      async ({ params, body, set, user }: any) => {
        if (user?.role !== "ADMIN") {
          set.status = 403;
          return { message: "Forbidden: Only ADMIN can update evaluations" };
        }
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
        body: t.Partial(t.Omit(EvaluationSchema, ["id", "createdAt"])),
        response: {
          200: EvaluationSchema,
          403: t.Object({ message: t.String() }),
          404: t.Object({ message: t.String() }),
          500: t.Object({ message: t.String() }),
        },
        tags: ["Evaluation"],
      },
    )
    .delete(
      "/:id",
      async ({ params, set, user }: any) => {
        if (user?.role !== "ADMIN") {
          set.status = 403;
          return { message: "Forbidden: Only ADMIN can delete evaluations" };
        }
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
