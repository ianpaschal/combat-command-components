The `<ChartPie/>` component shows parts of a whole, as slices of a pie or donut.

### Slices

Each slice has a color, a label and a value, and is sized by its value's share of the total.
`innerRadius` cuts a hole in the middle, as a fraction of the pie's radius, to make a donut.
`otherThreshold` folds every slice whose share is below it into a single "Other" slice, whose tooltip lists the slices folded into it.

### Gaps and Corners

`spacing` sets the gap between slices.
The sides of each gap are straight and parallel, so the gap is the same width all the way along.
`cornerRadius` rounds the corners of each slice.
It shrinks to fit slices which are too thin, or rings which are too narrow, for the full radius.

### Shape

`origin` sets where the first slice starts, and `direction` sets which way the slices run from there.
`sweep` sets how much of the circle the chart spans, from 0 to 1.
A sweep of 0.5 with a `left` origin makes a hemisphere chart.
The chart takes the shape of the part of the circle it spans, so a hemisphere is twice as wide as it is tall.

### Proportions

`fill` sets how much of the sweep the slices fill together, from 0 to 1, to show a proportion of a proportion.
`remainderColor` fills the rest of the sweep with a segment of its own, which has no tooltip.
A sweep of 0.5 with a fill of 0.7 and a remainder color makes a gauge.
