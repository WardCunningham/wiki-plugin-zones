# build time tests for zones plugin
# see http://mochajs.org/

zones = require '../client/zones'
expect = require 'expect.js'

describe 'zones plugin', ->

  describe 'expand', ->

    it 'can make itallic', ->
      result = zones.expand 'hello *world*'
      expect(result).to.be 'hello <i>world</i>'

  describe 'parse', ->
    it 'can parse markup', ->
      text = "Wiki Weekly Hangout\nDATE Wednesday\nTIME 10:00am\nFOR 60 minutes\nIN US/Pacific\nALSO Pacific/Honolulu\n\nALSO Europe/London\n"
      schedule = zones.parse(text)
      expect(schedule.heads[0]).to.be 'Wiki Weekly Hangout'
 
      # expect(schedule).to.deep.equal {
      #   zones: [
      #     { city: 'Pacific', zone: 'US/Pacific' },
      #     { city: 'Honolulu', zone: 'Pacific/Honolulu' },
      #     { city: 'London', zone: 'Europe/London' } ],
      #   heads: [ 'Wiki Weekly Hangout' ],
      #   in: 'US/Pacific',
      #   date: 'Wednesday',
      #   time: '10:00am',
      #   for: '60 minutes'
      # }
