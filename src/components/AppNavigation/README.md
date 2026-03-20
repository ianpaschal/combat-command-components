The `<AppNavigation/>` component renders a fixed navigation bar into a portal target, supporting both desktop and mobile layouts.

### Behavior

On **desktop**, the bar renders across the top.
Hovering a route that has children (indicated with an arrow) reveals a dropdown of sub-routes.
On **mobile**, the bar switches to a drawer.
Routes with children have a button on the right (with an arrow) which can be used expand its sub-routes.
An indicator is shown beside routes whose path matches the value of the `location` prop.
A secondary, lighter indicator is shown besides the parent routes.

> **NOTE:** There is no collision detection.
> Avoid adding more top-level routes than will comfortably fit.

### Menu State

All navigation state is a single `state: string[] | null` shared via `NavigationProvider`.

- `null`: Everything closed (desktop menus collapsed, mobile drawer closed)
- `[]`: Mobile drawer open, no sub-routes visible
- `['/foo']`: Drawer open, `/foo` sub-routes visible
- `['/foo', '/foo/bar']`: `/foo` and `/foo/bar` sub-routes both visible

Each entry is the path whose children are currently expanded, indexed by nesting depth. Navigating to any route always resets state to `null`.
