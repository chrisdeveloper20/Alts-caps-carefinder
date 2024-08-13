import mongoose, { ConnectOptions } from 'mongoose';





 export const connectDB = async (): Promise<void> => {
  try {
    await mongoose.connect(process.env.MONGO_URI as string, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      dbName: 'user'
    } as ConnectOptions);
    console.log('Mongodb connected');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  }
}

