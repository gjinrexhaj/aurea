import type { Point } from "../Point";
import type { IntersectionPoint } from "./IntersectionPoint";

export function circleCircleIntersections(centerA: Point, radiusA: number, centerB: Point, radiusB: number): IntersectionPoint[] {
    // calc distance, do manually as we need dx and dy in addition to distance
    const dx = centerB.x - centerA.x;
    const dy = centerB.y - centerA.y;

    const d = Math.sqrt(dx * dx + dy * dy);

    // reject impossible cases
    if (d > radiusA + radiusB) {
        return [];
    }
    if (d < Math.abs(radiusA - radiusB)) {
        return [];
    }
    if (d === 0 && radiusA === radiusB) {
        return [];
    }

    // compute base point
    const a = ( radiusA * radiusA - radiusB * radiusB + d * d)/(2 * d);

    // height from midpoint to intersection
    const hSquared = radiusA * radiusA - a * a;

    // fp error protection
    const h = Math.sqrt(Math.max(0, hSquared));

    // midpoint
    const xm = centerA.x + a * dx / d;
    const ym = centerA.y + a * dy / d;

    // tangent case
    if (h < 0.000001) {
        return [
            {x: xm, y: ym, source: "circle-circle"}
        ];
    }

    // perpendicular offset
    const rx = -dy * (h / d);
    const ry = dx * (h / d);


    return [{x: xm + rx, y: ym + ry, source: "circle-circle"},
            {x: xm - rx, y: ym - ry, source: "circle-circle"}];
}