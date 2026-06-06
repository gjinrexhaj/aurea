import type {Point} from "../Point.ts";

export type CompassState = {
    stage: "idle" | "anchor" | "radius";
    centerPointId?: string;
    previewRadius?: number;
    previewPoint?: Point;
}