import moment from 'moment-timezone'
const here = moment.tz.guess()

const expand = text => {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\*(.+?)\*/g, '<i>$1</i>')
}

const parse = text => {
  const schedule = {
    zones: [],
    heads: [],
    in: here,
    date: '1/1/2018',
    time: '12:00',
    for: '60 minutes',
  }

  for (const line of text.split(/ *\r?\n/)) {
    let m
    if (line.match(/ZONES/)) {
      return { allzones: true }
    } else if ((m = line.match(/IN +(.*)/))) {
      schedule.in = m[1]
      const city = m[1].split('/').reverse()[0]
      schedule.zones.push({ city, zone: m[1] })
    } else if ((m = line.match(/ALSO +(.*)/))) {
      const city = m[1].split('/').reverse()[0]
      schedule.zones.push({ city, zone: m[1] })
    } else if ((m = line.match(/HERE/))) {
      const city = here.split('/').reverse()[0]
      schedule.zones.push({ city, zone: here })
    } else if ((m = line.match(/DATE +(.*)/))) {
      schedule.date = m[1]
    } else if ((m = line.match(/TIME +(.*)/))) {
      schedule.time = m[1]
    } else if ((m = line.match(/FOR +(.*)/))) {
      schedule.for = m[1]
    } else if (line.match(/\S/)) {
      schedule.heads.push(line.trim())
    }
  }
  return schedule
}

const allzones = () => {
  const zones = []
  const now = moment()
  for (const zone of moment.tz.names()) {
    zones.push(`<tr><td>${now.tz(zone).format('ddd HH:mm')}<td>${zone}`)
  }
  return `<table style="background:#eee; width:100%; padding:16px;">${zones.join('\n')}</table>`
}

const event = schedule => {
  if (schedule.date.match(/^(Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday)$/)) {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    let daynum = days.indexOf(schedule.date)
    if (moment().day() > daynum) {
      daynum += 7
    }
    return moment.tz(schedule.time, 'HH:mm', schedule.in).day(daynum)
  } else {
    const start = `${schedule.date} ${schedule.time}`
    return moment.tz(start, 'MM/DD/YYYY HH:mm', schedule.in)
  }
}

const render = schedule => {
  if (schedule.allzones != null) {
    return allzones()
  }
  const dx = 60
  const dy = 45
  const hy = 20
  const width = 420
  const height = hy + dy * (schedule.zones.length + 1)

  const markup = []

  const svg = (params, more) => {
    return elem('svg', params, { width: '420px', height: `${height}px` }, more)
  }

  const link = (params, more) => {
    return elem('a', params, {}, more)
  }

  const ellipse = (params, more) => {
    return elem('ellipse', params, { stroke: '#999', 'stroke-width': 1 }, more)
  }

  const rect = (params, more) => {
    return elem('rect', params, {}, more)
  }

  const line = params => {
    return elem('line', params, { 'stroke-width': 6, stroke: '#ccc' }, () => {})
  }

  const text = (params, text) => {
    return elem('text', params, { 'text-anchor': 'middle', dy: 6 }, () => {
      markup.push(text)
    })
  }

  const elem = (tag, params, extra, more) => {
    markup.push(`<${tag} ${attr(params)} ${attr(extra)}>`)
    more()
    markup.push(`</${tag}>`)
  }

  const title = text => {
    markup.push(`<title>${text}</title>`)
  }

  const attr = params => {
    return Object.entries(params)
      .map(([k, v]) => `${k}="${v}"`)
      .join(' ')
  }

  const marker = title => {
    rect({ x: 3 * dx - 5, y: 0, width: dx + 5, height, fill: '#ccc' }, () => {})
    text({ x: width / 2, y: 30 }, title)
  }

  const color = now => {
    if (now.hour() >= 6 && now.hour() < 18) {
      return '#ffa'
    } else {
      return '#aaf'
    }
  }

  const scales = zones => {
    let y = hy
    for (const { city, zone } of zones) {
      y += dy
      let now = event(schedule).add(-3, 'hours').tz(zone)
      rect({ x: 0, y: y - 5, width, height: 30, fill: 'white', opacity: 0.6 }, () => {})
      for (let h = -3; h <= 5; h++) {
        const x = (h + 3) * dx
        rect({ x, y, width: dx - 5, height: 20, fill: color(now), opacity: 0.6 }, () => {})
        text({ x: x + 20, y: y + 10 }, now.format('HH:mm'))
        rect({ x, y, width: dx - 5, height: 20, opacity: 0.0 }, () => {
          title(now.format('dddd_MMMM Do_YYYY').replace(/_/g, '\n'))
        })
        now.add(1, 'hour')
      }
      text({ x: 60, y: y - 10 }, city.replace('_', ' '))
    }
  }

  svg({ viewBox: `0 0 ${width}, ${height}` }, () => {
    rect({ x: 0, y: 0, width, height, fill: '#eee' }, () => {})
    marker(schedule.heads[0] || 'Unspecified Event')
    scales(schedule.zones)
  })

  return markup.join('\n')
}

const emit = ($item, item) => {
  $item.append(render(parse(item.text)))
}

const bind = ($item, item) => {
  $item.on('dblclick', () => wiki.textEditor($item, item))
}

