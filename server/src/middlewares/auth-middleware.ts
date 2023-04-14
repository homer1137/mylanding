import { Request, Response, NextFunction } from 'express'
import { ApiError } from '../exeptions/api-error'
import { tokenService } from '../services/token-service';

export function authMiddleware(
  req: any,
  res: Response,
  next: NextFunction,
) {
  try {
    const authorizationHeader = req.headers.authorization
    console.log('authorizationHeader', authorizationHeader)
    if (!authorizationHeader) {
      return next(ApiError.UnauthorizedError())
    }

    const accessToken = authorizationHeader.split(' ')[1];
    if (!accessToken) {
      console.log('hmm.. accesstoken')
      return next(ApiError.UnauthorizedError())
    }

    const userData = tokenService.validateAccessTokden(accessToken)
    if (!userData) {
      console.log('hmm.. problem with validation', accessToken)
      return next(ApiError.UnauthorizedError())
    }

    req.user = userData;
    next();

  } catch (err) {
    console.log('hmm.. some other error')
    return next(ApiError.UnauthorizedError())
  }
}
