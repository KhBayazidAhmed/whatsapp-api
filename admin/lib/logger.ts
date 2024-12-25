import { NextApiRequest, NextApiResponse } from 'next';

interface LogEntry {
  timestamp: string;
  level: string;
  message: string;
}

class Logger {
  private logs: LogEntry[] = [];

  log(level: string, message: string) {
    const logEntry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
    };
    this.logs.push(logEntry);
    console.log(`[${logEntry.timestamp}] ${level.toUpperCase()}: ${message}`);
  }

  info(message: string) {
    this.log('info', message);
  }

  warn(message: string) {
    this.log('warn', message);
  }

  error(message: string) {
    this.log('error', message);
  }

  getLogs() {
    return this.logs;
  }
}

const logger = new Logger();

export default logger;

