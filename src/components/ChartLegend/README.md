The `<ChartLegend/>` component names each series of a chart next to its color.

### Placement

The legend is separate from the chart, so it can go anywhere around it, such as above it or in a card's header.
Pass it the same `series` as the chart, and the colors and labels match.

### Wrapping

The series run in a row, and wrap onto more lines when there is too little space.
`align` sets where they sit along each row: `start`, `center` or `end`. It defaults to `center`.

### Single Series

With fewer than two series there is no legend, since the chart's title already names a single series.
