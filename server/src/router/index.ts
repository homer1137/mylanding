import { Router } from "express"

export const defaultRouter = Router();

defaultRouter.post('/registration');
defaultRouter.post('/login');
defaultRouter.post('/logout');
defaultRouter.get('/activate/:link');
defaultRouter.get('/refresh');

 