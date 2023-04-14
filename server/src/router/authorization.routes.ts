import { authorization_controller } from '../controllers/authorization-controller'
import { Router } from 'express'
import { body } from 'express-validator'

export const authorizationRouter = Router()

authorizationRouter.post(
  '/registration',
  body('email').isEmail(),
  body('password').isLength({ min: 3, max: 32 }),
  authorization_controller.registration,
)
authorizationRouter.post('/login', authorization_controller.login)
authorizationRouter.post('/logout', authorization_controller.logout)
authorizationRouter.get('/activate/:link', authorization_controller.activate)
authorizationRouter.get('/refresh', authorization_controller.refresh)
authorizationRouter.get('/test', authorization_controller.test)
