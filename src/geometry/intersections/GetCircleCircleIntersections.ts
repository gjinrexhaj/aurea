import type {GeometryDocument} from "../GeometryDocument.ts";
import type {IntersectionPoint} from "./IntersectionPoint.ts";
import {getPointById} from "../utils/GetPointById.ts";
import {distance} from "../utils/Distance.ts";
import {circleCircleIntersections} from "./CircleCircleIntersection.ts";

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