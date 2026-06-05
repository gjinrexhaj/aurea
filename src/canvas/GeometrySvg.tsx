import type {GeometryDocument} from "../geometry/GeometryDocument.ts";
import type {CompassState} from "../geometry/CompassState.ts";
import type {CursorPos} from "../geometry/CursorPos.ts";

type GeometrySvgProps = {
    document: GeometryDocument;
    compass: CompassState;
    mousePos: CursorPos | null;
    previewRadius: number;
}


export default function GeometrySvg({
    document,
    compass,
    mousePos,
    previewRadius,
}: GeometrySvgProps) {

    return (
        <svg width="100%" height="100%">
            {/* display points */}
            {document.points.map(point => (
                <circle
                    key={point.id}
                    cx={point.x}
                    cy={point.y}
                    r="2"
                />
            ))}

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
        </svg>
    )

}