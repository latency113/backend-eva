import { IndicatorResultService } from "../../services/indicatorResult/indicatorResult.service";
import { IndicatorResultSchema } from "../../services/indicatorResult/indicatorResult.schema";
import { IndicatorService } from "../../services/indicator/indicator.service";
import { AssignmentService } from "../../services/assignment/assignment.service";
import { IndicatorEvidenceService } from "../../services/indicatorEvidence/indicatorEvidence.service";
import { t, Elysia } from "elysia";

export namespace IndicatorResultController {
  export const indicatorResultController = new Elysia({ prefix: "/indicator-results" })
    .get(
      "/",
      async (context: any) => {
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
      async (context: any) => {
        const { params, set } = context as any;
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
      async (context: any) => {
        const { params, set } = context as any;
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
      async (context: any) => {
        const { params, set } = context as any;
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
      async (context: any) => {
        const { body, set, user } = context as any;

        try {
          // Verify Indicator requirements
          const indicator = await IndicatorService.findById(body.indicatorId);
          if (!indicator) {
            set.status = 404;
            return { message: "Indicator not found" };
          }

          if (indicator.requiredEvidences) {
            const assignment = await AssignmentService.findById(body.assignmentId);
            if (!assignment) {
              set.status = 404;
              return { message: "Assignment not found" };
            }
            const evidences = await IndicatorEvidenceService.findByIndicatorId(body.indicatorId);
            const userEvidences = evidences.filter((e: any) => e.evaluateeId === assignment.evaluateeId);
            if (userEvidences.length === 0) {
              set.status = 400;
              return { message: "Evidence is required for this indicator" };
            }
          }

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
          400: t.Object({ message: t.String() }),
          404: t.Object({ message: t.String() }),
          500: t.Object({ message: t.String() }),
        },
        tags: ["IndicatorResult"],
      },
    )
    .put(
      "/:id",
      async (context: any) => {
        const { params, body, set } = context as any;
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
      async (context: any) => {
        const { params, set } = context as any;
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
