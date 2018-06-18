'use strict'

const assert = require('assert')
const DatastoreSpool = require('../../../../dist/common/spools/datastore').DatastoreSpool
const MiscSpool = require('../../../../dist/common/spools/misc').MiscSpool
const ServerSpool = require('../../../../dist/common/spools/server').ServerSpool
const SystemSpool = require('../../../../dist/common/spools/system').SystemSpool
const ToolSpool = require('../../../../dist/common/spools/tool').ToolSpool

describe('Spool Interfaces', () => {

  describe('datastore', () => {
    it('type property should be "datastore"', () => {
      assert.equal(DatastoreSpool.type, 'datastore')
    })
    it('will error if instantiated directly', () => {
      assert.throws(() => new DatastoreSpool(global.app), Error)
    })
  })
  describe('misc', () => {
    it('type property should be "misc"', () => {
      assert.equal(MiscSpool.type, 'misc')
    })
    it('will error if instantiated directly', () => {
      assert.throws(() => new MiscSpool(global.app), Error)
    })
  })
  describe('server', () => {
    it('type property should be "server"', () => {
      assert.equal(ServerSpool.type, 'server')
    })
    it('will error if instantiated directly', () => {
      assert.throws(() => new ServerSpool(global.app), Error)
    })
  })
  describe('system', () => {
    it('type property should be "system"', () => {
      assert.equal(SystemSpool.type, 'system')
    })
    it('will error if instantiated directly', () => {
      assert.throws(() => new SystemSpool(global.app), Error)
    })
  })
  describe('tool', () => {
    it('type property should be "tool"', () => {
      assert.equal(ToolSpool.type, 'tool')
    })
    it('will error if instantiated directly', () => {
      assert.throws(() => new ToolSpool(global.app), Error)
    })
  })
})
