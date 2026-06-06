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



// compute line distances
export function distancePointToSegment(px: number, py: number, ax: number, ay: number, bx: number, by: number,
) {
    const abx = bx - ax;
    const aby = by - ay;

    const apx = px - ax;
    const apy = py - ay;

    const abLenSq = abx * abx + aby * aby;

    let t = 0;

    if (abLenSq !== 0) {
        t = (apx * abx + apy * aby) / abLenSq;
    }

    t = Math.max(0, Math.min(1, t));

    const closestX = ax + t * abx;
    const closestY = ay + t * aby;

    return distance(
        { x: px, y: py },
        { x: closestX, y: closestY },
    );
}