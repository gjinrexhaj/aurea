import type {GeometryDocument} from "../geometry/GeometryDocument.ts";
import type {CompassState} from "../geometry/state/CompassState.ts";
import type {CursorPos} from "../geometry/utils/CursorPos.ts";
import {getPointById} from "../geometry/utils/GetPointById.ts";
import type {LineState} from "../geometry/state/LineState.ts";
import {distance} from "../geometry/utils/Distance.ts";
import type {Hover} from "../geometry/state/Hover.ts";
import type {Selection} from "../geometry/state/Selection.ts";
import type {SnapResult} from "../geometry/snap/SnapResult.ts";
// import {useEffect, useRef} from "react";
import {getInfiniteLineEndpoints} from "../geometry/utils/GetInfiniteLineEndpoints.ts";
import type {ViewSettings} from "../ui/ViewSettings.ts";
import type {HistoryHighlight} from "../construction/historyUtils.ts";
import type {GeometryColors} from "../ui/GeometryColors.ts";
import {colorForLayeredValue, rgbaToCss} from "../ui/GeometryColors.ts";

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
    };
    viewSettings: ViewSettings;
    colors: GeometryColors;
    historyHighlight: HistoryHighlight | null;
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
    viewSettings,
    colors,
    historyHighlight,
}: GeometrySvgProps) {

    // console.log(document.circles)
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
                {/* render axes */}
                {viewSettings.showAxes && (
                    <g>
                        {/* X axis */}
                        <line
                            x1={-100000}
                            y1={0}
                            x2={100000}
                            y2={0}
                            stroke={rgbaToCss(colors.axes)}
                            strokeWidth={1}
                        />

                        {/* Y axis */}
                        <line
                            x1={0}
                            y1={-100000}
                            x2={0}
                            y2={100000}
                            stroke={rgbaToCss(colors.axes)}
                            strokeWidth={1}
                        />

                        {/* Origin marker */}
                        <circle
                            cx={0}
                            cy={0}
                            r={3}
                            fill={rgbaToCss(colors.axes)}
                        />
                    </g>
                )}


                {/* render infinite euclidean lines */}
                {viewSettings.showInfiniteLines && document.lines.map(line => {
                    const pointA = getPointById(line.pointAId, document.points);
                    const pointB = getPointById(line.pointBId, document.points);

                    if (!pointA || !pointB) {
                        return null;
                    }

                    const infinite = getInfiniteLineEndpoints(pointA, pointB);
                    if (!infinite) {
                        return null;
                    }

                    const isHistoryHighlighted = historyHighlight?.lineIds.includes(line.id);
                    return (
                        <g key={line.id}>
                            {/* infinite euclidean line */}
                            <line
                                x1={infinite.x1}
                                y1={infinite.y1}
                                x2={infinite.x2}
                                y2={infinite.y2}
                                stroke={isHistoryHighlighted ? "red" : rgbaToCss(colors.infiniteLines)}
                                strokeWidth={isHistoryHighlighted ? 2 : 1}
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
                    const isHistoryHighlighted = historyHighlight?.circleIds.includes(circle.id);

                    const radius = distance(centerPoint, radiusPoint);

                    const defaultCircleStroke = rgbaToCss(
                        colorForLayeredValue(colors.circle, circle.layer)
                    );

                    return (
                        <circle
                            key={circle.id}
                            cx={centerPoint.x}
                            cy={centerPoint.y}
                            r={radius}
                            fill="none"
                            stroke={
                                isHistoryHighlighted
                                    ? "red"
                                    : isSelected
                                        ? "blue"
                                        : isHovered
                                            ? "orange"
                                            : defaultCircleStroke
                            }
                            strokeWidth={isHistoryHighlighted || isSelected ? 2 : 1}
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
                    const isHistoryHighlighted = historyHighlight?.lineIds.includes(line.id);


                    const defaultLineStroke = rgbaToCss(
                        colorForLayeredValue(colors.line, line.layer)
                    );

                    return (
                        <g key={line.id}>
                            {/* defining segment */}
                            <line
                                x1={pointA.x}
                                y1={pointA.y}
                                x2={pointB.x}
                                y2={pointB.y}
                                stroke={
                                    isHistoryHighlighted
                                        ? "red"
                                        : isSelected
                                            ? "blue"
                                            : isHovered
                                                ? "orange"
                                                : defaultLineStroke
                                }
                                strokeWidth={isHistoryHighlighted || isSelected ? 2 : 1}
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
                    <g className="snap-indicator intersection">
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
                    </g>
                )}

                {snapResult?.type === "point" && (
                    <circle
                        cx={snapResult.x}
                        cy={snapResult.y}
                        r={6}
                        fill="none"
                        stroke="red"
                        strokeWidth={1.5}
                        className="snap-indicator point"
                    />
                )}

                {/* display points */}
                {document.points.map(point => {
                    const isHovered = hovered?.type === "point" && hovered.id === point.id;
                    const isSelected = selection?.type === "point" && selection.id === point.id;
                    const isHistoryHighlighted = historyHighlight?.pointIds.includes(point.id);

                    return (
                        <circle
                            key={point.id}
                            cx={point.x}
                            cy={point.y}
                            r={isHistoryHighlighted ? 3 : isSelected ? 3 : isHovered ? 2 : 2}
                            fill={
                                isHistoryHighlighted
                                    ? "red"
                                    : isSelected
                                        ? "blue"
                                        : isHovered
                                            ? "orange"
                                            : rgbaToCss(colorForLayeredValue(colors.point, point.layer))
                            }
                        />
                    );
                })}
            </g>

        </svg>
    )
}
//
// // helper profiling function
// const useRenderCount = (componentName = 'Component') => {
//     const renders = useRef(0);
//     useEffect(() => {
//         renders.current += 1;
//         console.log(`${componentName} rendered ${renders.current} times`);
//     });
// };