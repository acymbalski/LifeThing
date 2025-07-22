  import { LOGGING_LEVELS } from '@deskthing/types'
  import { DeskThingConfig } from '../../config/deskthing.config'
import { LoggingLevel } from '../../config/deskthing.config.types'

  export class Logger {

    private static shouldLog(msgLevel: LoggingLevel): boolean {
      const levels = ['silent', 'error', 'warn', 'info', 'debug']
      const msgLevelIndex = levels.indexOf(msgLevel)
      const configLevelIndex = levels.indexOf(DeskThingConfig.development.logging.level)
  
      // If either level is not found, default to showing the message
      if (msgLevelIndex === -1 || configLevelIndex === -1) return true

      // Only show messages that are at or above the configured level
      return msgLevelIndex <= configLevelIndex
    }
  
    static log(level: LoggingLevel, ...args: any[]): void {
      const config = DeskThingConfig.development.logging
      const loggingLevel = config.level
      const prefix = config.prefix

      if (this.shouldLog(level)) {
        switch (level) {
          case 'debug': 
            console.debug('\x1b[36m%s\x1b[0m', `${prefix} ${args[0]}`, ...args.slice(1))
            break
          case 'info': 
            console.info('\x1b[90m%s\x1b[0m',`${prefix} ${args[0]}`, ...args.slice(1))
            break
          case 'warn': 
            console.warn('\x1b[33m%s\x1b[0m',`${prefix} ${args[0]}`, ...args.slice(1))
            break
          case 'error': 
            console.error('\x1b[31m%s\x1b[0m',`${prefix} ${args[0]}`, ...args.slice(1))
            break
          default:
            console.log(`${prefix} ${args[0]}`, ...args.slice(1))
        }
      }
    }
  
    static debug(...args: any[]): void {
      this.log('debug', ...args)
    }
  
    static error(...args: any[]): void {
      this.log('error', ...args)
    }

    static info(...args: any[]): void {
      this.log('info', ...args)
    }

    static warn(...args: any[]): void {
      this.log('warn', ...args)
    }
  
    static table(data: any): void {
      console.table(data)
    }

    /**
     * Client logs will always log
     * @param type 
     * @param message 
     * @param data 
     */
    static clientLog(type: LOGGING_LEVELS | string, message: string, data?: any): void {
      const prefix = `[App ${type.trim()}] `
    
      // Format data if present
      const dataStr = data ? ` ${JSON.stringify(data)}` : ''
    
      switch (type) {
        case LOGGING_LEVELS.LOG:
        case 'info':
          console.log('\x1b[90m%s\x1b[0m', prefix + message + dataStr); // Gray
          break
        case LOGGING_LEVELS.ERROR:
          console.log('\x1b[31m%s\x1b[0m', prefix + message + dataStr); // Red
          break
        case LOGGING_LEVELS.WARN:
        case 'warn':
          console.log('\x1b[33m%s\x1b[0m', prefix + message + dataStr); // Yellow
          break
        case LOGGING_LEVELS.MESSAGE:
          console.log('\x1b[32m%s\x1b[0m', prefix + message + dataStr); // Green
          break
        case LOGGING_LEVELS.DEBUG:
        case 'debug':
          console.log('\x1b[36m%s\x1b[0m', prefix + message + dataStr); // Cyan
          break
        default:
          console.log('[CLIENT LOGGING: ]', type, message, data)
      }
    }
  }
