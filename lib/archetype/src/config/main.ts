/**
 * Main App Configuration
 * (app.config.main)
 *
 * @see {@link http://fabrix.app/doc/config/main}
 */

import { resolve } from 'path'

export const main = {

  /**
   * Order does *not* matter. Each module is loaded according to its own
   * requirements.
   */
  spools: [
  ],

  /**
   * Define application paths here. "root" is the only required path.
   */
  paths: {
    root: resolve(__dirname, '..'),
    temp: resolve(__dirname, '..', '.tmp')
  }
}
