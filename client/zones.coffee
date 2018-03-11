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
  schedule = {zones:[]}
  zones = ['America/Los_Angeles','America/Denver','Europe/London','Europe/Paris','Asia/Tokyo']
  for zone in zones
    city = zone.split('/').reverse()[0]
    schedule.zones.push {city, zone}
  schedule.anchor = zones[0]
  schedule

render = (schedule) ->
  dx = 60
  dy = 45
  hy = 20
  width = 420
  height = hy + dy*(schedule.zones.length + 1)
  event = moment.tz("3/14/2018 10:00 am", "MM-DD-YYYY h:mm A", schedule.anchor)

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

  marker = (title) ->
    rect {x: 3*dx-5, y:0, width:dx+5, height, fill:'#ccc'}, ->
    text {x: width/2, y:30}, title

  color = (now) ->
    if now.hour() >= 6 and now.hour() < 18
      '#ffd'
    else
      '#ddf'

  scales = (zones) ->
    y = hy
    for {city,zone} in zones
      y += dy
      now = moment(event).add(-3, 'hours').tz(zone)
      for h in [-3..5]
        x = (h+3)*dx
        rect {x,y,width:dx-5,height:20,fill:color(now)}, ->
        text {x:x+20,y:y+10}, now.hours()+':00'
        now.add(1, 'hour')
      text {x:60,y:y-10}, city

  svg {'viewBox':"0 0 #{width}, #{height}"}, ->
    rect {x: 0, y:0, width, height, fill:'#eee'}, ->
    marker "Wiki Hangout"
    scales schedule.zones

  markup.join "\n"

emit = ($item, item) ->
  $item.append render parse item.text

bind = ($item, item) ->
  $item.dblclick -> wiki.textEditor $item, item

window.plugins.zones = {emit, bind} if window?
module.exports = {expand} if module?

