type Position = {
    x: number;
    y: number;
};

export function distance(
    pointA: Position,
    pointB: Position,
): number {
    const dx = pointB.x - pointA.x;
    const dy = pointB.y - pointA.y;

    return Math.sqrt(dx * dx + dy * dy);
}