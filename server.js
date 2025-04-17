import express from 'express';

import cors from 'cors'

import dotenv from 'dotenv'

import { connectDB } from './config/configDB.js';

import authRoute from './routes/auth.route.js'
import bookRoute from './routes/book.route.js'

const app = express()

// middlewares
dotenv.config()
app.use(express.json())
app.use(cors())


const PORT = process.env.PORT || 5000


// routes
app.use('/api/books', bookRoute);
app.use('/api/auth', authRoute);






app.listen(PORT,()=>{
    connectDB();
    console.log(`Server is running on port ${PORT}`)
})



