import { t } from "elysia";

export const IndicatorResultSchema = t.Object({
  id: t.String(),
  indicatorId: t.String(),
  assignmentId: t.String(),
  score: t.Number(),
  evidenceUrl: t.Optional(t.String()),
  indicator: t.Optional(t.Any()),
  assignment: t.Optional(t.Any()),
  createdAt: t.String(),
});

export type IndicatorResult = typeof IndicatorResultSchema.static;
