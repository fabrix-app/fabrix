const assert = require('assert')

describe('<%= packName %>', () => {
  let pack
  before(() => {
    spool= global.app.spools.<%= packBasename %>
    assert(pack)
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
