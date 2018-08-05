// tslint:disable no-trailing-whitespace

import { FabrixApp } from './index'

export const Templates = {
  hr: '---------------------------------------------------------------',
  docs: 'Fabrix Documentation: http://fabrix.app/doc',

  info: {
    start: 'Spooling up...',
    stop: 'Spooling down...',
    initialized: 'All spools are loaded.',
    sane: `Sanity check complete`,
    ready (app: FabrixApp) {
      const baseUrl = app.config.get('web.baseUrl') ||
          `http://${app.config.get('web.host') || 'localhost'}:${app.config.get('web.port') || '80'}`
      return (
        `---------------------------------------------------------------
        Now: ${new Date()}
        Basic Info
          Application       : ${app.pkg.name || 'UNNAMED'}
          Base URL          : ${baseUrl}
          Version           : ${app.pkg.version || 'N/A'}
          Environment       : ${app.env.NODE_ENV || 'UNKNOWN'}`
      )
    }
  },

  debug: {
    ready (app: FabrixApp) {
      return (
        ` Database Info
          Stores            : ${Object.keys(app.config.get('stores') || { })}
        Web Server Info
          Server            : ${app.config.get('web.server') || 'NOT INSTALLED'}
          Port              : ${app.config.get('web.port') || 'N/A'}
          Routes            : ${(app.routes || new Map()).size}`
      )
    }
  },

  silly: {
    ready (app: FabrixApp) {
      const resources = (app.resources || []).map(resource => {
        let prefix = resource.charAt(0).toUpperCase() + resource.slice(1)
        while (prefix.length < 17) { prefix = prefix + ' '}
        return `${ prefix } : ${Object.keys(app.api[resource] || {})}`
      }).join('\n          ')

      return (
        ` API
          API Resources     : ${resources ? app.resources : 'NONE INSTALLED'}
          ${ resources }
          Spools            : ${Object.keys(app.spools || {})}`
      )
    },

    sane: `Sanity checks keep us happy`,
    // tslint:disable:max-line-length
    initialized: `
                                                                          
            ███████                                      ██               
           █████  █              ████                   ████              
           ████                 █████                    ██               
          ██████    ████ ████   ████ ███    █████ ███  ████  ████  ████   
          ████   █████  ████    ████  ████  ███████████████  █████   ██   
         █████  ████    ████   ████    ███  ████   █  ████    ████  ██    
         ████  █████   █████   ████    ███ ████       ████    ██████      
        █████  ████    ████   █████   ███  ████      ████      ████       
        ████   ████   █████   ████   ████ █████      ████    ██████       
        ████   ████████████████████████   ████       ████████   ██████    
       ████      ███    ███     ████     █████        ████       ███      
   ██  ████                                                               
  ██  ████                                                                
   ██████                                                                 
                                                                          
`
  }
}

