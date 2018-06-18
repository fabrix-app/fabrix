export class ConfigValueError extends RangeError {
  constructor(msg: string) {
    super(msg)
  }

  get name () {
    return 'ConfigValueError'
  }
}
