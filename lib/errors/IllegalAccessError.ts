export class IllegalAccessError extends Error {
  constructor(msg: string) {
    super(msg)
  }

  get name () {
    return 'IllegalAccessError'
  }
}

