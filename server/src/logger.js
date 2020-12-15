import winston from "winston";

// Configure the Winston logger. For the complete documentation see https://github.com/winstonjs/winston
const logger = winston.createLogger({
  // To see more detailed errors, change this to 'debug'
  level: "info",
  format: winston.format.combine(
    winston.format.splat(),
    winston.format.simple()
  ),
  transports: [new winston.transports.Console()],
});

export default logger;
