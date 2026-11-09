The `<ChartRatio/>` component shows parts of a whole, as segments of a single bar.
It takes the same slices as `<ChartPie/>`, so the same data can be shown either way.
It replaces the deprecated `<RatioBar/>`.

### Segments

Each segment has a color, a label and a value, and is sized by its value's share of the total.
`otherThreshold` folds every segment whose share is below it into a single "Other" segment, whose tooltip lists the segments folded into it.
`spacing` sets the gap between segments, and `cornerRadius` rounds their corners.

### Proportions

`fill` sets how much of the bar the segments fill together, from 0 to 1, to show a proportion of a proportion.
`remainderColor` fills the rest of the bar with a segment of its own, which has no tooltip.

### Sizing

The bar fills its container's width.
`thickness` sets its height.
