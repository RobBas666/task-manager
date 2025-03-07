import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
// import dotenv from 'dotenv'
import sequelize from './config/database'
import userRouter from './routes/userRoutes'
import taskRouter from './routes/taskRoutes'
import rateLimit from 'express-rate-limit'
// import crypto from 'crypto'

// dotenv.config();
// const jwtSecret = crypto.randomBytes(32).toString("hex");
// console.log(jwtSecret);
sequelize.sync({ force: false }) // Set to `true` to reset tables on restart
  .then(() => console.log('Database connected'))
  .catch(err => console.error('Database connection error:', err))

const limiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 3,
  message: 'You have exceeded the number of login/signup requests. Please try again later'
})

const app = express()
const PORT = process.env.PORT || 3000

app.use(express.json())
app.use(cors())
app.use(helmet())
app.use('/api/users', limiter, userRouter)
app.use('/api/tasks', taskRouter)

app.get('/', (req, res) => {
  res.send('Task Management API is running...')
})

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})
