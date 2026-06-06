import type {GeometryDocument} from "../geometry/GeometryDocument.ts";
import type {CompassState} from "../geometry/state/CompassState.ts";
import type {CursorPos} from "../geometry/utils/CursorPos.ts";
import {getPointById} from "../geometry/utils/GetPointById.ts";
import type {LineState} from "../geometry/state/LineState.ts";
import {distance} from "../geometry/utils/Distance.ts";

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

    const compassCenter = compass.centerPointId ? getPointById(compass.centerPointId, document.points) : undefined;

    if (compass.stage === "anchor" && compassCenter && mousePos)  {
        previewRadius = distance(compassCenter, mousePos);
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
            {document.circles.map(circle => {
                const centerPoint = getPointById(circle.centerPointId, document.points);
                const radiusPoint = getPointById(circle.radiusPointId, document.points);

                if (!centerPoint || !radiusPoint) {
                    return null;
                }

                const radius = distance(centerPoint, radiusPoint);

                return (
                    <circle
                        key={circle.id}
                        cx={centerPoint.x}
                        cy={centerPoint.y}
                        r={radius}
                        fill="none"
                        stroke="black"
                    />
                );
            })}

            {/* display compass preview*/}
            {compass.stage === "anchor" &&
                compassCenter &&
                mousePos && (
                    <circle
                        cx={compassCenter.x}
                        cy={compassCenter.y}
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