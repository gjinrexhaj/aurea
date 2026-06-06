import type { Point } from "./Point"

const HIT_RADIUS = 10;

export function findPointAt(
    x: number,
    y: number,
    points: Point[],
): Point | undefined {
    return points.find(point => {
       const dx = x - point.x;
       const dy = y - point.y;

       const distance = Math.sqrt(dx * dx + dy * dy);

       return distance <= HIT_RADIUS;
    });
}