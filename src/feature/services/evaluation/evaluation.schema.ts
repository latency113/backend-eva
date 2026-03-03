import { t } from "elysia";

export const EvaluationSchema = t.Object({
  id: t.String(),
  createdBy: t.String(),
  name: t.String(),
  startDate: t.String(),
  endDate: t.String(),
  createdAt: t.String(),
});

export type Evaluation = typeof EvaluationSchema.Type;
