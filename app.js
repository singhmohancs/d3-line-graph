'use strict'
;((doc) => {
  /**
   * apply dynamic css
   * append dynamic content
   * @param {*} data
   */
  const setPageProperties = (data) => {
    const { date, teamOne, teamTwo, backgroundColor, moneyLine } = data

    const dateString = moment(date).format('MMMM Do, YYYY')
    doc.querySelector('#teamOneTitle').innerText = teamOne.name
    doc.querySelector('#teamOne').style.backgroundColor = teamOne.primaryColor
    doc.querySelector('#teamOnebg').style.backgroundColor = teamOne.primaryColor
    doc.querySelector('#teamOneClip').style.backgroundColor =
      teamOne.secondaryColor

    doc.querySelector('#teamTwoTitle').innerText = teamTwo.name
    doc.querySelector('#teamTwo').style.backgroundColor = teamTwo.primaryColor
    doc.querySelector('#teamTwobg').style.backgroundColor = teamTwo.primaryColor
    doc.querySelector('#teamTwoClip').style.backgroundColor =
      teamTwo.secondaryColor

    doc.querySelector('#body').style.backgroundColor = backgroundColor
    doc.querySelector('.sparkline-text').style.backgroundColor = backgroundColor
    doc.querySelector(
      '#moneyLine',
    ).innerHTML = `<h1>${moneyLine}</h1><div class="sparkline-date-info" id="dateString">${dateString}</div>`
  }
  /**
   * Draw graph line
   * @param {*} jsonData
   */
  const drawGraph = (jsonData) => {
    let { teamOne, teamTwo, data, date } = jsonData

    let vis
    let d = moment(date)
    const element = doc.querySelector('.js-report-sparkline')
    
    // modify data points to make a series
    data = data.map((item) => {
      let value = item * 100
      d = d.add(1, 'month')
      let date = d.format('YYYY-MM-DD HH:mm:ss')
      return { value, date }
    })

    const parseDate = d3.time.format('%Y-%m-%d %H:%M:%S')
    data.forEach(function (d) {
      d.date = parseDate.parse(d.date)
      d.value = +d.value
    })

    const w = element.offsetWidth
    const h = element.offsetHeight

    const xMargin = 130
    const yMargin = 75

    const y = d3.scale
      .linear()
      .domain([0, 100])
      .range([h - yMargin, yMargin])
    const x = d3.time
      .scale()
      .domain(
        d3.extent(data, function (d) {
          return d.date
        }),
      )
      .range([xMargin, w - xMargin])

    const gradientY = d3.scale
      .linear()
      .domain([0, 30, 40, 100])
      .range([teamOne.primaryColor, teamTwo.primaryColor])
    const percentageMargin = 100 / data.length
    const percentageX = d3.scale
      .linear()
      .domain([0, data.length - 1])
      .range([percentageMargin, 100 - percentageMargin])

    const container = d3.select(element).append('div')

    vis = container.append('svg:svg').attr('width', w).attr('height', h)

    const g = vis
      .append('svg:g')
      .attr('stroke', 'url(#sparkline-gradient)')
      .attr('fill', 'url(#sparkline-gradient)')
      .attr('filter', 'url(#dropshadow)')

    const area = d3.svg
      .area()
      .interpolate('cardinal')
      .x(function (d, i) {
        return x(d.date)
      })
      .y0(h)
      .y1(function (d) {
        return y(d.value)
      })

    const line = d3.svg
      .line()
      .interpolate('cardinal')
      .x(function (d) {
        return x(d.date)
      })
      .y(function (d) {
        return y(d.value)
      })

    // draw line points
    const points = g
      .selectAll('.point')
      .data([data[0], data[data.length - 1]])
      .enter()
      .append('svg:circle')
      .attr('class', function (d, i) {
        'point end'
      })
      .attr('cx', function (d, i) {
        return x(d.date)
      })
      .attr('cy', function (d, i) {
        return y(d.value)
      })
      .attr('r', function (d, i) {
        return 7
      })

    // draw line with data
    g.append('svg:path').attr('d', line(data))

    // attach gradient to line
    const defs = vis.append('svg:defs')

    addDrawDropShadow(vis)

    defs
      .append('svg:linearGradient')
      .attr('id', 'sparkline-gradient')
      .attr('x1', '0%')
      .attr('y1', '0%')
      .attr('x2', '100%')
      .attr('y2', '0%')
      .attr('gradientUnits', 'userSpaceOnUse')
      .selectAll('.gradient-stop')
      .data([0, 20, 40, 80])
      .enter()
      .append('svg:stop')
      .attr('offset', function (d, i) {
        return percentageX(d) + '%'
      })
      .attr('style', function (d) {
        return 'stop-color:' + gradientY(d) + ';stop-opacity:1'
      })
  }
  /**
   * draw line shadows
   * @param {*} svg
   */
  const addDrawDropShadow = (svg) => {
    var dropShadow = {
      stdDeviation: 5,
      dx: 0,
      dy: 25,
      slope: 0.1,
      type: 'linear',
    }
    var activeDropShadow = 'dropshadow'

    var filter = svg
      .append('defs')
      .append('filter')
      .attr('id', activeDropShadow)
      // x, y, width and height represent values in the current coordinate system that results
      // from taking the current user coordinate system in place at the time when the
      // <filter> element is referenced
      // (i.e., the user coordinate system for the element referencing the <filter> element via a filter attribute).
      .attr('filterUnits', 'userSpaceOnUse')

    filter
      .append('feGaussianBlur')
      .attr('in', 'SourceAlpha')
      .attr('stdDeviation', parseInt(dropShadow.stdDeviation))

    filter
      .append('feOffset')
      .attr('dx', parseInt(dropShadow.dx))
      .attr('dy', parseInt(dropShadow.dy))

    var feComponentTransfer = filter.append('feComponentTransfer')
    feComponentTransfer
      .append('feFuncA')
      .attr('type', dropShadow.type)
      .attr('slope', parseFloat(dropShadow.slope))

    var feMerge = filter.append('feMerge')
    feMerge.append('feMergeNode')
    feMerge.append('feMergeNode').attr('in', 'SourceGraphic')
  }

  /**
   * Listen  DOMContentLoaded event.
   * Draw graph
   * Set Page Properties
   *  */
  doc.addEventListener('DOMContentLoaded', function () {
    fetch('data.json')
      .then((response) => response.json())
      .then((json) => {
        drawGraph(json)
        setPageProperties(json)
      })
  })
})(document)
