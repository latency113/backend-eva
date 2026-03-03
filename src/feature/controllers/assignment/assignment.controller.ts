import { AssignmentService } from "../../services/assignment/assignment.service";
import { AssignmentSchema } from "../../services/assignment/assignment.schema";
import { t, Elysia } from "elysia";

export namespace AssignmentController {
  export const assignmentController = new Elysia({ prefix: "/assignments" })
    .get(
      "/",
      async () => {
        return await AssignmentService.findAll();
      },
      {
        response: {
          200: t.Array(AssignmentSchema),
        },
        500: t.Object({ message: t.String() }),
        tags: ["Assignment"],
      },
    )
    .get(
      "/:id",
      async ({ params, set }) => {
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
      async ({ params, set }) => {
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
      async ({ params, set }) => {
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
      async ({ body, set }) => {
        try {
          const newAssignment = await AssignmentService.create(body);
          set.status = 201;
          return newAssignment;
        } catch (error) {
          set.status = 500;
          return { message: "Internal server error" };
        }
      },
      {
        body: t.Omit(AssignmentSchema, ["id", "createdAt"]),
        response: {
          201: AssignmentSchema,
          500: t.Object({ message: t.String() }),
        },
        tags: ["Assignment"],
      },
    )
    .put(
      "/:id",
      async ({ params, body, set }) => {
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
          404: t.Object({ message: t.String() }),
          500: t.Object({ message: t.String() }),
        },
        tags: ["Assignment"],
      },
    )
    .delete(
      "/:id",
      async ({ params, set }) => {
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
          404: t.Object({ message: t.String() }),
          500: t.Object({ message: t.String() }),
        },
        tags: ["Assignment"],
      },
    );
}
