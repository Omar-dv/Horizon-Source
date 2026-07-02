const fs = require("fs");
const path = require("path");

const logDir = path.join(process.cwd(), "logs");
const logFile = path.join(logDir, "bot.log");
const errorLogFile = path.join(logDir, "error.log");

if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
}

function getTimestamp() {
    return new Date().toISOString();
}

function formatMessage(level, message, meta = {}) {
    const base = `[${getTimestamp()}] [${level}] ${message}`;

    if (Object.keys(meta).length === 0) {
        return base;
    }

    return `${base} ${JSON.stringify(meta)}`;
}

function writeToFile(filePath, content) {
    fs.appendFileSync(filePath, `${content}\n`, "utf8");
}

function log(level, message, meta = {}) {
    const formatted = formatMessage(level, message, meta);
    console.log(formatted);

    if (level === "ERROR") {
        writeToFile(errorLogFile, formatted);
    }

    writeToFile(logFile, formatted);
}

module.exports = {
    info(message, meta = {}) {
        log("INFO", message, meta);
    },
    warn(message, meta = {}) {
        log("WARN", message, meta);
    },
    error(message, meta = {}) {
        log("ERROR", message, meta);
    },
    success(message, meta = {}) {
        log("SUCCESS", message, meta);
    },
    debug(message, meta = {}) {
        log("DEBUG", message, meta);
    }
};
