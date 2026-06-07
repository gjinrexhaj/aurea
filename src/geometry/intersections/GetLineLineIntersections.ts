import type {GeometryDocument} from "../GeometryDocument.ts";
import {getPointById} from "../utils/GetPointById.ts";
import type {Point} from "../Point.ts";
import type {IntersectionPoint} from "./IntersectionPoint.ts";

export function getLineLineIntersections(document: GeometryDocument) {
    const intersections = [];

    for (let i = 0; i < document.lines.length; i++) {
        for (let j = i + 1; j < document.lines.length; j++) {
            const lineA = document.lines[i];
            const lineB = document.lines[j];

            const a1 = getPointById(lineA.pointAId, document.points);
            const a2 = getPointById(lineA.pointBId, document.points);

            const b1 = getPointById(lineB.pointAId, document.points);
            const b2 = getPointById(lineB.pointBId, document.points);

            if (!a1 || !a2 || !b1 || !b2) {
                continue;
            }

            const intersection =
                lineLineIntersection(a1, a2, b1, b2);

            if (intersection) {
                intersections.push(intersection);
            }
        }
    }

    return intersections;
}


export function lineLineIntersection(a1: Point, a2: Point, b1: Point, b2: Point): IntersectionPoint | null {
    const denominator = (a1.x - a2.x) * (b1.y - b2.y) - (a1.y - a2.y) * (b1.x - b2.x);

    if (Math.abs(denominator) < 0.000001) {
        return null;
    }

    const x = ((a1.x * a2.y - a1.y * a2.x) * (b1.x - b2.x) - (a1.x - a2.x) * (b1.x * b2.y - b1.y * b2.x))/denominator;
    const y = ((a1.x * a2.y - a1.y * a2.x) * (b1.y - b2.y) - (a1.y - a2.y) * (b1.x * b2.y - b1.y * b2.x))/denominator;
    const source = "line-line";

    return {x, y, source};
}