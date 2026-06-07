import type {GeometryDocument} from "../GeometryDocument.ts";
import {findPointAt} from "../utils/HitTesting.ts";

import type {SnapResult} from "./SnapResult.ts";
import {getLineIntersections} from "../intersections/GetLineIntersections.ts";
import {distance} from "../utils/Distance.ts";
import {getLineCircleIntersections} from "../intersections/GetLineCircleIntersections.ts";
import {getCircleCircleIntersections} from "../intersections/GetCircleCircleIntersections.ts";

const SNAP_RADIUS = 6;

// master snap function
export function snapAt(x: number, y: number, document: GeometryDocument): SnapResult {
    // snap to point
    const point = findPointAt(x, y, document.points);
    if (point) {
        return { type:"point", pointId: point.id, x: point.x, y: point.y};
    }


    // snap to intersection
    const intersection = findIntersectionSnap(x,y,document);
    if (intersection) {
        return { type:"intersection", x: intersection.x, y: intersection.y };
    }


    // no snap
    return null;
}


function findIntersectionSnap(x: number, y: number, document: GeometryDocument,
): { x: number; y: number } | null {
    const intersections = [
        ...getLineIntersections(document),
        ...getLineCircleIntersections(document),
        ...getCircleCircleIntersections(document)
    ];

    for (const intersection of intersections) {
        const d = distance({x,y}, intersection);

        if (d <= SNAP_RADIUS) {
            console.log(intersection);
            return intersection;
        }
    }

    return null;
}