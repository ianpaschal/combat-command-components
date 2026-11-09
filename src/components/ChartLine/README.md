The `<ChartLine/>` component shows values changing along an ordered x axis, such as time.

### Series

A chart has one or more series, each with a color and a label.
With several series, `mode` sets how they are drawn:

- `overlaid` - Each line runs from 0, over the ones before it. With `fill`, each line has a gradient under it.
- `stacked` - Each line runs on top of the ones before it, with solid bands between them. Stacked lines only support values of 0 and above.

### Curves

`curve` sets how lines run between points.
`smooth` lines curve through every point without overshooting, so they never suggest highs or lows which aren't in the data.
`linear` lines run straight from point to point.

### Hovering

The first and last x values sit at the edges of the plot, unless `padding` moves them in.
Hovering shows a line through the nearest x value, a dot on each series, and a tooltip with every series' value.
The line and dots sit above the plot, so they show in full on its edges.
In stacked charts, the tooltip lists the series from top to bottom, as they are drawn.

### Sizing

Without tick sizes, the plot fills the chart.
`categoryTickSize` gives each x value a fixed amount of space, so the plot scrolls sideways when the chart is too narrow.
`categoryTicks` limits which x values are labeled, for charts with many of them.
`scrollToEnd` starts a scrolling chart at its last x value, which suits time series.

### Axes and Spacing

The axes, padding, edge labels and clipping work as in every chart with axes.
See "Charts With Axes" on the Charts overview page.
