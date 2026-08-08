# TypeScript File Reference

This document covers every current `.ts` and `.tsx` file in the repository.

---

## `src/main.tsx`

- **Kind**: React entrypoint
- **Exports**: none
- **Imports**: `StrictMode`, `createRoot`, `App`, `global.css`
- **Responsibility**: mounts `<App />` to `#root`.
- **Used by**: Vite bootstrap/runtime.

## `src/App.tsx`

- **Kind**: top-level React component
- **Exports**: default `App()`
- **Imports**: `EditorPage` (with commented `LandingPage` flow)
- **Responsibility**: app-level route/entry selection (currently always editor).
- **Used by**: `src/main.tsx`.

## `src/pages/LandingPage.tsx`

- **Kind**: UI page component
- **Exports**: default `LandingPage(props)`
- **Imports**: `LandingPage.css`
- **Responsibility**: marketing/entry screen with “Enter Workspace” action.
- **Used by**: currently not active in `App.tsx` (commented flow).

## `src/pages/EditorPage.tsx`

- **Kind**: UI page component
- **Exports**: default `EditorPage()`
- **Imports**: React state, `ViewSettings`, `GeometryLayer`, `Toolbar`, `Canvas`
- **Responsibility**: owns global editor state and wires toolbar + canvas.
- **Used by**: `src/App.tsx`.

---

## `src/ui/Toolbar.tsx`

- **Kind**: UI control component
- **Exports**: named `Toolbar`
- **Imports**: `Tools`, `ViewSettings`, `GeometryLayer`, CSS
- **Responsibility**: tool selection, view toggles, and active layer switching.
- **Used by**: `src/pages/EditorPage.tsx`.

## `src/ui/ViewSettings.ts`

- **Kind**: shared type module
- **Exports**: `ViewSettings`
- **Imports**: none
- **Responsibility**: controls axes/grid/infinite-line visibility flags.
- **Used by**: `EditorPage.tsx`, `Toolbar.tsx`, `Canvas.tsx`, `GeometrySvg.tsx`.

## `src/store/Tools.ts`

- **Kind**: constants + union types
- **Exports**: `Tool`, `Tools`
- **Imports**: none
- **Responsibility**: canonical list of drawing/interaction tools.
- **Used by**: `src/ui/Toolbar.tsx`.

---

## `src/canvas/Canvas.tsx`

- **Kind**: interaction controller component
- **Exports**: default `Canvas(props)`
- **Imports**: geometry types, state types, utility functions, snap engine, `GeometrySvg`
- **Responsibility**:
  - pointer event handling
  - camera pan/zoom transform state
  - tool action dispatch (`select`, `point`, `compass`, `line`)
  - selection/deletion behavior
  - scene state (`GeometryDocument`) mutation
- **Used by**: `src/pages/EditorPage.tsx`.

## `src/canvas/GeometrySvg.tsx`

- **Kind**: render-only scene component
- **Exports**: default `GeometrySvg(props)`
- **Imports**: geometry types, distance/getters, view settings, infinite line helper
- **Responsibility**:
  - draws axes, circles, lines, points, previews, snap marker
  - applies camera transform to world-space geometry
  - maps hover/selection/layer state to stroke/fill style
- **Used by**: `src/canvas/Canvas.tsx`.

---

## `src/geometry/Point.ts`

- **Kind**: domain type
- **Exports**: `Point`
- **Imports**: none
- **Responsibility**: point primitive (`id`, `x`, `y`).
- **Used by**: broad geometry modules and state types.

## `src/geometry/Line.ts`

- **Kind**: domain type
- **Exports**: `Line`
- **Imports**: `GeometryLayer`
- **Responsibility**: line primitive referencing two point IDs + layer.
- **Used by**: document model, rendering, hit-testing, intersections.

## `src/geometry/Circle.ts`

- **Kind**: domain type
- **Exports**: `Circle`
- **Imports**: `GeometryLayer`
- **Responsibility**: circle primitive referencing center/radius point IDs + layer.
- **Used by**: document model, rendering, hit-testing, intersections.

## `src/geometry/GeometryLayer.ts`

- **Kind**: domain union type
- **Exports**: `GeometryLayer`
- **Imports**: none
- **Responsibility**: geometric style layer (`"construction" | "final"`).
- **Used by**: `Circle`, `Line`, `EditorPage`, `Toolbar`, `Canvas`.

## `src/geometry/GeometryDocument.ts`

- **Kind**: domain aggregate type
- **Exports**: `GeometryDocument`
- **Imports**: `Point`, `Circle`, `Line`
- **Responsibility**: canonical scene structure (`points`, `circles`, `lines` arrays).
- **Used by**: `Canvas`, `GeometrySvg`, hit-testing, snap engine, intersections.

---

## `src/geometry/state/CompassState.ts`

- **Kind**: tool-state type
- **Exports**: `CompassState`
- **Imports**: `Point`
- **Responsibility**: compass interaction phase and optional preview values.
- **Used by**: `Canvas`, `GeometrySvg`.

## `src/geometry/state/LineState.ts`

- **Kind**: tool-state type
- **Exports**: `LineState`
- **Imports**: none
- **Responsibility**: line tool transient state (`firstPointId`).
- **Used by**: `Canvas`, `GeometrySvg`.

## `src/geometry/state/Selection.ts`

- **Kind**: interaction state union
- **Exports**: `Selection`
- **Imports**: none
- **Responsibility**: selected entity descriptor (`point|line|circle|null`).
- **Used by**: `Canvas`, `GeometrySvg`, `HitTesting`.

## `src/geometry/state/Hover.ts`

