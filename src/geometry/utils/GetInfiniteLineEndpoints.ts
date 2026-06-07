import type {Point} from "../Point.ts";

const LINE_EXTENSION = 5000;

export function getInfiniteLineEndpoints(pointA: Point, pointB: Point) {
    const dx = pointB.x - pointA.x;
    const dy = pointB.y - pointA.y;

    const length = Math.sqrt(dx * dx + dy * dy);

    if (length === 0) {
        return null;
    }

    const ux = dx / length;
    const uy = dy / length;


    // calculate endpoints for lines extended LINE_EXTENSION units
    const x1 = pointA.x - ux * LINE_EXTENSION;
    const y1 = pointA.y - uy * LINE_EXTENSION;

    const x2 = pointA.x + ux * LINE_EXTENSION;
    const y2 = pointA.y + uy * LINE_EXTENSION;


    return {x1 ,y1, x2,y2};

}