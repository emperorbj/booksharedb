import mongoose from 'mongoose';

export const connectDB = async ()=> {
    try {
        await mongoose.connect(process.env.MONGODB_DB_URI);
        console.log('Database connected');
    } catch (error) {
        console.log("error connecting to data base",error);
        process.exit(1);
    }
}