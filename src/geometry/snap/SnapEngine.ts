import type {GeometryDocument} from "../GeometryDocument.ts";
import {findPointAt} from "../utils/HitTesting.ts";

import type {SnapResult} from "./SnapResult.ts";
import {getLineLineIntersections} from "../intersections/GetLineLineIntersections.ts";
import {distance} from "../utils/Distance.ts";
import {getLineCircleIntersections} from "../intersections/GetLineCircleIntersections.ts";
import {getCircleCircleIntersections} from "../intersections/GetCircleCircleIntersections.ts";
import {type SnapSettings, defaultSnapSettings} from "./SnapSettings.ts";

// master snap function
export function snapAt(
    x: number,
    y: number,
    document: GeometryDocument,
    settings: SnapSettings = defaultSnapSettings
): SnapResult {
    if (!settings.enabled) {
        return null;
    }

    // snap to point
    if (settings.snapPoints) {
        const point = findPointAt(x, y, document.points, settings.snapRadius);
        if (point) {
            return { type: "point", pointId: point.id, x: point.x, y: point.y };
        }
    }

    // snap to intersection
    const intersection = findIntersectionSnap(x, y, document, settings);
    if (intersection) {
        return { type: "intersection", x: intersection.x, y: intersection.y };
    }

    // snap to hardcoded origin
    if (settings.snapOrigin && distance({ x, y }, { x: 0, y: 0 }) <= settings.snapRadius) {
        return {
            type: "intersection",
            x: 0,
            y: 0,
        };
    }

    // no snap
    return null;
}

function findIntersectionSnap(
    x: number,
    y: number,
    document: GeometryDocument,
    settings: SnapSettings
): { x: number; y: number } | null {
    const intersections = [
        ...(settings.snapLineLine ? getLineLineIntersections(document) : []),
        ...(settings.snapLineCircle ? getLineCircleIntersections(document) : []),
        ...(settings.snapCircleCircle ? getCircleCircleIntersections(document) : []),
    ];

    let closestIntersection: { x: number; y: number } | null = null;
    let closestDist = Infinity;

    for (const intersection of intersections) {
        const d = distance({x, y}, intersection);

        if (d <= settings.snapRadius && d < closestDist) {
            closestDist = d;
            closestIntersection = intersection;
        }
    }

    return closestIntersection;
}