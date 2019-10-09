import { FabrixApp } from './'
import { FabrixGeneric } from './common/Generic'

// declare global {
//   interface Console {
//     log: (message?: any, ...optionalParams: any[]) => void
//     info: (message?: any, ...optionalParams: any[]) => void
//     debug: (message?: any, ...optionalParams: any[]) => void
//     warn: (message?: any, ...optionalParams: any[]) => void
//     error: (message?: any, ...optionalParams: any[]) => void
//     silly: (message?: any, ...optionalParams: any[]) => void
//   }
// }
//
// export interface LoggerProxy {
//   // [key: string]: (message?: any, ...optionalParams: any[]) => void
//   log: (message?: any, ...optionalParams: any[]) => void
//   info: (message?: any, ...optionalParams: any[]) => void
//   debug: (message?: any, ...optionalParams: any[]) => void
//   warn: (message?: any, ...optionalParams: any[]) => void
//   error: (message?: any, ...optionalParams: any[]) => void
//   silly: (message?: any, ...optionalParams: any[]) => void
//   app: FabrixApp
// }

// export interface LoggerProxyProxy {
//   // [key: string]: (message?: any, ...optionalParams: any[]) => void
//   log: (message?: any, ...optionalParams: any[]) => void
//   info: (message?: any, ...optionalParams: any[]) => void
//   debug: (message?: any, ...optionalParams: any[]) => void
//   warn: (message?: any, ...optionalParams: any[]) => void
//   error: (message?: any, ...optionalParams: any[]) => void
//   silly: (message?: any, ...optionalParams: any[]) => void
//   app: FabrixApp
// }

// export interface LoggerProxy {
//   (message?: any, ...optionalParams: any[]): void
// }

export class LoggerProxy extends FabrixGeneric {
  public app: FabrixApp
  public error
  public warn
  public info
  public debug
  public silly
  public dir
  public time
  public timeEnd
  public trace
  public assert

  public levelHierarchy = ['silly', 'debug', 'dir', 'timeEnd', 'trace', 'assert', 'time', 'info', 'warn', 'error']

  // TODO The proxy is not telling JavaScript compilier that there is a label called timeEnd
  // TODO the proxy is not allowing a trace
  /**
   * Instantiate Proxy; bind log events to default console.log
   */
  constructor (app: FabrixApp) {
    super(app)

    this.app.on('fabrix:log', (level: string, msg: any[] = [ ]) => (
      console[level] || console.log)(level, ...msg)
    )

    return new Proxy(this.emitLogEvent.bind(this), {
      /**
       * Trap calls to log.<level>, e.g. log.info(msg), log.debug(msg) and proxy
       * them to emitLogEvent
       */
      get (target: any, key: string): Function {
        return target(key)
      },

      /**
       * Trap invocations of log, e.g. log(msg) and treat them as invocations
       * of log.info(msg).
       */
      apply (target: any, thisArg: any, argumentsList: any): Function {
        const [ level, ...msg ] = argumentsList
        return target(level)(...msg)
      }
    })
  }

  /**
   * Emit fabrix:log, pass the "level" parameter to the event handler as the
   * first argument.
   */
  emitLogEvent (level: string, current: string = 'silly') {
    const currentLevel = this.app && this.app.config ? this.app.config.get('log.level') || current : current
    level = level || current

    const log = this.levelHierarchy.indexOf(currentLevel) <= this.levelHierarchy.indexOf(level) ? 'fabrix:log' : 'fabrix:log:ignored'
    return (...msg: any[]) => this.app.emit(log, level, msg)
  }
}
