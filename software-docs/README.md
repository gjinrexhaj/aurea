# Aurea Software Documentation

This directory contains documentation for the TypeScript/TSX codebase of **Aurea** (sacred geometry construction app).

## Docs in this folder

1. [`architecture-and-flows.md`](./architecture-and-flows.md)  
   System architecture, geometry model, tool behavior, and runtime interaction flows.
2. [`ts-file-reference.md`](./ts-file-reference.md)  
   Complete reference for every `.ts` and `.tsx` file currently in the repo.

## Conventions

Use these rules to keep future edits consistent:

1. **Model-first edits**: preserve `GeometryDocument` shape (`points`, `lines`, `circles`) and ID-based relationships.
2. **Tool state boundaries**: keep per-tool transient state in `Canvas.tsx` (`compass`, `lineState`, `selection`, `hovered`, `snapResult`).
3. **Pure geometry utilities**: put math, hit-testing, and intersection logic under `src/geometry/**`; avoid React dependencies there.
4. **Rendering isolation**: keep scene drawing in `GeometrySvg.tsx`; keep pointer/tool logic in `Canvas.tsx`.
5. **Union-type evolution**: if adding a new selectable/snap/intersection type, update all related unions and all switch/case consumers together.
6. **Layer semantics**: geometry elements that support layers must stay aligned with `GeometryLayer` (`construction` vs `final`).

## Source scope documented

The reference currently covers all discovered TypeScript files:

- `src/**/*.ts`
- `src/**/*.tsx`
- `vite.config.ts`

