import { Request, Response } from "express";
import {pool} from '../db'
class UserController {
    async createUser(req: Request, res: Response) {
        const {name, surname, email, authorised} = req.body
        const newUser = await pool.query(`INSERT INTO users (name, surname, email, authorised) values ($1, $2, $3, $4) RETURNING *`, [name, surname, email, authorised])
        res.json(newUser.rows[0])
    }
    async getUsers(req: Request, res: Response) {
        const users = await pool.query('SELECT * FROM users ORDER BY id ASC')
        res.json(users.rows)
    }
    async getUserById(req: Request, res: Response) {
        const id=req.params.id;
        const user = await pool.query(`SELECT * from users WHERE id=$1`, [id])
        if (user.rows.length){
            res.json(user.rows)
        } else res.json({data: 'there is no user with such id'})
        
    }
    async updateUserName(req: Request, res: Response) {
        const {id, name} = req.body;
        const apdatedUser = await pool.query(`UPDATE users SET name=$1 where id=$2 RETURNING *`, [name, id])
        if (apdatedUser.rows.length){
            res.json(apdatedUser.rows[0])
        } else res.json({data: 'there is no user with such id'})
        
    }
    async deleteUser(req: Request, res: Response) {
        const id=req.params.id;
        const user = await pool.query(`DELETE from users WHERE id=$1 RETURNING *`, [id])
        if (user.rows.length){
            res.json(user.rows)
        } else res.json({data: 'there is no user with such id'})
    }
}

export const user_controller = new UserController(); 