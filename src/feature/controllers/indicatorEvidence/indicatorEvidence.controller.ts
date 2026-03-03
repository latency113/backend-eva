import { IndicatorEvidenceService } from "../../services/indicatorEvidence/indicatorEvidence.service";
import { IndicatorEvidenceSchema } from "../../services/indicatorEvidence/indicatorEvidence.schema";
import { t, Elysia } from "elysia";
import { authMiddleware, requireAuth } from "../../../providers/auth/auth.middleware";

export namespace IndicatorEvidenceController {
  export const indicatorEvidenceController = new Elysia({ prefix: "/indicator-evidences" })
    .use(authMiddleware)
    .use(requireAuth)
    .get(
      "/",
      async () => {
        return await IndicatorEvidenceService.findAll();
      },
      {
        response: {
          200: t.Array(IndicatorEvidenceSchema),
        },
        500: t.Object({ message: t.String() }),
        tags: ["IndicatorEvidence"],
      },
    )
    .get(
      "/:id",
      async ({ params, set }) => {
        try {
          const evidence = await IndicatorEvidenceService.findById(params.id);
          if (!evidence) {
            set.status = 404;
            return { message: "IndicatorEvidence not found" };
          }
          return evidence;
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
          200: IndicatorEvidenceSchema,
          404: t.Object({ message: t.String() }),
          500: t.Object({ message: t.String() }),
        },
        tags: ["IndicatorEvidence"],
      },
    )
    .get(
      "/indicator/:indicatorId",
      async ({ params, set }) => {
        try {
          return await IndicatorEvidenceService.findByIndicatorId(params.indicatorId);
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
          200: t.Array(IndicatorEvidenceSchema),
          500: t.Object({ message: t.String() }),
        },
        tags: ["IndicatorEvidence"],
      }
    )
    .get(
      "/evaluatee/:evaluateeId",
      async ({ params, set }) => {
        try {
          return await IndicatorEvidenceService.findByEvaluateeId(params.evaluateeId);
        } catch (error) {
          set.status = 500;
          return { message: "Internal server error" };
        }
      },
      {
        params: t.Object({
          evaluateeId: t.String(),
        }),
        response: {
          200: t.Array(IndicatorEvidenceSchema),
          500: t.Object({ message: t.String() }),
        },
        tags: ["IndicatorEvidence"],
      }
    )
    .post(
      "/",
      async (context) => {
        const { body, set, user } = context as any;
        // User should only submit their own evidence unless Admin
        if (user?.role !== "ADMIN" && user.id !== body.evaluateeId) {
            set.status = 403;
            return { message: "Forbidden: You can only submit evidence for yourself" };
        }
        try {
          const newEvidence = await IndicatorEvidenceService.create(body);
          set.status = 201;
          return newEvidence;
        } catch (error) {
          set.status = 500;
          return { message: "Internal server error" };
        }
      },
      {
        body: t.Omit(IndicatorEvidenceSchema, ["id", "createdAt"]),
        response: {
          201: IndicatorEvidenceSchema,
          403: t.Object({ message: t.String() }),
          500: t.Object({ message: t.String() }),
        },
        tags: ["IndicatorEvidence"],
      },
    )
    .put(
      "/:id",
      async ({ params, body, set }) => {
        try {
          const updatedEvidence = await IndicatorEvidenceService.update(params.id, body);
          if (!updatedEvidence) {
            set.status = 404;
            return { message: "IndicatorEvidence not found" };
          }
          return updatedEvidence;
        } catch (error) {
          set.status = 500;
          return { message: "Internal server error" };
        }
      },
      {
        params: t.Object({
          id: t.String(),
        }),
        body: t.Omit(IndicatorEvidenceSchema, ["id", "createdAt", "indicatorId", "evaluateeId"]),
        response: {
          200: IndicatorEvidenceSchema,
          404: t.Object({ message: t.String() }),
          500: t.Object({ message: t.String() }),
        },
        tags: ["IndicatorEvidence"],
      },
    )
    .delete(
      "/:id",
      async ({ params, set }) => {
        try {
          await IndicatorEvidenceService.deleteById(params.id);
          return { message: "IndicatorEvidence deleted successfully" };
        } catch (error: any) {
          if (error.code === "P2025") {
            set.status = 404;
            return { message: "IndicatorEvidence not found" };
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
        tags: ["IndicatorEvidence"],
      },
    );
}
