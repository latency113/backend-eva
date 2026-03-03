import { t } from "elysia";

export const AssignmentSchema = t.Object({
  id: t.String(),
  evaluationId: t.String(),
  evaluatorId: t.String(),
  evaluateeId: t.String(),
  evaluatorName: t.Optional(t.String()),
  evaluateeName: t.Optional(t.String()),
  evaluation: t.Optional(t.Any()),
  totalIndicators: t.Optional(t.Number()),
  totalScorePercentage: t.Optional(t.Number()),
  gradedIndicators: t.Optional(t.Number()),
  createdAt: t.String(),
});

export type Assignment = typeof AssignmentSchema.static;
