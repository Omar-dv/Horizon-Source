const logger = require("./logger");

async function handleError(error, context = {}) {
    logger.error("Unhandled error", {
        message: error?.message || String(error),
        stack: error?.stack,
        context
    });
}

module.exports = { handleError };