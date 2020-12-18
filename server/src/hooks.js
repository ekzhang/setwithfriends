import { GeneralError } from "@feathersjs/errors";
import logger from "./logger";

function errorHandler(context) {
  if (context.error) {
    const error = context.error;
    logger.info(error);
    if (!error.code) {
      context.error = new GeneralError("Unknown Server Error");
    } else if (error.code === 404 || process.env.NODE_ENV === "production") {
      error.stack = null;
    }
    return context;
  }
}

export default {
  error: {
    all: [errorHandler],
  },
};
