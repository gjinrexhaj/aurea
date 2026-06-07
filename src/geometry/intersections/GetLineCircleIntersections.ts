import type {GeometryDocument} from "../GeometryDocument.ts";
import type {IntersectionPoint} from "./IntersectionPoint.ts";
import {getPointById} from "../utils/GetPointById.ts";
import {distance} from "../utils/Distance.ts";
import {lineCircleIntersections} from "./LineCircleIntersection.ts";

export function getLineCircleIntersections(document: GeometryDocument): IntersectionPoint[] {
    const intersections: IntersectionPoint[] = [];

    for (const line of document.lines) {

        const lineA = getPointById(line.pointAId, document.points);
        const lineB = getPointById(line.pointBId, document.points);

        if (!lineA || !lineB) {
            continue;
        }

        for (const circle of document.circles) {
            const center = getPointById(circle.centerPointId, document.points);
            const radiusPoint = getPointById(circle.radiusPointId, document.points);

            if (!center || !radiusPoint) {
                continue;
            }

            const radius = distance(center, radiusPoint);

            intersections.push(
                ...lineCircleIntersections(
                    lineA,
                    lineB,
                    center,
                    radius,
                )
            );
        }
    }
    return intersections;
}