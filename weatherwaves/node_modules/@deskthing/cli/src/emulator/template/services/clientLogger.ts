import { ClientService } from '../services/clientService'
import { LOGGING_LEVELS } from '@deskthing/types'

export class ClientLogger {
  static debug(message: string, ...data: any[]) {
    ClientService.log('debug', message, ...data)
  }

  static info(message: string, ...data: any[]) {
    ClientService.log('info', message, ...data)
  }

  static warn(message: string, ...data: any[]) {
    ClientService.log('warn', message, ...data)
  }

  static error(message: string, ...data: any[]) {
    ClientService.log('error', message, ...data)
  }

  static clientLog(type: LOGGING_LEVELS | string, message: string, ...data: any[]): void {
    const prefix = `[App ${type.trim()}] `
  
    // Format data if present

    ClientService.sendToServer({ type: 'log', level: type, message })
    switch (type) {
      case LOGGING_LEVELS.LOG:
      case 'info':
        console.info('\x1b[90m%s\x1b[0m', prefix + message, ...data); // Gray
        break
      case LOGGING_LEVELS.ERROR:
        console.error('\x1b[31m%s\x1b[0m', prefix + message, ...data); // Red
        break
      case LOGGING_LEVELS.WARN:
      case 'warn':
        console.warn('\x1b[33m%s\x1b[0m', prefix + message, ...data); // Yellow
        break
      case LOGGING_LEVELS.MESSAGE:
        console.log('\x1b[32m%s\x1b[0m', prefix + message, ...data); // Green
        break
      case LOGGING_LEVELS.DEBUG:
      case 'debug':
        console.debug('\x1b[36m%s\x1b[0m', prefix + message, ...data); // Cyan
        break
      default:
        console.log('[CLIENT LOGGING: ]', type, message, ...data)
    }
  }
}