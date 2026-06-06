import type { Point } from "./Point";

export function getPointById(
    id: string,
    points: Point[],
): Point | undefined {
    return points.find(
        point => point.id === id
    );
}