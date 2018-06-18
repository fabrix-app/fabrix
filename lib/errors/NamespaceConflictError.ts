export class NamespaceConflictError extends Error {
  constructor (key: string, globals: any) {
    super(`
      The extant global variable "${key}" conflicts with the value provided by
      Fabrix.

      Fabrix defines the following variables in the global namespace:
      ${globals}
    `)
  }

  get name () {
    return 'NamespaceConflictError'
  }
}

