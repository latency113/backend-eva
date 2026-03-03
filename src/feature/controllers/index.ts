import Elysia from "elysia";
import { AuthController } from './auth/auth.controller';
import { UserController } from "./user/user.controller";
import { DepartmentController } from "./department/department.controller";
import { EvaluationController } from "./evaluation/evaluation.controller";
import { TopicController } from "./topic/topic.controller";
import { IndicatorController } from "./indicator/indicator.controller";
import { IndicatorEvidenceController } from "./indicatorEvidence/indicatorEvidence.controller";
import { AssignmentController } from "./assignment/assignment.controller";
import { IndicatorResultController } from "./indicatorResult/indicatorResult.controller";

export const appController = new Elysia().group("/api/v1",(app) => {
    app.use(UserController.userController);
    app.use(DepartmentController.departmentController);
    app.use(AuthController.authController)
    app.use(EvaluationController.evaluationController)
    app.use(TopicController.topicController)
    app.use(IndicatorController.indicatorController)
    app.use(IndicatorEvidenceController.indicatorEvidenceController)
    app.use(AssignmentController.assignmentController)
    app.use(IndicatorResultController.indicatorResultController)
    return app;
});