/**
 * Logger - Sistema de logging condicional
 *
 * Solo muestra logs en desarrollo, silenciado en producción
 */

const isDevelopment = import.meta.env.DEV;

const logger = {
  /**
   * Log normal - solo en desarrollo
   */
  log: (...args) => {
    if (isDevelopment) {
      console.log(...args);
    }
  },

  /**
   * Info - solo en desarrollo
   */
  info: (...args) => {
    if (isDevelopment) {
      console.info(...args);
    }
  },

  /**
   * Warning - solo en desarrollo
   */
  warn: (...args) => {
    if (isDevelopment) {
      console.warn(...args);
    }
  },

  /**
   * Error - siempre se muestra (incluso en producción)
   */
  error: (...args) => {
    console.error(...args);
  },

  /**
   * Debug - solo en desarrollo con verbose
   */
  debug: (...args) => {
    if (isDevelopment && import.meta.env.VITE_LOG_LEVEL === 'debug') {
      console.debug(...args);
    }
  },

  /**
   * Table - solo en desarrollo
   */
  table: (data) => {
    if (isDevelopment) {
      console.table(data);
    }
  },

  /**
   * Group - solo en desarrollo
   */
  group: (label) => {
    if (isDevelopment) {
      console.group(label);
    }
  },

  /**
   * Group end - solo en desarrollo
   */
  groupEnd: () => {
    if (isDevelopment) {
      console.groupEnd();
    }
  },
};

export default logger;
