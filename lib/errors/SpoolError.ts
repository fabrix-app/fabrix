export class SpoolError extends Error {
  constructor (spool: any = { constructor: { }}, error: Error, stage: string) {
    super(`
      ${spool.name} spool failed in the "${stage}" stage.
      ${error}
    `)
  }

  get name () {
    return 'SpoolError'
  }
}
