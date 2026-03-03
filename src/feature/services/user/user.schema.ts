import { t } from "elysia";

export const UserSchema = t.Object({
    id: t.String(),
    name: t.String(),
    email: t.String(),
    password: t.String(),
    role: t.UnionEnum(["ADMIN", "EVALUATOR", "EVALUATEE"]),
    departmentId: t.String(),
    createdAt: t.String(),
})


export type User = typeof UserSchema.Type;




//   id           String   @id @default(auto()) @map("_id") @db.ObjectId
//   name         String
//   email        String   @unique
//   password     String
//   role         Role
//   departmentId String
//   createdAt    DateTime @default(now())