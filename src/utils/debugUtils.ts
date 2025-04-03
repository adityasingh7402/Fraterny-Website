
/**
 * Enhanced debugging utilities that only run in development environment
 */

// Centralized log level configuration
export type LogLevel = 'debug' | 'info' | 'warn' | 'error' | 'none';

interface LoggerConfig {
  enabled: boolean;
  level: LogLevel;
  component?: string;
}

// Default configuration
const defaultConfig: LoggerConfig = {
  enabled: process.env.NODE_ENV === 'development',
  level: 'info'
};

// Global log configuration (can be adjusted at runtime)
let globalLogConfig = { ...defaultConfig };

/**
 * Create a logger instance for a specific component
 * @param component Component name
 * @param config Configuration overrides
 * @returns Logger object with methods for different log levels
 */
export const createLogger = (component: string, config: Partial<LoggerConfig> = {}) => {
  const logger = {
    debug: (message: string, ...args: any[]) => {
      if (!shouldLog('debug', component)) return;
      console.log(`[${component}] 🔍 ${message}`, ...args);
    },
    
    info: (message: string, ...args: any[]) => {
      if (!shouldLog('info', component)) return;
      console.log(`[${component}] ℹ️ ${message}`, ...args);
    },
    
    warn: (message: string, ...args: any[]) => {
      if (!shouldLog('warn', component)) return;
      console.warn(`[${component}] ⚠️ ${message}`, ...args);
    },
    
    error: (message: string, ...args: any[]) => {
      if (!shouldLog('error', component)) return;
      console.error(`[${component}] 🔥 ${message}`, ...args);
    },
    
    group: (label: string, collapsed = false) => {
      if (!globalLogConfig.enabled) return;
      if (collapsed) {
        console.groupCollapsed(`[${component}] ${label}`);
      } else {
        console.group(`[${component}] ${label}`);
      }
    },
    
    groupEnd: () => {
      if (!globalLogConfig.enabled) return;
      console.groupEnd();
    },
    
    // Performance monitoring methods
    time: (label: string) => {
      if (!shouldLog('debug', component)) return;
      console.time(`[${component}] ${label}`);
    },
    
    timeEnd: (label: string) => {
      if (!shouldLog('debug', component)) return;
      console.timeEnd(`[${component}] ${label}`);
    }
  };
  
  return logger;
};

// Helper to determine if a message should be logged
function shouldLog(level: LogLevel, component?: string): boolean {
  if (!globalLogConfig.enabled) return false;
  
  const levels: LogLevel[] = ['debug', 'info', 'warn', 'error'];
  const configLevel = globalLogConfig.level;
  const configLevelIndex = levels.indexOf(configLevel);
  const messageLevelIndex = levels.indexOf(level);
  
  return messageLevelIndex >= configLevelIndex;
}

/**
 * Enable or disable logging globally
 * @param enabled Boolean to enable or disable logging
 */
export const setLoggingEnabled = (enabled: boolean): void => {
  globalLogConfig.enabled = enabled;
};

/**
 * Set the global log level
 * @param level Log level to set
 */
export const setLogLevel = (level: LogLevel): void => {
  globalLogConfig.level = level;
};

/**
 * Network request monitoring utility
 * @param requestName Name to identify the request
 * @returns Object with methods to mark success or failure
 */
export const monitorNetworkRequest = (requestName: string) => {
  if (!globalLogConfig.enabled) {
    // Return no-op methods if logging is disabled
    return {
      success: () => {},
      failure: () => {}
    };
  }
  
  const startTime = performance.now();
  console.log(`Network request: GET ${requestName}`);
  
  return {
    success: (data?: any) => {
      const duration = Math.round(performance.now() - startTime);
      console.log(`✅ Request successful: GET ${requestName} (${duration}ms)`, data || '');
    },
    
    failure: (error: any) => {
      const duration = Math.round(performance.now() - startTime);
      console.error(`❌ Request failed: GET ${requestName} (${duration}ms)`, error);
    }
  };
};

/**
 * Validate a storage path to ensure it's properly formatted
 * @param path Storage path to validate
 * @returns Boolean indicating if the path is valid
 */
export const debugStoragePath = (path: string): boolean => {
  if (!path) {
    console.error(`Invalid storage path: Empty path`);
    return false;
  }
  
  if (path.includes('undefined') || path.includes('null')) {
    console.error(`Invalid storage path: Contains undefined or null: ${path}`);
    return false;
  }
  
  return true;
};

/**
 * Validate if a URL is properly formatted
 * @param url URL to validate
 * @returns Boolean indicating if the URL is valid
 */
export const isValidUrl = (url: string): boolean => {
  if (!url) return false;
  if (url === '/placeholder.svg') return true;
  
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

// Export a pre-configured logger for use in files where creating a custom logger is overkill
export const defaultLogger = createLogger('App');
