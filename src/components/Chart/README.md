The `Chart` folder holds the code shared by the chart components: `<ChartBar/>`, `<ChartLine/>`, `<ChartPie/>` and `<ChartRatio/>`.
None of it is exported from the package.
The charts are drawn as plain SVG, without a charting library.

### Shared Behavior

Every chart behaves the same way when the viewer points at it:

- Hovering an item selects it, fading the other items and showing a tooltip next to the pointer.
- On touch screens, tapping an item selects it, and tapping it again clears it.
- Tapping outside the chart, or scrolling anything, clears the selection.
- Dragging scrolls a chart which is bigger than its container, rather than selecting anything.

Tooltips are rendered in a portal on the document's body, with a fixed position.
They are never clipped by a card or scroll area around the chart.
They open towards the middle of the viewport, so that they stay on screen.

### Data

Charts with axes take their data in the same shape:

- `series` lists the series, each with a `key`, `color` and `label`.
- `data` lists the categories, each with an `x` and a `values` object of series key to value.

Charts without axes take a list of slices, each with a `key`, `color`, `label` and `value`.
`<ChartPie/>` and `<ChartRatio/>` take the same slices, so the same data can be shown either way.

### Sizing

Charts fill their container by default.
Charts with axes can instead give each axis a fixed tick size with `categoryTickSize` and `valueTickSize`.
The plot is then exactly as long as its ticks need along that axis, and scrolls under its axes when the chart is smaller.

### Contents

- `<Chart/>` - The root of every chart. It measures itself, tracks the selected item, and shows its tooltip. It draws its children from its size and selection.
- `<ChartPlot/>` - The frame of a chart with an x and a y axis. The plot sits in a scroll area, and the axes stick to its left and bottom edges, so that the plot scrolls under them.
- `<ChartPlotAxis/>` - One of a plot's axes, with its labels centered on their values.
- `<ChartTooltip/>` - The tooltip, with a title and one row per series, shown in a portal next to the pointer.
- `useChartSelection` - Tracks the selected item, and provides pointer handlers for single items, such as slices, or for areas which work out the item under the pointer, such as a plot.
- `useChartDismiss` - Clears a chart's selection when the viewer taps outside it or scrolls.
- `useElementSize` - Tracks the size of an element.
