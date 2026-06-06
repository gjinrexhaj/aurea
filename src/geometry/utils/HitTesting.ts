import type { Point } from "../Point.ts"
import type {Line} from "../Line.ts";
import {getPointById} from "./GetPointById.ts";
import {distancePointToSegment} from "./Distance.ts";
import type {Circle} from "../Circle.ts";
import type {GeometryDocument} from "../GeometryDocument.ts";
import type {Selection} from "../state/Selection.ts";

const POINT_HIT_RADIUS = 10;
const LINE_HIT_RADIUS = 6;
const CIRCLE_HIT_RADIUS = 6;

// point hit testing
export function findPointAt(x: number, y: number, points: Point[]): Point | undefined {
    return points.find(point => {
       const dx = x - point.x;
       const dy = y - point.y;

       const distance = Math.sqrt(dx * dx + dy * dy);

       return distance <= POINT_HIT_RADIUS;
    });
}

// line hit testing
export function findLineAt(x: number, y: number, lines: Line[], points: Point[]): Line | undefined {
    return lines.find(line => {
        const a = getPointById(line.pointAId, points);
        const b = getPointById(line.pointBId, points);

        if (!a || !b) return false;

        const dist = distancePointToSegment(
            x, y,
            a.x, a.y,
            b.x, b.y,
        );

        return dist <= LINE_HIT_RADIUS;
    });
}

// circle hit testing
export function findCircleAt(x: number, y: number, circles: Circle[], points: Point[]): Circle | undefined {
    return circles.find(circle => {
        const center = getPointById(circle.centerPointId, points);
        const radiusPoint = getPointById(circle.radiusPointId, points);

        if (!center || !radiusPoint) return false;

        const dx = x - center.x;
        const dy = y - center.y;

        const distToCenter = Math.sqrt(dx * dx + dy * dy);

        const radius =
            Math.sqrt(
                (radiusPoint.x - center.x) ** 2 +
                (radiusPoint.y - center.y) ** 2
            );

        return Math.abs(distToCenter - radius) <= CIRCLE_HIT_RADIUS;
    });
}

// primitive selection logic
export function pickAt(x: number, y: number, document: GeometryDocument,): Selection {

    // points
    const point = findPointAt(x, y, document.points);
    if (point) {
        return {
            type: "point",
            id: point.id,
        };
    }

    // lines
    const line = findLineAt(x, y, document.lines, document.points);
    if (line) {
        return {
            type: "line",
            id: line.id,
        };
    }

    // circles
    const circle = findCircleAt(x, y, document.circles, document.points);
    if (circle) {
        return {
            type: "circle",
            id: circle.id,
        };
    }

    return null;
}