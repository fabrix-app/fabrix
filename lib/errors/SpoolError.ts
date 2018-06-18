export class SpoolError extends Error {
  constructor (spool: any, error: Error, stage: string) {
    spool|| (spool= { constructor: { }})
    super(`
      ${spool.name} spool failed in the "${stage}" stage.
      ${error}
    `)
  }

  get name () {
    return 'SpoolError'
  }
}
