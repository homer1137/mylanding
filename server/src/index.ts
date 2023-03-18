import dotenv from 'dotenv'
import express from 'express'
import cors from 'cors'
import { json } from 'body-parser'
import cookieParser from 'cookie-parser'
import mongoose, { ConnectOptions } from 'mongoose'

import { defaultRouter } from './router/index'
import { userRouter } from './router/user.routes'
import { videoRouter } from './router/video.routes'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

app.use(json())
app.use(cookieParser())
app.use(cors())
app.use('/api', defaultRouter)
app.use('/api', userRouter)
app.use('/api', videoRouter)



const start = async () => {
  try {
    await mongoose.connect(process.env.DB_URL!, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    } as ConnectOptions)
    app.listen(PORT, () => {
      console.log(`🚀 server started at http://localhost:${PORT}`)
    })
  } catch (error) {
    console.log(error)
  }
}

start()
