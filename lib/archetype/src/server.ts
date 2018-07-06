import { FabrixApp } from '@fabrix/fabrix'

import * as app from '.'
const server = new FabrixApp(app)

export default server.start()
