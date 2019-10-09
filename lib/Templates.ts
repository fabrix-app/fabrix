// tslint:disable no-trailing-whitespace

import { FabrixApp } from './index'

export const Templates = {
  hr: '---------------------------------------------------------------',
  docs: 'Fabrix Documentation: https://fabrix.app/docs',

  info: {
    start: 'Spooling up...',
    stop: 'Spooling down...',
    initialized: 'All spools are loaded.',
    sane: `Sanity check complete`,
    ready (app: FabrixApp): string {
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
    ready (app: FabrixApp): string {
      return (
        ` Database Info
          Stores            : ${Object.keys(app.config.get('stores') || { })}
        Web Servers Info
          Servers           : ${app.config.get('web.server') || 'NOT INSTALLED'}
          Ports             : ${app.config.get('web.port') || 'N/A'}
          Routes            : ${(app.routes || new Map()).size}`
      )
    }
  },

  silly: {
    ready (app: FabrixApp): string {
      const resources = (app.resources || []).map(resource => {
        let prefix = resource.charAt(0).toUpperCase() + resource.slice(1) + (` (${ Object.keys(app.api[resource]).length })`)
        while (prefix.length < 17) { prefix = prefix + ' '}
        return `${ prefix } : ${Object.keys(app.api[resource] || {})}`
      }).join('\n          ')

      let apiResourcesLabel = `API Resources (${ (app.resources || []).length })`
      while (apiResourcesLabel.length < 18) { apiResourcesLabel = apiResourcesLabel + ' '}

      let spoolsLabel = `Spools (${ Object.keys(app.spools || {}).length})`
      while (spoolsLabel.length < 18) { spoolsLabel = spoolsLabel + ' '}

      return (
        ` API
          ${ apiResourcesLabel }: ${resources ? app.resources : 'NONE INSTALLED'}
          ${ resources }
          ${ spoolsLabel }: ${Object.keys(app.spools || {})}`
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

