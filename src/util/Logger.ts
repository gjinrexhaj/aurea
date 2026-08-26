// LOGGER
/* USAGE EXAMPLES

logger.geometry(
  'Creating circle',
  radius,
  center,
);

logger.construction(
  'Circle intersection calculated',
  intersectionPoint,
);

logger.info('Application initialized');

logger.warn('No construction selected');

logger.error('Failed to calculate intersection', error);

 */

export type LogLevel = 'log' | 'info' | 'warn' | 'error';

export type LogSource = 'app' | 'geometry' | 'construction' | 'canvas' | 'ui';

export interface LogEntry {
  id: string;
  level: LogLevel;
  source: LogSource;
  timestamp: Date;
  message: string;
  args: unknown[];
}

type LogListener = (entry: LogEntry) => void;

const listeners = new Set<LogListener>();
const history: LogEntry[] = [];

const MAX_LOGS = 500;

function emit(
  level: LogLevel,
  source: LogSource,
  message: string,
  args: unknown[],
) {
  const entry: LogEntry = {
    id: crypto.randomUUID(),
    level,
    source,
    timestamp: new Date(),
    message,
    args,
  };

  history.push(entry);

  // Keep memory under control
  if (history.length > MAX_LOGS) {
    history.shift();
  }

  // Send to browser console
  switch (level) {
    case 'error':
      console.error(`[${source}]`, message, ...args);
      break;

    case 'warn':
      console.warn(`[${source}]`, message, ...args);
      break;

    case 'info':
      console.info(`[${source}]`, message, ...args);
      break;

    default:
      console.log(`[${source}]`, message, ...args);
  }

  // Send to ConsoleWindow
  listeners.forEach((listener) => listener(entry));
}

// -----------------------------------------------------------------------------
// Logger
// -----------------------------------------------------------------------------

export const logger = {
  log(message: string, ...args: unknown[]) {
    emit('log', 'app', message, args);
  },

  info(message: string, ...args: unknown[]) {
    emit('info', 'app', message, args);
  },

  warn(message: string, ...args: unknown[]) {
    emit('warn', 'app', message, args);
  },

  error(message: string, ...args: unknown[]) {
    emit('error', 'app', message, args);
  },

  // Source-specific logging
  geometry(message: string, ...args: unknown[]) {
    emit('log', 'geometry', message, args);
  },

  construction(message: string, ...args: unknown[]) {
    emit('log', 'construction', message, args);
  },

  canvas(message: string, ...args: unknown[]) {
    emit('log', 'canvas', message, args);
  },

  ui(message: string, ...args: unknown[]) {
    emit('log', 'ui', message, args);
  },
};

// -----------------------------------------------------------------------------
// History
// -----------------------------------------------------------------------------

export function getLogs(): LogEntry[] {
  return [...history];
}

export function clearLogs() {
  history.length = 0;
}

// -----------------------------------------------------------------------------
// React subscription
// -----------------------------------------------------------------------------

export function subscribeToLogs(listener: LogListener) {
  listeners.add(listener);

  return () => {
    listeners.delete(listener);
  };
}
