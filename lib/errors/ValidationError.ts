/**
 * Generic validation error; commonly used to wrap joi errors, but can be
 * used for any validation-related exception.
 */
export class ValidationError extends Error {
  constructor (msg: string, details?: any[]) {
    super(msg + '\n' + ValidationError.humanizeMessage(details))
  }

  get name () {
    return 'ValidationError'
  }

  /**
   * Humanize a list of error details
   *
   * @param details a "joi-style details" list
   * @param details.message
   * @param details.path
   * @param details.type
   * @param details.context
   * @return String
   */
  static humanizeMessage (details?: any[]) {
    const preamble = 'The following configuration values are invalid: '
    const paths = (details || [ ]).map(d => d.path.join('.'))

    return preamble + paths.join(', ')
  }
}
