import { Request, Response } from "express";
import {pool} from '../db'
class VideoController {
    async createVideo(req: Request, res: Response) {
        const {title, link, video_type} = req.body
        const newUser = await pool.query(`INSERT INTO videos (title, link, video_type) values ($1, $2, $3) RETURNING *`, [title, link, video_type])
        res.json(newUser.rows[0])
    }
    async getVideos(req: Request, res: Response) {
        const videos = await pool.query('SELECT * FROM videos ORDER BY id ASC')
        res.json(videos.rows)
    }
    async getVideoById(req: Request, res: Response) {
        const id=req.params.id;
        const video = await pool.query(`SELECT * from videos WHERE id=$1`, [id])
        if (video.rows.length){
            res.json(video.rows)
        } else res.json({data: 'there is no video with such id'})
        
    }
    async updateVideoTitle(req: Request, res: Response) {
        const {id, title} = req.body;
        const apdatedVideo = await pool.query(`UPDATE videos SET title=$1 where id=$2 RETURNING *`, [title, id])
        if (apdatedVideo.rows.length){
            res.json(apdatedVideo.rows[0])
        } else res.json({data: 'there is no video with such id'})
        
    }
    async deleteVideo(req: Request, res: Response) {
        const id=req.params.id;
        const video = await pool.query(`DELETE from videos WHERE id=$1 RETURNING *`, [id])
        if (video.rows.length){
            res.json(video.rows)
        } else res.json({data: 'there is no video with such id'})
    }
}

export const video_controller = new VideoController(); 