if (typeof window !== 'undefined') {
  window.plugins.zones = { emit, bind }
}

export const zones = typeof window == 'undefined' ? { parse, expand } : undefined

// moment = require 'moment-timezone'
// here = moment.tz.guess()

// expand = (text)->
//   text
//     .replace /&/g, '&amp;'
//     .replace /</g, '&lt;'
//     .replace />/g, '&gt;'
//     .replace /\*(.+?)\*/g, '<i>$1</i>'

// parse = (text) ->
//   schedule =
//     zones:[]
//     heads:[]
//     in: here
//     date: '1/1/2018'
//     time: '12:00'
//     for: '60 minutes'

//   for line in text.split(/ *\r?\n/)
//     if line.match /ZONES/
//       return {allzones:true}
//     else if m = line.match(/IN +(.*)/)
//       schedule.in = m[1]
//       city = m[1].split('/').reverse()[0]
//       schedule.zones.push {city, zone:m[1]}
//     else if m = line.match(/ALSO +(.*)/)
//       city = m[1].split('/').reverse()[0]
//       schedule.zones.push {city, zone:m[1]}
//     else if m = line.match(/HERE/)
//       city = here.split('/').reverse()[0]
//       schedule.zones.push {city, zone:here}
//     else if m = line.match(/DATE +(.*)/)
//       schedule.date = m[1]
//     else if m = line.match(/TIME +(.*)/)
//       schedule.time = m[1]
//     else if m = line.match(/FOR +(.*)/)
//       schedule.for = m[1]
//     else if line.match(/\S/)
//       schedule.heads.push line.trim()
//   schedule

// allzones = ->
//   zones = []
//   now = moment()
//   for zone in moment.tz.names()
//     zones.push "<tr><td>#{now.tz(zone).format('ddd HH:mm')}<td>#{zone}"
//   """<table style="background:#eee; width:100%; padding:16px;">#{zones.join "\n"}</table>"""

// event = (schedule) ->
//   if schedule.date.match /^(Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday)$/
//     days = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"]
//     daynum = days.indexOf(schedule.date)
//     daynum += 7 if moment().day() > daynum
//     moment.tz(schedule.time, 'HH:mm', schedule.in).day(daynum)
//   else
//     start = "#{schedule.date} #{schedule.time}"
//     moment.tz(start, "MM/DD/YYYY HH:mm", schedule.in)

// render = (schedule) ->
//   return allzones() if schedule.allzones?
//   dx = 60
//   dy = 45
//   hy = 20
//   width = 420
//   height = hy + dy*(schedule.zones.length + 1)

//   markup = []

//   svg = (params, more) ->
//     elem 'svg', params, {width:'420px', height:"#{height}px"}, more

//   link = (params, more) ->
//     elem 'a', params, {}, more

//   ellipse = (params, more) ->
//     elem 'ellipse', params, {stroke:'#999', 'stroke-width':1}, more

//   rect = (params, more) ->
//     elem 'rect', params, {}, more

//   line = (params) ->
//     elem 'line', params, {'stroke-width':6, stroke:'#ccc'}, ->

//   text = (params, text) ->
//     elem 'text', params, {'text-anchor':'middle', dy:6}, ->
//       markup.push text

//   elem = (tag, params, extra, more) ->
//     markup.push "<#{tag} #{attr params} #{attr extra}>"; more(); markup.push "</#{tag}>"

//   title = (text) ->
//     markup.push "<title>#{text}</title>"

//   attr = (params) ->
//     ("#{k}=\"#{v}\"" for k, v of params).join " "

//   marker = (title) ->
//     rect {x: 3*dx-5, y:0, width:dx+5, height, fill:'#ccc'}, ->
//     text {x: width/2, y:30}, title

//   color = (now) ->
//     if now.hour() >= 6 and now.hour() < 18
//       '#ffa'
//     else
//       '#aaf'

//   scales = (zones) ->
//     y = hy
//     for {city,zone} in zones
//       y += dy
//       now = event(schedule).add(-3, 'hours').tz(zone)
//       rect {x:0,y:y-5,width,height:30,fill:'white',opacity:0.6}, ->
//       for h in [-3..5]
//         x = (h+3)*dx
//         rect {x,y,width:dx-5,height:20,fill:color(now),opacity:0.6}, ->
//         text {x:x+20,y:y+10}, now.format('HH:mm')
//         rect {x,y,width:dx-5,height:20,opacity:0.0}, ->
//           title now.format('dddd_MMMM Do_YYYY').replace(/_/g,"\n")
//         now.add(1, 'hour')
//       text {x:60,y:y-10}, city.replace('_',' ')

//   svg {'viewBox':"0 0 #{width}, #{height}"}, ->
//     rect {x: 0, y:0, width, height, fill:'#eee'}, ->
//     marker schedule.heads[0]||"Unspecified Event"
//     scales schedule.zones

//   markup.join "\n"

// emit = ($item, item) ->
//   $item.append render parse item.text

// bind = ($item, item) ->
//   $item.on 'dblclick', () -> wiki.textEditor $item, item

// window.plugins.zones = {emit, bind} if window?
// module.exports = {expand,parse,event} if module?
