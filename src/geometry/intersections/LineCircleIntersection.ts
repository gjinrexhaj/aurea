import type {Point} from "../Point.ts";
import type {IntersectionPoint} from "./IntersectionPoint.ts";

export function lineCircleIntersections(lineA: Point, lineB: Point, center: Point, radius: number): IntersectionPoint[] {
    const dx = lineB.x - lineA.x;
    const dy = lineB.y - lineA.y;

    const fx = lineA.x - center.x;
    const fy = lineA.y - center.y;

    const a = dx * dx + dy * dy;
    const b = 2 * (fx * dx + fy * dy);
    const c = fx * fx + fy * fy - radius * radius;

    const discriminant = b * b - 4 * a * c;

    if (discriminant < 0) {
        return [];
    }

    // tangent
    if (Math.abs(discriminant) < 0.000001) {
        const t = -b / (2 * a);

        return [
            {
                x: lineA.x + t * dx,
                y: lineA.y + t * dy,
                source: "line-circle",
            },
        ];
    }

    const sqrtD = Math.sqrt(discriminant);

    const t1 = (-b + sqrtD) / (2 * a);
    const t2 = (-b - sqrtD) / (2 * a);

    return [
        {
            x: lineA.x + t1 * dx,
            y: lineA.y + t1 * dy,
            source: "line-circle",
        },
        {
            x: lineA.x + t2 * dx,
            y: lineA.y + t2 * dy,
            source: "line-circle",
        },
    ];
}