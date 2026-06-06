import type { Point } from "./Point";
import type { Circle } from "./Circle.ts";
import type { Line } from "./Line.ts";

export type GeometryDocument = {
    points: Point[];
    circles: Circle[];
    lines: Line[];
};