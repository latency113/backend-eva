import { t } from "elysia";

export const IndicatorEvidenceSchema = t.Object({
  id: t.String(),
  indicatorId: t.String(),
  evaluateeId: t.String(),
  filename: t.String(),
  createdAt: t.String(),
});

export type IndicatorEvidence = typeof IndicatorEvidenceSchema.static;
