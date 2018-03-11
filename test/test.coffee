# build time tests for zones plugin
# see http://mochajs.org/

zones = require '../client/zones'
expect = require 'expect.js'

describe 'zones plugin', ->

  describe 'expand', ->

    it 'can make itallic', ->
      result = zones.expand 'hello *world*'
      expect(result).to.be 'hello <i>world</i>'
