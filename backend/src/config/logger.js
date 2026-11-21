const LEVELS = { error: 0, warn: 1, info: 2, debug: 3 };
const currentLevel = LEVELS[process.env.LOG_LEVEL] ?? LEVELS.info;

function write(level, message, meta) {
  if (LEVELS[level] > currentLevel) return;

  const line = `[${new Date().toISOString()}] [${level.toUpperCase()}] ${message}`;
  const stream = level === "error" ? console.error : console.log;

  if (meta !== undefined) {
    stream(line, meta);
  } else {
    stream(line);
  }
}

export const logger = {
  error: (message, meta) => write("error", message, meta),
  warn: (message, meta) => write("warn", message, meta),
  info: (message, meta) => write("info", message, meta),
  debug: (message, meta) => write("debug", message, meta),
};