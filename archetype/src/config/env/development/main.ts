/**
 * Development Configuration
 * Merges with (app.config.main)
 *
 * @see {@link http://fabrix.app/docs/config/main}
 * @see {@link http://fabrix.app/docs/config/env}
 */

import { REPLSpool } from '@fabrix/spool-repl'

export const main = {
  /**
   * This array of spools will be merged with the parent config array
   */
  spools: [
    REPLSpool
  ]
}
