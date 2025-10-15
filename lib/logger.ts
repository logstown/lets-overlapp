type LogLevel = 'info' | 'warn' | 'error' | 'debug'

interface LogContext {
  [key: string]: unknown
}

class Logger {
  private log(level: LogLevel, message: string, context?: LogContext) {
    const timestamp = new Date().toISOString()
    const logData = {
      timestamp,
      level,
      message,
      ...context,
    }

    // In production, this could be sent to a logging service like Sentry, LogRocket, etc.
    // For now, we'll use console methods with structured data
    const formattedMessage = `[${timestamp}] ${level.toUpperCase()}: ${message}`

    switch (level) {
      case 'error':
        console.error(formattedMessage, context || '')
        break
      case 'warn':
        console.warn(formattedMessage, context || '')
        break
      case 'debug':
        if (process.env.NODE_ENV === 'development') {
          console.debug(formattedMessage, context || '')
        }
        break
      default:
        console.log(formattedMessage, context || '')
    }

    // Here you could send to external service
    // if (process.env.NODE_ENV === 'production') {
    //   sendToExternalService(logData)
    // }
  }

  info(message: string, context?: LogContext) {
    this.log('info', message, context)
  }

  warn(message: string, context?: LogContext) {
    this.log('warn', message, context)
  }

  error(message: string, context?: LogContext) {
    this.log('error', message, context)
  }

  debug(message: string, context?: LogContext) {
    this.log('debug', message, context)
  }
}

export const logger = new Logger()
