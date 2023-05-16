import { pool } from '../db'
import { hash, compare } from 'bcrypt'
import { v4 as uuid } from 'uuid'
import { mailService } from './mail-service'
import { tokenService } from './token-service'
import { UserDto } from '../dto/user-dto'
import { ApiError } from '../exeptions/api-error'

class UserService {
  async registration(
    name: string,
    surname: string,
    email: string,
    password: string,
    is_client = false,
    is_activated = false,
  ) {
    const canidate = await pool.query(`SELECT * from users WHERE email=$1`, [
      email,
    ])
    if (canidate.rows.length) {
      throw ApiError.BadRequest(`Пользователь с таким ${email} уже существует`)
    }

    const hashPassword = await hash(password, 3)
    const activationLink = uuid()

    const newUser = await pool.query(
      `INSERT INTO users (name, surname, email, password, is_client, is_activated, activation_link) values ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [
        name,
        surname,
        email,
        hashPassword,
        is_client,
        is_activated,
        activationLink,
      ],
    )
    await mailService.sendActivationMail(
      email,
      `${process.env.API_URL}/api/activate/${activationLink}`,
    )

    const userDto = new UserDto(
      newUser.rows[0].email,
      newUser.rows[0].id,
      newUser.rows[0].is_activated,
    )
    const tokens = tokenService.generateTokens({ ...userDto })
    if (tokens?.refreshToken) {
      await tokenService.saveToken(+userDto.id, tokens?.refreshToken)
    } else {
      throw ApiError.BadRequest('There is no refresh token')
    }

    return {
      ...tokens,
      user: userDto,
    }
  }

  async activate(activationLink: string) {
    const canidate = await pool.query(
      `SELECT * from users WHERE activation_link=$1`,
      [activationLink],
    )

    if (!canidate.rows.length) {
      throw ApiError.BadRequest(
        `Пользователь с ссылкой ${activationLink} не найден`,
      )
    }
    await pool.query(
      `UPDATE users SET is_activated=true WHERE activation_link=$1`,
      [activationLink],
    )
  }

  async login(email: string, password: string) {
    const user = await pool.query(`SELECT * from users WHERE email=$1`, [email])
    if (!user.rows.length) {
      throw ApiError.LoginError(`Не найдет пользователь с email ${email}`)
    }
    const isPassEquals = await compare(password, user.rows[0].password)
    if (!isPassEquals) {
      throw ApiError.LoginError('Неверный пароль')
    }
    const userDto = new UserDto(
      user.rows[0].email,
      user.rows[0].id,
      user.rows[0].is_activated,
    )

    const tokens = tokenService.generateTokens({ ...userDto })
    if (tokens?.refreshToken) {
      await tokenService.saveToken(+userDto.id, tokens?.refreshToken)
    } else {
      throw ApiError.BadRequest('There is no refresh token')
    }
    return {
      ...tokens,
      user: userDto,
    }
  }
  async logout(refreshToken: string) {
    const token = tokenService.removeToken(refreshToken)
    return token
  }

  async refresh(refreshToken: string) {
    if (!refreshToken) {
      throw ApiError.UnauthorizedError()
    }
    const userData = tokenService.validateRefreshToken(refreshToken)
    const tokenFromDB = await tokenService.findToken(refreshToken)

    if (!userData || !tokenFromDB) {
      throw ApiError.UnauthorizedError()
    }
    const user = await pool.query(`SELECT * from users LEFT JOIN tokens ON tokens.user_id=users.id WHERE refresh_token=$1`, [refreshToken])
    
    if (!user.rows.length) {
      throw ApiError.BadRequest(`Не найдет пользователь`)
    }
    console.log('user', user.rows[0])
    const userDto = new UserDto(
      user.rows[0].email,
      user.rows[0].user_id,
      user.rows[0].is_activated,
    )

    const tokens = tokenService.generateTokens({ ...userDto })
    if (tokens?.refreshToken) {
      await tokenService.saveToken(+userDto.id, tokens?.refreshToken)
    } else {
      throw ApiError.BadRequest('There is no refresh token')
    }
    return {
      ...tokens,
      user: userDto,
    }
  }
}

export const userService = new UserService()
