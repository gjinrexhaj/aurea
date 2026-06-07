import type {GeometryDocument} from "../GeometryDocument.ts";
import type {IntersectionPoint} from "./IntersectionPoint.ts";
import {getPointById} from "../utils/GetPointById.ts";
import {distance} from "../utils/Distance.ts";
import type {Point} from "../Point.ts";

export function getCircleCircleIntersections(
    document: GeometryDocument,
): IntersectionPoint[] {

    const intersections: IntersectionPoint[] = [];

    for (let i = 0; i < document.circles.length; i++) {

        for (let j = i + 1; j < document.circles.length; j++) {

            const circleA = document.circles[i];
            const circleB = document.circles[j];

            const centerA = getPointById(circleA.centerPointId, document.points,);
            const radiusPointA = getPointById(circleA.radiusPointId, document.points,);

            const centerB = getPointById(circleB.centerPointId, document.points,);
            const radiusPointB = getPointById(circleB.radiusPointId, document.points,);

            if (!centerA || !radiusPointA || !centerB || !radiusPointB) {
                continue;
            }

            const radiusA = distance(centerA, radiusPointA);

            const radiusB = distance(centerB, radiusPointB);

            intersections.push(
                ...circleCircleIntersections(
                    centerA,
                    radiusA,
                    centerB,
                    radiusB,
                )
            );
        }
    }

    return intersections;
}


function circleCircleIntersections(centerA: Point, radiusA: number, centerB: Point, radiusB: number): IntersectionPoint[] {
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