import { t } from "elysia";

export const IndicatorResultSchema = t.Object({
  id: t.String(),
  indicatorId: t.String(),
  assignmentId: t.String(),
  score: t.Number(),
  evidenceUrl: t.Optional(t.String()),
  createdAt: t.String(),
});

export type IndicatorResult = typeof IndicatorResultSchema.static;
