import type {GeometryDocument} from "../GeometryDocument.ts";
import {getPointById} from "../utils/GetPointById.ts";
import {lineLineIntersection} from "./LineLineIntersection.ts";

export function getLineIntersections(document: GeometryDocument) {
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