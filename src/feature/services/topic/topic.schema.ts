import { t } from "elysia";

export const TopicSchema = t.Object({
  id: t.String(),
  evaluationId: t.String(),
  name: t.String(),
  description: t.String(),
  createdBy: t.String(),
  createdAt: t.String(),
});

export type Topic = typeof TopicSchema.static;
