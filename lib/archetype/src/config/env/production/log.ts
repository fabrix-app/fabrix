import * as winston from 'winston'

export const log = {
  logger: new winston.Logger({
    level: 'info',
    exitOnError: false,
    transports: [
      new winston.transports.Console({
        timestamp: true
      }),
      new winston.transports.File({
        name: 'info-file',
        level: 'info',
        filename: 'fabrix-info.log',
        timestamp: true
      }),
      new winston.transports.File({
        name: 'error-file',
        level: 'error',
        filename: 'fabrix-error.log',
        timestamp: true
      })
    ]
  })
}
