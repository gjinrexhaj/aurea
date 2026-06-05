import type { Point } from "./Point";
import type {Circle} from "./Circle.ts";

export type GeometryDocument = {
    points: Point[];
    circles: Circle[];
};