import mongoose from 'mongoose';

/**
 * Connect to MongoDB using MONGO_URI
 */
export async function connectDB() {
  const uri = process.env.MONGO_URI;
  if (!uri) throw new Error('MONGO_URI not set');
  try {
    await mongoose.connect(uri, {
      dbName: 'salonbook'
    });
    console.log('MongoDB connected');
  } catch (err) {
    console.error('MongoDB connection error', err);
    throw err;
  }
}
