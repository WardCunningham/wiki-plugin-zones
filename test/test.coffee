# build time tests for flash plugin
# see http://mochajs.org/

flash = require '../client/flash'
expect = require 'expect.js'

describe 'flash plugin', ->

  describe 'expand', ->

    it 'can make itallic', ->
      result = flash.expand 'hello *world*'
      expect(result).to.be 'hello <i>world</i>'
