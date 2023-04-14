import jwt, { JwtPayload } from 'jsonwebtoken'

import { pool } from '../db'
import { ApiError } from '../exeptions/api-error'

class TokenService {
  generateTokens(payload: object) {
    try {
      if (process.env.JWT_ACCESS_SECRET && process.env.JWT_REFRESH_SECRET) {
        const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {
          expiresIn: '15m',
        })
        const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
          expiresIn: '30d',
        })
        return {
          accessToken,
          refreshToken,
        }
      } else {
        throw new Error('There is no secret key for access token')
      }
    } catch (error) {
      console.log(error)
    }
  }
  async saveToken(userId: number, refreshToken: string) {
    const tokenData = await pool.query(
      `SELECT * from tokens WHERE user_id=$1`,
      [userId],
    )
    if (tokenData.rows.length) {
      console.log('userId', userId)
      const newToken = await pool.query(
        `UPDATE tokens SET refresh_token = $1 WHERE user_id = $2 RETURNING *`,

        [refreshToken, userId],
      )
      console.log('newToken', newToken.rows)
      return newToken
    } else {
      const newToken = await pool.query(
        `
            INSERT INTO tokens (user_id, refresh_token ) VALUES ($1, $2) RETURNING *
            `,
        [userId, refreshToken],
      )
      return newToken
    }
  }

  async removeToken(refreshToken: string) {
    const tokenData = await pool.query(
      `UPDATE tokens SET refresh_token='' WHERE refresh_token = $1 RETURNING *`,
      [refreshToken],
    )
    if (tokenData.rows.length) {
      return tokenData.rows[0]
    } else ApiError.BadRequest('no sacch token')
  }

  async findToken(refreshToken: string) {
    const tokenData = await pool.query(
      `SELECT * FROM tokens WHERE refresh_token = $1`,
      [refreshToken],
    )
    if (tokenData.rows.length) {
      return tokenData.rows[0]
    } else ApiError.BadRequest('no such token')
  }

  validateAccessTokden(token: string): string | JwtPayload | undefined {
    try {
      if (process.env.JWT_ACCESS_SECRET) {
        const userData = jwt.verify(token, process.env.JWT_ACCESS_SECRET)
        return userData
      } else {
        throw new Error('No JWT_ACCESS_SECRET in .env file')
      }
    } catch (e) {
      console.log(e)
    }
  }

  validateRefreshToken(token: string) {
    try {
      if (process.env.JWT_REFRESH_SECRET) {
        const userData = jwt.verify(token, process.env.JWT_REFRESH_SECRET)
        return userData
      } else {
        throw new Error('No JWT_ACCESS_SECRET in .env file')
      }
    } catch (e) {
      console.log(e)
    }
  }
}

export const tokenService = new TokenService()
