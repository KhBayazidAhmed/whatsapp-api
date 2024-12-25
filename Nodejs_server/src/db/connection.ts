import mongoose from "mongoose";

export const connectToDB = async (): Promise<typeof mongoose> => {
  const MONGODB_URI =
    process.env.MONGODB_URI ||
    "mongodb://root:biz@127.0.0.1:27017/nid-create?authSource=admin";

  if (!MONGODB_URI) {
    console.error("Please define the MONGODB_URI environment variable.");
    process.exit(1);
  }

  await mongoose.connect(MONGODB_URI);
  console.log("Connected to MongoDB successfully.");
  return mongoose;
};
