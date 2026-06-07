import type {Point} from "../Point.ts";

export type IntersectionPoint = {
    x: number;
    y: number;
};

export function lineLineIntersection(a1: Point, a2: Point, b1: Point, b2: Point): IntersectionPoint | null {
    const denominator = (a1.x - a2.x) * (b1.y - b2.y) - (a1.y - a2.y) * (b1.x - b2.x);

    if (Math.abs(denominator) < 0.000001) {
        return null;
    }

    const x = ((a1.x * a2.y - a1.y * a2.x) * (b1.x - b2.x) - (a1.x - a2.x) * (b1.x * b2.y - b1.y * b2.x))/denominator;
    const y = ((a1.x * a2.y - a1.y * a2.x) * (b1.y - b2.y) - (a1.y - a2.y) * (b1.x * b2.y - b1.y * b2.x))/denominator;

    return {x, y};
}