import mongoose from "mongoose";

const connectdb = async () => {
    try {
        const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URL;
        if (!mongoUri) {
            throw new Error("No MongoDB URI found in environment variables");
        }

        await mongoose.connect(mongoUri);
        console.log("db connected");
    } catch (error) {
        console.log(error);
    }
};

export default connectdb;
