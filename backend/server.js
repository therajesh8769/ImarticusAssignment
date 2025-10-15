
import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import mongoose from 'mongoose'


dotenv.config()
import enrollmentRoutes from './routes/enrollment.js' 
import courseRoutes from './routes/course.js'
import paymentRoutes from './routes/payment.js'
import aiRoutes from './routes/ai.js'


// DB connection
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch((err) => console.error('MongoDB connection error:', err))
const app = express()
const PORT = process.env.PORT || 5000

// CORS configuration
const corsOptions = {
  origin: 'http://localhost:3000', 
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 200
}

// Apply CORS middleware
app.use(cors(corsOptions))

// Body parsing middleware
app.use(express.json())

// app.use(express.urlencoded({ extended: true }))



// Routes
app.use('/api/enrollments', enrollmentRoutes)
app.use('/api/courses', courseRoutes)
app.use('/api/payment', paymentRoutes)
app.use('/api/ai', aiRoutes)

// Health check route
app.get('/api/health', (_req, res) => {
  res.json({ status: 'Server is running' })
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})