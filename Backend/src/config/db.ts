import mongoose from "mongoose";

const connectMongoDb = async (url: string): Promise<void> => {
    try {
        await mongoose.connect(url);
        console.log("MongoDB connected");
    } catch (error) {
        console.error("MongoDB connection error:", error);
        process.exit(1);
    }
};

export default connectMongoDb;