import type {GeometryDocument} from "../geometry/GeometryDocument.ts";
import type {CompassState} from "../geometry/state/CompassState.ts";
import type {CursorPos} from "../geometry/utils/CursorPos.ts";
import {getPointById} from "../geometry/utils/GetPointById.ts";
import type {LineState} from "../geometry/state/LineState.ts";

type GeometrySvgProps = {
    document: GeometryDocument;
    compass: CompassState;
    lineState: LineState;
    mousePos: CursorPos | null;
    hoveredPointId: string | null;
    selectedPointId: string | null;
}


export default function GeometrySvg({
    document,
    compass,
    lineState,
    mousePos,
    hoveredPointId,
    selectedPointId,
}: GeometrySvgProps) {

    // compass preview
    let previewRadius = 0;
    if (
        compass.stage === "anchor" &&
        compass.anchor &&
        mousePos
    ) {
        const dx = mousePos.x - compass.anchor.x;
        const dy = mousePos.y - compass.anchor.y;

        previewRadius = Math.sqrt(dx * dx + dy * dy);
    }

    // line preview
    const linePreviewStart = lineState.firstPointId ? getPointById(lineState.firstPointId, document.points) : undefined;

    return (
        <svg width="100%" height="100%">
            {/* display points */}
            {document.points.map(point => {

                const isHovered = point.id === hoveredPointId;
                const isSelected = point.id === selectedPointId;

                return (
                    <circle
                        key={point.id}
                        cx={point.x}
                        cy={point.y}
                        r={isSelected ? 6 : isHovered ? 5 : 2}
                        fill={isSelected ? "blue" : isHovered ? "orange" : "black"}
                    />
                );
            })}

            {/* display circles */}
            {document.circles.map(circle => (
                <circle
                    key={circle.id}
                    cx={circle.center.x}
                    cy={circle.center.y}
                    r={circle.radius}
                    fill="none"
                    stroke="black"
                />
            ))}

            {/* display compass preview*/}
            {compass.stage === "anchor" &&
                compass.anchor &&
                mousePos && (
                    <circle
                        cx={compass.anchor.x}
                        cy={compass.anchor.y}
                        r={previewRadius}
                        fill="none"
                        stroke="gray"
                        strokeDasharray="4"
                    />
                )}

            {/* display lines */}
            {document.lines.map(line => {
               const pointA = getPointById(line.pointAId, document.points);
               const pointB = getPointById(line.pointBId, document.points);

               if (!pointA || !pointB) {
                   return null;
               }

               return (
                   <line
                       key={line.id}
                       x1={pointA.x}
                       y1={pointA.y}
                       x2={pointB.x}
                       y2={pointB.y}
                       stroke={"black"}
                   />
               )
            })}

            {/* display line preview */}
            {linePreviewStart && mousePos && (
                <line
                    x1={linePreviewStart.x}
                    y1={linePreviewStart.y}
                    x2={mousePos.x}
                    y2={mousePos.y}
                    stroke={"gray"}
                    strokeDasharray={"4"}
                />
            )}


        </svg>
    )
}