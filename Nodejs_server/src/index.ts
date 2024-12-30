import express, { Request, Response, NextFunction } from "express";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import balanceRoutes from "./routes/balance.js";
import whatsappRoutes from "./routes/whatsapp.js";
import nidRouters from "./routes/nid.js";
import logsRoutes from "./routes/logs.js";

import { connectToDB } from "./db/connection.js";
import { WhatsAppClient } from "./types/index.js";
import { initializeClient } from "./config/whatsappClient.js";
import { IUser } from "./db/user.model.js";
import processTheInComingMessage from "./controller/processTheInComingMessage.js";
import logger from "./utils/logger.js";

// Extend Request type to include WhatsAppClient
declare global {
  namespace Express {
    interface Request {
      whatsappClient: WhatsAppClient;
      user?: IUser; // user property can be added if available
    }
  }
}

// Constants
const PORT = process.env.PUPPETEER_APP_PORT || 4001;

// Initialize Express
const app = express();

// Middleware to parse JSON body
app.use(express.json({ limit: "50mb" }));

// Error Handling Middleware
const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  logger.error("An error occurred:", err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
};

// Connect to MongoDB and Initialize WhatsApp Client
connectToDB()
  .then((mongoose) => {
    logger.info(`Connected to MongoDB successfully.`);
    const client = initializeClient(mongoose);

    // Middleware to make client available in routes
    app.use((req: Request, res: Response, next: NextFunction) => {
      req.whatsappClient = client;
      next();
    });

    // Routes
    app.use("/auth", authRoutes);
    app.use("/users", userRoutes);
    app.use("/whatsapp", whatsappRoutes);
    app.use("/balance", balanceRoutes);
    app.use("/nid", nidRouters);
    app.use("/logs", logsRoutes);

    // Process Incoming Messages
    processTheInComingMessage(client);

    // 404 Handler
    app.use((req, res) => {
      res.status(404).json({
        success: false,
        message: "Route not found",
      });
    });

    // Error Handling Middleware
    app.use(errorHandler);

    // Start Server
    app.listen(PORT, () => {
      logger.info(`Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    logger.error(`Error starting application:`, err);
    process.exit(1); // Exit the process if the connection to DB fails
  });
