class Logger {
  constructor(enableLogging = true, logLevel = 'info') {
    this.enableLogging = enableLogging !== false;
    this.logLevel = logLevel || process.env.LOG_LEVEL || 'info';
    this.levels = { error: 0, warn: 1, info: 2, debug: 3 };
  }

  shouldLog(level) {
    return this.enableLogging && this.levels[level] <= this.levels[this.logLevel];
  }

  log(message, level = 'info') {
    if (!this.shouldLog(level)) return;
    const timestamp = new Date().toISOString();
    const levelUpper = level.toUpperCase();
    console.log(`[${timestamp}] [${levelUpper}] ${message}`);
  }

  error(message) {
    this.log(message, 'error');
  }

  warn(message) {
    this.log(message, 'warn');
  }

  info(message) {
    this.log(message, 'info');
  }

  debug(message) {
    this.log(message, 'debug');
  }
}

module.exports = Logger;
