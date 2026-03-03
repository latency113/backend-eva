import { AuthService } from "../../services/auth/auth.service";
import { jwtPlugin } from "../../../providers/jwt/jwt.provider";
import { t, Elysia } from "elysia";

export namespace AuthController {
    export const authController = new Elysia({ prefix: "/auth" })
        .use(jwtPlugin)
        .post(
            "/login",
            async ({ body, jwt, set }) => {
                try {
                    const { email, password } = body;
                    const result = await AuthService.logIn(email, password, jwt);
                    if (result) {
                        set.status = 200; // Usually 200, but schema says 203? I'll keep 200 for standard or follow schema if strict.
                        // The schema says 203, so I will use 203.
                        set.status = 203;
                        return { token: result.token };
                    } else {
                        set.status = 403;
                        return { message: "Invalid email or password" };
                    }
                } catch (error: any) {
                    set.status = 401;
                    return { message: error.message || "Invalid email or password" };
                }
            },
            {
                body: t.Object({
                    email: t.String(),
                    password: t.String(),
                }),
                response: {
                    203: t.Object({ token: t.String() }),
                    401: t.Object({ message: t.String() }),
                    500: t.Object({ message: t.String() }),
                },
                tags: ["Auth"],
            },
        )
        .post(
            "/register",
            async ({ body, set }) => {
                try {
                    const { name, email, password, departmentId, role } = body;
                    const newUser = await AuthService.register(name, email, password, departmentId, role);
                    set.status = 201;
                    return {
                        id: newUser.id,
                        name: newUser.name,
                        email: newUser.email,
                        role: newUser.role,
                        departmentId: newUser.departmentId,
                        createdAt: newUser.createdAt.toISOString(),
                    };
                } catch (error: any) {
                    if (error.code === "P2002" || (error instanceof Error && error.message.includes("Unique constraint failed"))) {
                        set.status = 409;
                        return { message: "Email already exists" };
                    }
                    set.status = 500;
                    return { message: "Internal server error" };
                }
            },
            {
                body: t.Object({
                    name: t.String(),
                    email: t.String(),
                    password: t.String(),
                    departmentId: t.String(),
                    role: t.UnionEnum(["ADMIN", "EVALUATEE", "EVALUATOR"]),
                }),
                response: {
                    201: t.Object({
                        id: t.String(),
                        name: t.String(),
                        email: t.String(),
                        role: t.UnionEnum(["ADMIN", "EVALUATEE", "EVALUATOR"]),
                        departmentId: t.String(),
                        createdAt: t.String(),
                    }),
                    409: t.Object({ message: t.String() }),
                    500: t.Object({ message: t.String() }),
                },
                tags: ["Auth"],
            },
        );
}