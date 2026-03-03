import { t } from "elysia";

export const DepartmentSchema = t.Object({
    id: t.String(),
    name: t.String(),
    createdAt: t.String(),
})

export type Department = typeof DepartmentSchema.Type;