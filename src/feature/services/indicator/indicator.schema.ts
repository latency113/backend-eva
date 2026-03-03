import { t } from "elysia";

export const IndicatorSchema = t.Object({
  id: t.String(),
  topicId: t.String(),
  name: t.String(),
  description: t.String(),
  IndicatorType: t.String(),
  requiredEvidences: t.Boolean(),
  weight: t.Number(),
  createdAt: t.String(),
});

export type Indicator = typeof IndicatorSchema.static;
