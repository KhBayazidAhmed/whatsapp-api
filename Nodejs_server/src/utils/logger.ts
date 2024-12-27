import winston from "winston";
import "winston-mongodb";

const mongoDBUri =
  process.env.MONGODB_URI ||
  "mongodb://root:biz@127.0.0.1:27017/biz?authSource=admin";
if (!mongoDBUri) {
  console.error("Please define the MONGODB_URI environment variable.");
  process.exit(1);
}

// MongoDB URI and options
const mongoDBOptions = {
  useUnifiedTopology: true,
};

// Configure Winston logger
const logger = winston.createLogger({
  level: "info",
  transports: [
    // Console log transport
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.printf(({ timestamp, level, message }) => {
          return `[${timestamp}] ${level}: ${message}`;
        })
      ),
    }),

    // MongoDB transport for logging
    new winston.transports.MongoDB({
      db: mongoDBUri,
      collection: "logs", // Name of the collection where logs will be stored
      level: "info",
      options: mongoDBOptions,
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json(),
        // Custom transformation to limit log size
        winston.format((info) => {
          if (typeof info.message === "string" && info.message.length > 1000) {
            if (typeof info.message === "string") {
              info.message = info.message.substring(0, 1000); // Truncate long messages
            }
          }
          return info;
        })()
      ),
    }),
  ],
});

// Export the logger to use in other parts of the app
export default logger;
