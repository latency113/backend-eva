import { AssignmentService } from "../../services/assignment/assignment.service";
import { AssignmentSchema } from "../../services/assignment/assignment.schema";
import { t, Elysia } from "elysia";
import { AuthPayload } from "../../../providers/auth/auth.middleware";

export namespace AssignmentController {
  export const assignmentController = new Elysia({ prefix: "/assignments" })
    .get(
      "/",
      async (context) => {
        const { user } = context as unknown as { user: AuthPayload | null };
        if (!user) {
          return []; // or throw 401
        }

        let assignments: any[] = [];
        if (user.role === "ADMIN") {
          assignments = await AssignmentService.findAll();
        } else if (user.role === "EVALUATOR") {
          assignments = await AssignmentService.findByEvaluatorId(user.id);
        } else if (user.role === "EVALUATEE") {
          assignments = await AssignmentService.findByEvaluateeId(user.id);
        }

        // Fetch scores for all assignments concurrently
        const assignmentsWithScores = await Promise.all(
          assignments.map(async (assignment: any) => {
            const scoreResult = await AssignmentService.calculateScore(assignment.id);
            return {
              ...assignment,
              scoreDetails: scoreResult,
            };
          })
        );

        return assignmentsWithScores;
      },
      {
        response: {
          200: t.Array(t.Object({
            id: t.String(),
            evaluationId: t.String(),
            evaluatorId: t.String(),
            evaluateeId: t.String(),
            createdAt: t.String(),
            scoreDetails: t.Union([t.Null(), t.Object({
              assignmentId: t.String(),
              totalScore: t.Number(),
              maxPossibleScore: t.Number(),
              percentage: t.Number()
            })]),
          })),
        },
        500: t.Object({ message: t.String() }),
        tags: ["Assignment"],
      },
    )
    .get(
      "/:id",
      async (context) => {
        const { params, set } = context as any;
        try {
          const assignment = await AssignmentService.findById(params.id);
          if (!assignment) {
            set.status = 404;
            return { message: "Assignment not found" };
          }
          return assignment;
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
          200: AssignmentSchema,
          404: t.Object({ message: t.String() }),
          500: t.Object({ message: t.String() }),
        },
        tags: ["Assignment"],
      },
    )
    .get(
      "/:id/score",
      async ({ params, set }) => {
        try {
          const scoreResult = await AssignmentService.calculateScore(params.id);
          if (!scoreResult) {
            set.status = 404;
            return { message: "Assignment not found" };
          }
          return scoreResult;
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
          200: t.Any(),
          404: t.Object({ message: t.String() }),
          500: t.Object({ message: t.String() }),
        },
        tags: ["Assignment"],
      },
    )
    .get(
      "/evaluation/:evaluationId",
      async ({ params, set }) => {
        try {
          return await AssignmentService.findByEvaluationId(params.evaluationId);
        } catch (error) {
          set.status = 500;
          return { message: "Internal server error" };
        }
      },
      {
        params: t.Object({
          evaluationId: t.String(),
        }),
        response: {
          200: t.Array(AssignmentSchema),
          500: t.Object({ message: t.String() }),
        },
        tags: ["Assignment"],
      }
    )
    .get(
      "/evaluator/:evaluatorId",
      async (context) => {
        const { params, set } = context as any;
        try {
          return await AssignmentService.findByEvaluatorId(params.evaluatorId);
        } catch (error) {
          set.status = 500;
          return { message: "Internal server error" };
        }
      },
      {
        params: t.Object({
          evaluatorId: t.String(),
        }),
        response: {
          200: t.Array(AssignmentSchema),
          500: t.Object({ message: t.String() }),
        },
        tags: ["Assignment"],
      }
    )
    .get(
      "/evaluatee/:evaluateeId",
      async (context) => {
        const { params, set } = context as any;
        try {
          return await AssignmentService.findByEvaluateeId(params.evaluateeId);
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
          200: t.Array(AssignmentSchema),
          500: t.Object({ message: t.String() }),
        },
        tags: ["Assignment"],
      }
    )
    .post(
      "/",
      async (context) => {
        const { body, set, user } = context as unknown as { body: any, set: any, user: AuthPayload | null };
        if (user?.role !== "ADMIN") {
          set.status = 403;
          return { message: "Forbidden: Only ADMIN can create assignments" };
        }
        try {
          const newAssignment = await AssignmentService.create(body);
          set.status = 201;
          return newAssignment;
        } catch (error: any) {
          set.status = 400;
          return { message: error.message || "Internal server error" };
        }
      },
      {
        body: t.Omit(AssignmentSchema, ["id", "createdAt"]),
        response: {
          201: AssignmentSchema,
          403: t.Object({ message: t.String() }),
          400: t.Object({ message: t.String() }),
          500: t.Object({ message: t.String() }),
        },
        tags: ["Assignment"],
      },
    )
    .put(
      "/:id",
      async (context) => {
        const { params, body, set, user } = context as any;
        if (user?.role !== "ADMIN") {
          set.status = 403;
          return { message: "Forbidden: Only ADMIN can update assignments" };
        }
        try {
          const updatedAssignment = await AssignmentService.update(params.id, body);
          if (!updatedAssignment) {
            set.status = 404;
            return { message: "Assignment not found" };
          }
          return updatedAssignment;
        } catch (error) {
          set.status = 500;
          return { message: "Internal server error" };
        }
      },
      {
        params: t.Object({
          id: t.String(),
        }),
        body: t.Omit(AssignmentSchema, ["id", "createdAt"]),
        response: {
          200: AssignmentSchema,
          403: t.Object({ message: t.String() }),
          404: t.Object({ message: t.String() }),
          500: t.Object({ message: t.String() }),
        },
        tags: ["Assignment"],
      },
    )
    .get(
      "/:id/form",
      async (context) => {
        const { params, set } = context as any;
        try {
          const form = await AssignmentService.getForm(params.id);
          if (!form) {
            set.status = 404;
            return { message: "Assignment not found" };
          }
          return form;
        } catch (error) {
          set.status = 500;
          return { message: "Internal server error" };
        }
      },
      {
        params: t.Object({ id: t.String() }),
        response: {
          200: t.Any(),
          404: t.Object({ message: t.String() }),
          500: t.Object({ message: t.String() }),
        },
        tags: ["Assignment"],
      }
    )
    .post(
      "/:id/form",
      async (context) => {
        const { params, body, set } = context as any;
        try {
          await AssignmentService.submitForm(params.id, body.scores);
          return { message: "Success" };
        } catch (error) {
          set.status = 500;
          return { message: "Internal server error" };
        }
      },
      {
        params: t.Object({ id: t.String() }),
        body: t.Object({
          scores: t.Array(t.Object({
            indicatorId: t.String(),
            scoreGiven: t.Number()
          }))
        }),
        tags: ["Assignment"],
      }
    )
    .post(
      "/:id/evidence/:indicatorId",
      async (context) => {
        const { params, body, set, user } = context as any;
        try {
          const assignment = await AssignmentService.findById(params.id);
          if (!assignment) {
            set.status = 404;
            return { message: "Assignment not found" };
          }

          if (user?.role === "EVALUATEE" && assignment.evaluateeId !== user.id) {
            set.status = 403;
            return { message: "Forbidden: You can only upload evidence for your own assignments" };
          }

          const file = body.file;
          const fileName = `${Date.now()}_${file.name.replace(/\s+/g, "_")}`;
          const filePath = `public/uploads/evidences/${fileName}`;

          await Bun.write(filePath, file);

          const fileUrl = `/public/uploads/evidences/${fileName}`;
          await AssignmentService.uploadEvidence(params.id, params.indicatorId, fileUrl);
          return { message: "Success", url: fileUrl };
        } catch (error) {
          set.status = 500;
          return { message: "Internal server error" };
        }
      },
      {
        params: t.Object({ id: t.String(), indicatorId: t.String() }),
        body: t.Any(),
        tags: ["Assignment"],
      }
    )
    .delete(
      "/:id",
      async (context) => {
        const { params, set, user } = context as any;
        if (user?.role !== "ADMIN") {
          set.status = 403;
          return { message: "Forbidden: Only ADMIN can delete assignments" };
        }
        try {
          await AssignmentService.deleteById(params.id);
          return { message: "Assignment deleted successfully" };
        } catch (error: any) {
          if (error.code === "P2025") {
            set.status = 404;
            return { message: "Assignment not found" };
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
        tags: ["Assignment"],
      },
    );
}
