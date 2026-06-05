import type {Point} from "./Point.ts";

export type CompassState = {
    stage: "idle" | "anchor" | "radius";
    anchor?: Point;
    previewRadius?: number;
    previewPoint?: Point;
}