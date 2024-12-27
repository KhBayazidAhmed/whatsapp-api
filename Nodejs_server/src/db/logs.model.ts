import mongoose from "mongoose";

const Log = mongoose.model(
  "Log",
  new mongoose.Schema(
    {
      timestamp: Date,
      level: String,
      message: String,
    },
    { collection: "logs" }
  )
);

export default Log;
