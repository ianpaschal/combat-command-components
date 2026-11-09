The `<ChartBar/>` component compares values across categories, as bars.

### Series

A chart has one or more series, each with a color and a label.
With several series, `mode` sets how they are drawn:

- `grouped` - Each series gets its own bar, side by side within its category.
- `stacked` - The series are drawn end to end in a single bar. Stacked bars only support values of 0 and above.

`spacing` sets the gap between grouped bars, or between the segments of a stacked bar.

A category can give each series its own color as `colors`, keyed by series like `values`.
Use it to tell apart the bars of a single series, such as by shading them from highest to lowest.
A series without a color in a category uses the series' color.

### Shares

To show each bar as parts of 100%, pass each series' share of the category, from 0 to 1, rather than its raw value.
Then set `valueTicks` to `[0, 0.25, 0.5, 0.75, 1]` and pass a `formatValue` which shows percentages.

### Ranges

A category can give each series a range as `ranges`, keyed by series like `values`, with the lowest and highest values.
Each range is drawn as a muted whisker over its bar, with a cap at each end.
Use it to show how sure a value is, such as with a confidence interval, so that values from little data don't look as certain as values from a lot.
Ranges are ignored when stacked.

### Orientation

`orientation` sets which way the bars run.
`vertical` bars stand up from the x axis, and `horizontal` bars run out from the y axis.
The axis props follow the screen, so in a horizontal chart `yAxisPosition` moves the categories and `xAxisPosition` moves the values.

### Sizing

Without tick sizes, the plot fills the chart.
`categoryTickSize` gives each category a fixed amount of space, so the plot scrolls along the category axis when the chart is too small.
`barSize` sets the thickness of each bar.
Without it, a category's bars fill most of its space together.
`scrollToEnd` starts a scrolling chart at its last category.

### Axes and Spacing

The axes, padding, edge labels and clipping work as in every chart with axes.
See "Charts With Axes" on the Charts overview page.
