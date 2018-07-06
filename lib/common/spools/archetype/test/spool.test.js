const assert = require('assert')

describe('<%= spoolName %>', () => {
  let spool
  before(() => {
    spool= global.app.spools.<%= spoolBasename %>
    assert(spool)
  })
  describe('#validate', () => {
    it.skip('TODO test')
  })
  describe('#configure', () => {
    it.skip('TODO test')
  })
  describe('#initialize', () => {
    it.skip('TODO test')
  })
  describe('#unload', () => {
    it.skip('TODO test')
  })
})
