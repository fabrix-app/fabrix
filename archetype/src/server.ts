/**
 * @module server
 *
 * Fabrix framework.
 * @see {@link http://fabrix.app}
 */

import { FabrixApp } from '@fabrix/fabrix'
import * as App from './'

const server = new FabrixApp(App)

server.start()
  .catch((err: any) => server.stop(err))
