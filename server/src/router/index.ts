import { Router } from "express"
import { course_controller } from "../controllers/user-controller";

export const defaultRouter = Router();

defaultRouter.post('/registration');
defaultRouter.post('/login');
defaultRouter.post('/logout');
defaultRouter.get('/activate/:link');
defaultRouter.get('/refresh');

defaultRouter.post('/courses', course_controller.createCourse);
defaultRouter.get('/courses', course_controller.getCourses);
defaultRouter.get('/courses/:id', course_controller.getCourseById);
defaultRouter.put('/courses/:id', course_controller.updateCourse);
defaultRouter.delete('/courses/:id', course_controller.deleteCourse);

 