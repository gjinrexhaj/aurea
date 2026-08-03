# Architecture and Runtime Flows

## High-level architecture

The app is a React + Vite TypeScript SPA for sacred geometry drafting with a virtual straightedge and compass.

Runtime layers:

1. **App shell/UI layer** (`main.tsx`, `App.tsx`, `pages/*`, `ui/*`)
2. **Interaction/controller layer** (`canvas/Canvas.tsx`)
3. **Rendering layer** (`canvas/GeometrySvg.tsx`)
4. **Geometry domain layer** (`geometry/*`, `construction/*`)

## Core data model

The canonical document is:

```ts
type GeometryDocument = {
  points: Point[];
  circles: Circle[];
  lines: Line[];
};
```

Key relationship rule: lines/circles reference points by ID rather than embedding coordinates.

## UI and state ownership

- `EditorPage.tsx` owns top-level UI state:
  - `activeTool`
  - `viewSettings`
  - `activeLayer`
- `Canvas.tsx` owns interactive scene state:
  - camera (`x`, `y`, `zoom`)
  - geometry document
  - transient tool state (`compass`, `lineState`)
  - UX state (`hovered`, `selection`, `snapResult`, `mousePos`, panning state)

`Toolbar.tsx` only emits control changes; `GeometrySvg.tsx` only renders.

## Pointer/tool flow

1. Pointer event enters `Canvas.tsx`.
2. Screen coordinates are converted to world coordinates with camera transform.
3. Snapping/hover hit testing runs (`snapAt`, `pickAt`) on pointer move.
4. Pointer down dispatches by `activeTool`:
   - `select`: set current selection
   - `point`: create a point (with optional intersection snap)
   - `compass`: 2-click circle definition (center point then radius point)
   - `line`: 2-click line definition (point A then point B)
5. Document updates trigger re-render in `GeometrySvg.tsx`.

## Geometry and math pipeline

### Hit testing (`geometry/utils/HitTesting.ts`)

- Point hit radius: 10
- Line segment hit radius: 6
- Circle circumference hit radius: 6
- Selection priority: **point → line → circle**

### Snap engine (`geometry/snap/SnapEngine.ts`)

Snap priority:

1. Existing point snap
2. Computed intersection snap:
   - line-line
   - line-circle
   - circle-circle
3. Origin fallback snap `(0,0)`

Snap radius: 6.

### Intersections (`geometry/intersections/*`)

- `GetLineLineIntersections.ts`: pairwise line intersections
- `GetLineCircleIntersections.ts`: each line against each circle
- `GetCircleCircleIntersections.ts`: pairwise circle intersections

Each intersection is returned as:

```ts
type IntersectionPoint = {
  x: number;
  y: number;
  source: "line-line" | "line-circle" | "circle-circle";
};
```

## Rendering behavior

`GeometrySvg.tsx` renders in one transformed `<g>` with camera translate/scale.

Visual layers:

1. Axes (optional)
2. Infinite line overlays (optional)
3. Circles
4. Line segments
5. Tool previews (line preview, compass preview)
6. Snap indicator
7. Points

Styling semantics:

- `construction` geometry defaults to light gray
- `final` geometry defaults to black
- hover = orange
- selection = blue

## Deletion semantics

`Canvas.tsx` handles Backspace/Delete:

- selected point: intended to remove the point and dependent geometry
- selected line/circle: remove only that element

## Build/deploy context

- Build script: `tsc -b && vite build`
- Deploy target base path: `/aurea/` (`vite.config.ts`)
- Deployment script uses `gh-pages` to publish `dist/`

