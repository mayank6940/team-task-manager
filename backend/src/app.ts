import express from 'express'
import morgan from 'morgan'
import cors from 'cors'
import dotenv from 'dotenv'
dotenv.config()

import authRoutes from './routes/auth'
import verifyToken from './middleware/verifyToken'
import projectRoutes from './routes/projects'
import taskRoutes from './routes/tasks'
import dashboardRoutes from './routes/dashboard'

const app = express()

app.use(morgan('dev'))
app.use(cors())
app.use(express.json())

app.get('/health', (req, res) => res.json({ status: 'ok' }))

app.use('/api/auth', authRoutes)
app.use('/api/projects', verifyToken as any, projectRoutes)
app.use('/api', verifyToken as any, taskRoutes)
app.use('/api/dashboard', verifyToken as any, dashboardRoutes)

app.use((err: any, req: any, res: any, next: any) => {
  console.error(err)
  res.status(500).json({ message: 'Server error' })
})

export default app
