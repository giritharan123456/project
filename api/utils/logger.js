const LOG_LEVELS = { error: 0, warn: 1, info: 2, debug: 3 };
const CURRENT_LEVEL = LOG_LEVELS[process.env.LOG_LEVEL] ?? LOG_LEVELS.info;

const formatMsg = (level, msg, meta) => {
  const ts = new Date().toISOString();
  const base = `[${ts}] [${level.toUpperCase()}] ${msg}`;
  return meta ? `${base} ${JSON.stringify(meta)}` : base;
};

const logger = {
  error: (msg, meta) => { if (CURRENT_LEVEL >= 0) console.error(formatMsg('error', msg, meta)); },
  warn:  (msg, meta) => { if (CURRENT_LEVEL >= 1) console.warn(formatMsg('warn', msg, meta)); },
  info:  (msg, meta) => { if (CURRENT_LEVEL >= 2) console.log(formatMsg('info', msg, meta)); },
  debug: (msg, meta) => { if (CURRENT_LEVEL >= 3) console.log(formatMsg('debug', msg, meta)); },
};

module.exports = logger;
