import Elysia from "elysia";
import { AuthController } from './auth/auth.controller';
import { UserController } from "./user/user.controller";
import { DepartmentController } from "./department/department.controller";

export const appController = new Elysia().group("/api/v1",(app) => {
    app.use(UserController.userController);
    app.use(DepartmentController.departmentController);
    app.use(AuthController.authController)
    return app;
});