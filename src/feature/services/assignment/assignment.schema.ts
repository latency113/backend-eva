import { t } from "elysia";

export const AssignmentSchema = t.Object({
  id: t.String(),
  evaluationId: t.String(),
  evaluatorId: t.String(),
  evaluateeId: t.String(),
  createdAt: t.String(),
});

export type Assignment = typeof AssignmentSchema.static;
