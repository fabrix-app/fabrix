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
   * Order does *not* matter. Each module is loaded according to its own
   * requirements.
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
