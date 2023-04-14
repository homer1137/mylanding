import dotenv from 'dotenv'
import express from 'express'
import cors from 'cors'
import { json } from 'body-parser'
import cookieParser from 'cookie-parser'

import { authorizationRouter } from './router/authorization.routes';
import { defaultRouter } from './router/index'
import { userRouter } from './router/user.routes'
import { videoRouter } from './router/video.routes'
import { errorMiddleware } from './middlewares/error-middleware'


dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

app.use(json())
app.use(cookieParser())
app.use(cors({credentials: true, origin: process.env.CLIENT_URL}))
app.use('/api', defaultRouter)
app.use('/api', userRouter)
app.use('/api', videoRouter)
app.use('/api', authorizationRouter)
app.use('/api', errorMiddleware)

const start = async () => {
  try {

    app.listen(PORT, () => {
      console.log(`🚀 server started at http://localhost:${PORT}`)
    })
  } catch (error) {
    console.log(error)
  }
}

start()
