/* global describe, it */
const assert = require('assert')
const requireMainFilename = require('../../../dist/utils/require-main-filename').main

describe('lib/utils/require-main-filename', function () {
  it('returns require.main.filename in normal circumstances', function () {
    const p = requireMainFilename()
    assert(/fabrix/.test(p))
  })

  it('should use children[0].filename when running on iisnode', function () {
    const main = {
      filename: 'D:\\Program Files (x86)\\iisnode\\interceptor.js',
      children: [ {filename: 'D:\\home\\site\\wwwroot\\server.js'} ]
    }
    const p = requireMainFilename({
      main: main
    })
    assert(/server\.js/.test(p))
  })

  it('should not use children[0] if no children exist', function () {
      const main = {
        filename: 'D:\\Program Files (x86)\\iisnode\\interceptor.js',
        children: []
      }
      const p = requireMainFilename({
        main: main
      })
      assert(/interceptor\.js/.test(p))
  })

  it('should default to process.cwd() if require.main is undefined', function () {
    const p = requireMainFilename({})
    assert(/fabrix/.test(p))
  })
})
