import type {GeometryDocument} from "../geometry/GeometryDocument.ts";
import type {CompassState} from "../geometry/state/CompassState.ts";
import type {CursorPos} from "../geometry/utils/CursorPos.ts";
import {getPointById} from "../geometry/utils/GetPointById.ts";
import type {LineState} from "../geometry/state/LineState.ts";
import {distance} from "../geometry/utils/Distance.ts";
import type {Hover} from "../geometry/state/Hover.ts";
import type {Selection} from "../geometry/state/Selection.ts";
import type {SnapResult} from "../geometry/snap/SnapResult.ts";
import {useEffect, useRef} from "react";
import {getInfiniteLineEndpoints} from "../geometry/utils/GetInfiniteLineEndpoints.ts";

type GeometrySvgProps = {
    document: GeometryDocument;
    compass: CompassState;
    lineState: LineState;
    mousePos: CursorPos | null;
    hovered: Hover;
    selection: Selection;
    snapResult: SnapResult;
    camera: {
        x: number;
        y: number;
        zoom: number;
    }
}


export default function GeometrySvg({
    document,
    compass,
    lineState,
    mousePos,
    hovered,
    selection,
    snapResult,
    camera,
}: GeometrySvgProps) {

    //useRenderCount("GeometrySvg");

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
            <g transform={`translate(${camera.x}, ${camera.y}) scale(${camera.zoom})`}>
                {/* render infinite euclidean lines */}
                {document.lines.map(line => {
                    const pointA = getPointById(line.pointAId, document.points);
                    const pointB = getPointById(line.pointBId, document.points);

                    if (!pointA || !pointB) {
                        return null;
                    }

                    const infinite = getInfiniteLineEndpoints(pointA, pointB);
                    if (!infinite) {
                        return null;
                    }

                    return (
                        <g key={line.id}>
                            {/* infinite euclidean line */}
                            <line
                                x1={infinite.x1}
                                y1={infinite.y1}
                                x2={infinite.x2}
                                y2={infinite.y2}
                                stroke={"lightgray"}
                            />
                        </g>
                    )
                })}

                {/* display circles */}
                {document.circles.map(circle => {
                    const centerPoint = getPointById(circle.centerPointId, document.points);
                    const radiusPoint = getPointById(circle.radiusPointId, document.points);

                    if (!centerPoint || !radiusPoint) {
                        return null;
                    }

                    const isHovered = hovered?.type === "circle" && hovered.id === circle.id;
                    const isSelected = selection?.type === "circle" && selection.id === circle.id;

                    const radius = distance(centerPoint, radiusPoint);

                    return (
                        <circle
                            key={circle.id}
                            cx={centerPoint.x}
                            cy={centerPoint.y}
                            r={radius}
                            fill="none"
                            stroke={isSelected ? "blue" : isHovered ? "orange" : "black"}
                        />
                    );
                })}

                {/* render line segments */}
                {document.lines.map(line => {
                    const pointA = getPointById(line.pointAId, document.points);
                    const pointB = getPointById(line.pointBId, document.points);

                    if (!pointA || !pointB) {
                        return null;
                    }

                    const isHovered = hovered?.type === "line" && hovered.id === line.id;
                    const isSelected = selection?.type === "line" && selection.id === line.id;

                    return (
                        <g key={line.id}>
                            {/* defining segment */}
                            <line
                                x1={pointA.x}
                                y1={pointA.y}
                                x2={pointB.x}
                                y2={pointB.y}
                                stroke={isSelected ? "blue" : isHovered ? "orange" : "black"}
                                strokeWidth={isSelected ? 2 : 1}
                            />
                        </g>
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

                {/* display snap indicator */}
                {snapResult?.type === "intersection" && (
                    <>
                        <line
                            x1={snapResult.x - 6}
                            y1={snapResult.y}
                            x2={snapResult.x + 6}
                            y2={snapResult.y}
                            stroke="red"
                        />
                        <line
                            x1={snapResult.x}
                            y1={snapResult.y - 6}
                            x2={snapResult.x}
                            y2={snapResult.y + 6}
                            stroke="red"
                        />
                    </>
                )}

                {/* display points */}
                {document.points.map(point => {

                    const isHovered = hovered?.type === "point" && hovered.id === point.id;
                    const isSelected = selection?.type === "point" && selection.id === point.id;

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
            </g>

        </svg>
    )
}

// helper profiling function
const useRenderCount = (componentName = 'Component') => {
    const renders = useRef(0);
    useEffect(() => {
        renders.current += 1;
        console.log(`${componentName} rendered ${renders.current} times`);
    });
};