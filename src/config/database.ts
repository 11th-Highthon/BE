import mongoose from "mongoose";

try {
    mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/highthon');
    mongoose.connection.on('connected', () => {
        console.log('Connected to MongoDB');
    });
    mongoose.connection.on('error', (err) => {
        console.error('MongoDB connection error:', err);
    });
    mongoose.connection.on('disconnected', () => {
        console.log('Disconnected from MongoDB');
    });
} catch (error) {
    console.error('Error connecting to the database:', error);
}