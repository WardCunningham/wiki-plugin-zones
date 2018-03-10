
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
    y += 40
    schedule.push {city, y}
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
      markup.push text.split(' ')[0]

  elem = (tag, params, extra, more) ->
    markup.push "<#{tag} #{attr params} #{attr extra}>"; more(); markup.push "</#{tag}>"

  title = (text) ->
    markup.push "<title>#{text}</title>"

  attr = (params) ->
    ("#{k}=\"#{v}\"" for k, v of params).join " "

  svg {'viewBox':"0 0 420 #{height}"}, ->
    rect {x: 0, y:0, width:420, height, fill:'#eee'}, ->
    rect {x: 100, y:100, width:100, height:100, fill:'#888'}, ->
    for {y,city} in schedule
      x = Math.floor(Math.random()*300)
      # y = Math.floor(Math.random()*300)
      ellipse {cx:x,cy:y,rx:30,ry:20,fill:'#fff'}, ->
      text {x,y}, city

    # for node, [x1, y1] of placed
    #   for child in graph[node]||[]
    #     [x2, y2] = placed[child]
    #     line {x1, y1, x2, y2}

    # for node, [x, y] of placed
    #   href = "http:/#{wiki.asSlug node}.html"
    #   link {'xlink:href':href, 'data-node':escape(node)}, ->
    #     ellipse {cx:x, cy:y, rx:30, ry:20, fill:'#fff'}, ->
    #       title escape node
    #     text {x,y}, escape node

  markup.join "\n"


emit = ($item, item) ->
  $item.append render parse item.text

bind = ($item, item) ->
  $item.dblclick -> wiki.textEditor $item, item

window.plugins.flash = {emit, bind} if window?
module.exports = {expand} if module?

