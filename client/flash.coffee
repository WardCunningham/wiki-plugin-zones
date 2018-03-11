moment = require 'moment-timezone'

zones =
  Portland: 'America/Los_Angeles'
  Denver: 'America/Denver'
  London: 'Europe/London'

expand = (text)->
  text
    .replace /&/g, '&amp;'
    .replace /</g, '&lt;'
    .replace />/g, '&gt;'
    .replace /\*(.+?)\*/g, '<i>$1</i>'

parse = (text) ->
  schedule = []
  y = 20
  for city in ['Portland','Denver','London']
    y += 45
    schedule.push {city, y, zone: zones[city]}
  schedule

render = (schedule) ->
  height = 200

  markup = []

  svg = (params, more) ->
    elem 'svg', params, {width:'420px', height:"#{height}px"}, more

  link = (params, more) ->
    elem 'a', params, {}, more

  ellipse = (params, more) ->
    elem 'ellipse', params, {stroke:'#999', 'stroke-width':1}, more

  rect = (params, more) ->
    elem 'rect', params, {}, more

  line = (params) ->
    elem 'line', params, {'stroke-width':6, stroke:'#ccc'}, ->

  text = (params, text) ->
    elem 'text', params, {'text-anchor':'middle', dy:6}, ->
      markup.push text

  elem = (tag, params, extra, more) ->
    markup.push "<#{tag} #{attr params} #{attr extra}>"; more(); markup.push "</#{tag}>"

  title = (text) ->
    markup.push "<title>#{text}</title>"

  attr = (params) ->
    ("#{k}=\"#{v}\"" for k, v of params).join " "

  event = moment.tz("3/14/2018 10:00 am", "MM-DD-YYYY h:mm A", zones['Portland'])
  svg {'viewBox':"0 0 420 #{height}"}, ->
    rect {x: 0, y:0, width:420, height, fill:'#eee'}, ->
    rect {x: 3*60-5, y:0, width:60+5, height, fill:'#ccc'}, ->
    text {x: 420/2, y:30}, "Wiki Hangout"
    for {y,city,zone} in schedule
      now = moment(event).add(-3, 'hours').tz(zone)
      for h in [-3..5]
        x = (h+3)*60
        color = if now.hour() >= 6 and now.hour() < 18 then '#ffd' else '#ddf'
        rect {x,y,width:55,height:20,fill:color}, ->
        text {x:x+20,y:y+10}, now.hours()+':00'
        now.add(1, 'hour')
      text {x:60,y:y-10}, city

  markup.join "\n"


emit = ($item, item) ->
  $item.append render parse item.text

bind = ($item, item) ->
  $item.dblclick -> wiki.textEditor $item, item

window.plugins.flash = {emit, bind} if window?
module.exports = {expand} if module?

