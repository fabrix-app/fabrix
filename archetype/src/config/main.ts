/**
 * Main App Configuration
 * (app.config.main)
 *
 * @see {@link http://fabrix.app/docs/config/main}
 */

import { resolve } from 'path'

/**
 * Spools: import spools
 */
import { RouterSpool } from '@fabrix/spool-router'

export const main = {

  /**
   * Order matters. Each module is loaded according to its own
   * requirements, however, when there are spools
   * with conflicting configuration, the last spool loaded
   * takes priority.
   */
  spools: [
    RouterSpool
  ],

  /**
   * Define application paths here. "root" is the only required path.
   */
  paths: {
    root: resolve(__dirname, '..'),
    temp: resolve(__dirname, '..', '.tmp')
  }
}
