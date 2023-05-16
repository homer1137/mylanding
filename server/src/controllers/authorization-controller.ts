import { NextFunction, Request, Response } from 'express'
import { userService } from '../services/user-service'
import { validationResult } from 'express-validator/src/validation-result'
import { ApiError } from '../exeptions/api-error'

import { TypedRequestBody } from 'types'
import { UserCreateModel } from 'models/UserModel/userCreateModel'

class AuthorizationController {
  public async registration(
    req: TypedRequestBody<UserCreateModel>,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return next(
          ApiError.BadRequest('Ошибка при валидации:', errors.array()),
        )
      }
      const { name, surname, email, password, is_client, is_activated } =
        req.body
      const userData = await userService.registration(
        name,
        surname,
        email,
        password,
        is_client,
        is_activated,
      )
      if (userData) {
        res.cookie('refreshToken', userData.refreshToken, {
          maxAge: 30 * 24 * 60 * 60 * 1000,
          httpOnly: true,
        })
        res.json(userData)
      }
      return
    } catch (error) {
      next(error)
    }
  }
  public async login(req: Request, res: Response, next: NextFunction,) {
    try {
      const {email, password} = req.body;
      const userData = await userService.login(email, password)
      res.cookie('refreshToken', userData.refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
      })
      res.json(userData)
    } catch (error) {
      console.log('error here: ', error)
      next(error)
    }
  }
  public async logout(req: Request, res: Response, next: NextFunction,) {
    try {
      const {refreshToken} = req.cookies;
      const token = await userService.logout(refreshToken)
      res.clearCookie('refreshToken');
      return res.json(token)
    } catch (error) {
      
      next(error)
    }
  }

  public async activate(req: Request, res: Response, next: NextFunction,) {
    try {
      const acivationLink = req.params.link
      await userService.activate(acivationLink)

      if (process.env.CLIENT_URL) {
        return res.redirect(process.env.CLIENT_URL)
      }
    } catch (error) {
      next(error)
    }
  }

  public async refresh(req: Request, res: Response, next: NextFunction,) {
    try {
      const {refreshToken} = req.cookies;
      console.log('refresh token', refreshToken)
      const userData = await userService.refresh(refreshToken)
      if(userData){res.cookie('refreshToken', userData.refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
      })
      res.json(userData)}
      
    } catch (error) {
      next(error)
    }
  }

  public async test(req: Request, res: Response, next: NextFunction,) {
    try {
      res.json('alles hood')
    } catch (error) {
      next(console.log('Error:', error))
    }
  }
}

export const authorization_controller = new AuthorizationController()
