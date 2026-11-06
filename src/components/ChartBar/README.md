The `<ChartBar/>` component compares values across categories, as bars.

### Series

A chart has one or more series, each with a color and a label.
With several series, `mode` sets how they are drawn:

- `grouped` - Each series gets its own bar, side by side within its category.
- `stacked` - The series are drawn end to end in a single bar. Stacked bars only support values of 0 and above.

`spacing` sets the gap between grouped bars, or between the segments of a stacked bar.

### Shares

To show each bar as parts of 100%, pass each series' share of the category, from 0 to 1, rather than its raw value.
Then set `valueTicks` to `[0, 0.25, 0.5, 0.75, 1]` and pass a `formatValue` which shows percentages.

### Orientation

`orientation` sets which way the bars run.
`vertical` bars stand up from the x axis, and `horizontal` bars run out from the y axis.

### Sizing

Without tick sizes, the plot fills the chart.
`categoryTickSize` gives each category a fixed amount of space, so the plot scrolls along the category axis when the chart is too small.
`barSize` sets the thickness of each bar.
Without it, a category's bars fill most of its space together.
