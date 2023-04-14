import { video_controller } from "../controllers/video-controller";
import { Router } from "express"
import { authMiddleware } from "../middlewares/auth-middleware";

export const videoRouter = Router();


videoRouter.post('/videos', video_controller.createVideo);
videoRouter.get('/videos', authMiddleware, video_controller.getVideos);
videoRouter.get('/videos/:id', video_controller.getVideoById);
videoRouter.put('/videos', video_controller.updateVideoTitle);
videoRouter.delete('/videos/:id', video_controller.deleteVideo);