- **Kind**: interaction state union
- **Exports**: `Hover`
- **Imports**: none
- **Responsibility**: hovered entity descriptor (`point|line|circle|null`).
- **Used by**: `Canvas`, `GeometrySvg`.

---

## `src/geometry/utils/CursorPos.ts`

- **Kind**: utility type
- **Exports**: `CursorPos`
- **Imports**: none
- **Responsibility**: world-space pointer position struct.
- **Used by**: `Canvas`, `GeometrySvg`.

## `src/geometry/utils/Distance.ts`

- **Kind**: pure math helper module
- **Exports**: `distance`, `distancePointToSegment`
- **Imports**: none
- **Responsibility**:
  - Euclidean distance between two positions
  - nearest distance from point to finite line segment
- **Used by**: hit-testing, rendering preview radius, snap proximity checks, intersections.

## `src/geometry/utils/GetPointById.ts`

- **Kind**: lookup helper module
- **Exports**: `getPointById`
- **Imports**: `Point`
- **Responsibility**: resolve point references from ID-linked geometry.
- **Used by**: `Canvas`, `GeometrySvg`, hit-testing, all intersection modules.

## `src/geometry/utils/GetInfiniteLineEndpoints.ts`

- **Kind**: geometry helper module
- **Exports**: `getInfiniteLineEndpoints`
- **Imports**: `Point`
- **Responsibility**: extends a line direction to long display endpoints.
- **Used by**: `GeometrySvg` when infinite-line view is enabled.

## `src/geometry/utils/HitTesting.ts`

- **Kind**: interaction utility module
- **Exports**: `findPointAt`, `findLineAt`, `findCircleAt`, `pickAt`
- **Imports**: `Point`, `Line`, `Circle`, `GeometryDocument`, `Selection`, `getPointById`, `distancePointToSegment`
- **Responsibility**:
  - hit detection for primitives
  - nearest selectable entity resolution
  - single-pick API used by selection/hover logic
- **Used by**: `Canvas` (selection + hover), `SnapEngine` (point snap).

---

## `src/geometry/snap/SnapResult.ts`

- **Kind**: interaction union type
- **Exports**: `SnapResult`
- **Imports**: none
- **Responsibility**: describes snap outcome (`point`, `intersection`, `null`).
- **Used by**: `Canvas`, `GeometrySvg`, `SnapEngine`.

## `src/geometry/snap/SnapEngine.ts`

- **Kind**: interaction engine module
- **Exports**: `snapAt`
- **Imports**: `GeometryDocument`, `findPointAt`, `SnapResult`, `getLineLineIntersections`, `getLineCircleIntersections`, `getCircleCircleIntersections`, `distance`
- **Responsibility**:
  - central snapping strategy orchestration
  - intersection aggregation + proximity filtering
  - origin snap fallback
- **Used by**: `Canvas`.

---

## `src/geometry/intersections/IntersectionPoint.ts`

- **Kind**: geometry type module
- **Exports**: `IntersectionPoint`
- **Imports**: none
- **Responsibility**: normalized intersection coordinate + source tag.
- **Used by**: all intersection calculation modules.

## `src/geometry/intersections/GetLineLineIntersections.ts`

- **Kind**: geometry algorithm module
- **Exports**: `getLineLineIntersections`, `lineLineIntersection`
- **Imports**: `GeometryDocument`, `getPointById`, `Point`, `IntersectionPoint`
- **Responsibility**:
  - pairwise line-line intersection discovery from document
  - analytic 2D line intersection solver
- **Used by**: `SnapEngine`.

## `src/geometry/intersections/GetLineCircleIntersections.ts`

- **Kind**: geometry algorithm module
- **Exports**: `getLineCircleIntersections`, `lineCircleIntersections`
- **Imports**: `GeometryDocument`, `IntersectionPoint`, `getPointById`, `distance`, `Point`
- **Responsibility**:
  - line-circle intersection discovery across document
  - quadratic solver for 0/1/2 intersection points
- **Used by**: `SnapEngine`.

## `src/geometry/intersections/GetCircleCircleIntersections.ts`

- **Kind**: geometry algorithm module
- **Exports**: `getCircleCircleIntersections`
- **Imports**: `GeometryDocument`, `IntersectionPoint`, `getPointById`, `distance`, `Point`
- **Responsibility**:
  - circle-pair intersection discovery across document
  - geometric solver for disjoint/tangent/secant circle cases
- **Used by**: `SnapEngine`.

---

## `src/construction/ConstructionStep.ts`

- **Kind**: domain event/type module
- **Exports**: `CreatePointStep`, `CreateCircleStep`, `ConstructionStep`
- **Imports**: none
- **Responsibility**: typed construction-step representation for potential history/replay pipelines.
- **Used by**: currently not imported elsewhere.

---

## `vite.config.ts`

- **Kind**: build config module
- **Exports**: default `defineConfig(...)`
- **Imports**: `defineConfig` from Vite, React plugin
- **Responsibility**: Vite plugin setup and deployment base path (`/aurea/`).
- **Used by**: Vite CLI/tooling.

---

## Agent-ready dependency anchors

If an agent needs to add/modify behavior, start from these files:

1. **Add or change tool behavior**: `src/canvas/Canvas.tsx`, `src/ui/Toolbar.tsx`, `src/store/Tools.ts`
2. **Add new primitive/rendering behavior**: `src/geometry/*.ts`, `src/canvas/GeometrySvg.tsx`, `src/geometry/utils/HitTesting.ts`
3. **Add new snap targets**: `src/geometry/snap/SnapEngine.ts` + relevant intersection/math modules
4. **Add view toggles**: `src/ui/ViewSettings.ts`, `src/ui/Toolbar.tsx`, `src/canvas/GeometrySvg.tsx`

