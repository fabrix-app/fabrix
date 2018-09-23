/**
 * @module server
 *
 * Fabrix framework.
 */

import { FabrixApp } from '@fabrix/fabrix'
import * as App from '.'

const app = new FabrixApp(App)

app.start().catch(app.stop)
