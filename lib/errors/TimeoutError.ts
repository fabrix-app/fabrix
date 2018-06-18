export class TimeoutError extends Error {
  constructor(phase: string, timeout: number) {
    super(`
      Timeout during "${phase}". Exceeded configured timeout of ${timeout}ms
    `)
  }

  get name () {
    return 'TimeoutError'
  }
}

