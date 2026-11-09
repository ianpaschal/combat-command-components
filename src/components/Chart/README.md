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

### Keyboard and Screen Readers

The plot of a chart with axes can be focused with the Tab key, and shows a focus ring when it is.

- The arrow keys select the next or previous category, and Home and End select the first or last.
- A category out of view is scrolled into view, and its tooltip is shown in the middle of the plot.
- Escape clears the selection, as does moving focus away.

A category selected with the keyboard is announced to screen readers through a live region, with its title and each series' value.
The tooltip itself is hidden from screen readers, so that it isn't read twice.

`label` gives the plot its accessible name, such as the chart's title.
The SVG and the axes are hidden from screen readers.

### Data

Charts with axes take their data in the same shape:

- `series` lists the series, each with a `key`, `color` and `label`.
- `data` lists the categories, each with an `x` and a `values` object of series key to value.

Charts without axes take a list of slices, each with a `key`, `color`, `label` and `value`.
`<ChartPie/>` and `<ChartRatio/>` take the same slices, so the same data can be shown either way.

### Legends

Charts don't draw their own legends.
`<ChartLegend/>` takes the same `series` as a chart, so it can be placed anywhere around it.

### Sizing

Charts fill their container by default.
Charts with axes can instead give each axis a fixed tick size with `categoryTickSize` and `valueTickSize`.
The plot is then exactly as long as its ticks need along that axis, and scrolls when the chart is smaller, with its axes following it.
`scrollToEnd` starts a scrolling chart at the end of its category axis, such as the latest values of a time series.
It keeps the chart there as the chart grows, until the viewer scrolls away from the end.

### Charts With Axes

`<ChartBar/>` and `<ChartLine/>` share the props of their frame, which are described on `ChartPlotFrameProps`.

#### Axes

The x axis is the horizontal one and the y axis is the vertical one, whatever they show.
In a horizontal bar chart, the categories are on the y axis.

- `xAxisPosition` - Puts the x axis `top`, `bottom` or on `both` sides of the plot. Defaults to `bottom`.
- `yAxisPosition` - Puts the y axis `left`, `right` or on `both` sides of the plot. Defaults to `left`.

The labels always sit on the side of an axis which faces the plot.

#### Spacing

The plot and its axes have two kinds of spacing:

- `padding` - Empty space inside the plot, between its edges and its outermost values. The axes' labels move with the values, so it moves them in too. `paddingX`, `paddingY`, `paddingTop`, `paddingRight`, `paddingBottom` and `paddingLeft` override it for some sides.
- `axisPadding` - Empty space on the outer side of each axis, such as to the left of a y axis on the left. It is inside the axes' scroll areas, so their edges and shadows still reach the edges of the chart.

To run a chart to the edges of a card, take away the card's padding around it and give the chart the same `axisPadding`.

#### Edge Labels

Labels are centered on their values, so the labels at the very ends of an axis would reach past the plot and be cut off.
`edgeLabels` sets how they sit:

- `shift` - Moves them inward, so that they end at the ends of the axis. This is the default.
- `center` - Keeps them centered like the other labels. Use `padding` to make room for them.

Labels centered in bands, such as a bar chart's categories, are never at the very ends.

#### Clipping

The plot and each axis sit in scroll areas of their own, which clip what they show at their edges.
No label shows past the edge of the plot, even while it scrolls.
The marks for the selected item, such as the line and dots on a line chart, sit in an overlay above the plot instead, so they show in full on its edges.

### Contents

- `<Chart/>` - The root of every chart. It measures itself, tracks the selected item, and shows its tooltip. It draws its children from its size and selection.
- `<ChartPlot/>` - The frame of a chart with axes. The plot and each axis sit in scroll areas of their own. Only the plot's can be scrolled, and the axes' follow it. It draws the chart's data from `children`, and the marks for the selected item from `overlay`.
- `<ChartPlotAxis/>` - One of a plot's axes, on one side of it, with its labels centered on their values or shifted in at the ends.
- `<ChartTooltip/>` - The tooltip, with a title and one row per series, shown in a portal next to the pointer.
- `useChartSelection` - Tracks the selected item, and provides pointer handlers for single items, such as slices, or for areas which work out the item under the pointer, such as a plot.
- `useChartDismiss` - Clears a chart's selection when the viewer taps outside it or scrolls.
- `useScrollToEnd` - Keeps a scroll area scrolled to its end as it or its content changes size, until the viewer scrolls away.
- `useElementSize` - Tracks the size of an element.
