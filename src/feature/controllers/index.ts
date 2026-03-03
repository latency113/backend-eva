import Elysia, { t } from "elysia";
import { AuthController } from './auth/auth.controller';
import { UserController } from "./user/user.controller";
import { DepartmentController } from "./department/department.controller";
import { EvaluationController } from "./evaluation/evaluation.controller";
import { TopicController } from "./topic/topic.controller";
import { IndicatorController } from "./indicator/indicator.controller";
import { IndicatorEvidenceController } from "./indicatorEvidence/indicatorEvidence.controller";
import { AssignmentController } from "./assignment/assignment.controller";
import { IndicatorResultController } from "./indicatorResult/indicatorResult.controller";

import { jwtPlugin } from "../../providers/jwt/jwt.provider";
import { AuthPayload } from "../../providers/auth/auth.middleware";

export const appController = new Elysia().group("/api/v1", (app) => {
    // Add logging to EVERY request in this group
    app.onBeforeHandle(({ request }) => {
        console.log(`[V1-LOG] ${request.method} ${new URL(request.url).pathname}`);
    });

    // Public routes
    app.use(AuthController.authController);

    // Protected routes
    return app.group("", (protectedApp) => {
        return protectedApp
            .use(jwtPlugin)
            .derive(async ({ jwt, headers }) => {
                const authorization = headers["authorization"];
                console.log(`[INLINE-AUTH-DERIVE] Header:`, authorization ? "Exists" : "MISSING");

                if (!authorization || !authorization.startsWith("Bearer ")) {
                    return { user: null };
                }

                const token = authorization.split(" ")[1];
                const payload = await jwt.verify(token);
                console.log(`[INLINE-AUTH-DERIVE] Payload:`, payload ? "VALID" : "INVALID");

                return { user: payload as any as AuthPayload };
            })
            .onBeforeHandle(({ user, set, request }) => {
                const path = new URL(request.url).pathname;
                console.log(`[INLINE-AUTH-CHECK] ${path}, User:`, user?.id || "anonymous");
                if (!user) {
                    set.status = 401;
                    return { message: "Unauthorized: Invalid or missing token" };
                }
            })
            .use(UserController.userController)
            .use(DepartmentController.departmentController)
            .use(EvaluationController.evaluationController)
            .use(TopicController.topicController)
            .use(IndicatorController.indicatorController)
            .use(IndicatorEvidenceController.indicatorEvidenceController)
            .use(AssignmentController.assignmentController)
            .use(IndicatorResultController.indicatorResultController);
    });
});