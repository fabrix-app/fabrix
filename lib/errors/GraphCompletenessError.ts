export class GraphCompletenessError extends RangeError {
  constructor (spool: any = { }, stageName: string, eventName: string) {
    super(`
      The spool "${spool.name}" cannot load.

      During the "${stageName}" lifecycle stage, "${spool.name}" waits for
      the event "${eventName}". This event will not be emitted for one
      of the following reasons:

        1. The event "${eventName}" is emitted by a another Spool
           that, due to its configuration, paradoxically requires that
           "${spool.name}" loaded before it.

        2. The event "${eventName}" is not emitted by any other Spool,
           or it is not properly declared in the Spool's lifecycle
           config.

      Please check that you have all the Spools correctly installed
      and configured. If you think this is a bug, please file an issue:
      https://github.com/fabrix/fabrix/issues.
    `)

  }

  get name () {
    return 'GraphCompletenessError'
  }
}

