import {useEffect, useState} from "react";
import type { Point } from "../geometry/Point.ts";
import "./Canvas.css"
import type {GeometryDocument} from "../geometry/GeometryDocument.ts";
import GeometrySvg from "./GeometrySvg.tsx";
import type {Circle} from "../geometry/Circle.ts";
import type {CursorPos} from "../geometry/utils/CursorPos.ts";
import type {CompassState} from "../geometry/state/CompassState.ts";
import {findPointAt} from "../geometry/utils/HitTesting.ts";
import type {LineState} from "../geometry/state/LineState.ts";
import type {Line} from "../geometry/Line.ts";
import {getPointById} from "../geometry/utils/GetPointById.ts";


type CanvasProps = {
    activeTool: string;
};


export default function Canvas({activeTool}: CanvasProps) {

    // declare selected and hovering point ids for selection tool
    const [selectedPointId, setSelectedPointId] = useState<string | null>(null);
    const [hoveredPointId, setHoveredPointId] = useState<string | null>(null);

    // declare point dragging state
    const [draggingPointId, setDraggingPointId] = useState<string | null>(null);

    // declare geometry document
    const [document, setDocument] = useState<GeometryDocument>({
        points: [],
        circles: [],
        lines: []
    });

    // mouse position tracking state
    const [mousePos, setMousePos] = useState<CursorPos | null>(null);

    // declare compass state
    const [compass, setCompass] = useState<CompassState>({
        stage: "idle",
    })

    // declare line tool state
    const [lineState, setLineState] = useState<LineState>({});

    // declare tool resetters
    useEffect(() => {
        setCompass({ stage: "idle" });
        setLineState({});
    }, [activeTool]);



    // tool functions
    function handlePointerMove(event: React.PointerEvent<HTMLDivElement>) {
        const rect = event.currentTarget.getBoundingClientRect();

        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        // handle drag logic
        if (draggingPointId) {
            const updatedPoints =
                document.points.map(point => {
                    if (point.id === draggingPointId) {
                        return {...point, x, y};
                    }
                    return point;
                });

            setDocument({
                ...document,
                points: updatedPoints,
            });

            return;
        }


        setMousePos({ x, y });

        // hover detection
        const hoverPoint = findPointAt(x,y,document.points);

        setHoveredPointId(hoverPoint ? hoverPoint.id : null);
    }

    function handlePointerDown(event: React.PointerEvent<HTMLDivElement>) {

        event.currentTarget.setPointerCapture(event.pointerId);

        // calculate viewport offset
        const rect =
            event.currentTarget.getBoundingClientRect();

        // get x and y value of cursor
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        // perform action based on tool
        switch(activeTool) {
            case "select":
                return handleSelectTool(x, y)
            case "point":
                return handlePointTool(x, y);
            case "compass":
                return handleCompassClick(x,y)
            case "line":
                return handleLineTool(x,y)
        }
    }

    function handlePointerUp(event: React.PointerEvent<HTMLDivElement>) {

        if (event.currentTarget.hasPointerCapture(event.pointerId)) {
            event.currentTarget.releasePointerCapture(event.pointerId);
        }

        setDraggingPointId(null);
    }

    function handleSelectTool(x: number, y: number) {
        const point = findPointAt(x,y,document.points)

        if (point) {
            setSelectedPointId(point.id)
            setDraggingPointId(point.id)
        } else {
            setSelectedPointId(null)
        }

        console.log(point)
    }

    function handlePointTool(x: number, y: number) {
        // create point and add to GeometryDocument
        const point: Point = {
            id: crypto.randomUUID(),
            x,
            y,
        };
        setDocument({
            ...document,
            points: [...document.points, point],
        });
    }

    function handleCompassClick(x: number, y: number) {

        const point = findPointAt(x,y,document.points);
        if (!point) {
            return;
        }

        // first click
        if (compass.stage === "idle") {
            setCompass({ stage: "anchor", centerPointId: point.id });
            return;
        }

        // second click
        if (compass.stage === "anchor" && compass.centerPointId) {
            const centerPoint = getPointById(compass.centerPointId, document.points);

            if (!centerPoint) {
                return;
            }

            if (point.id === compass.centerPointId) {
                return;
            }


            const circle: Circle = {
                id: crypto.randomUUID(),
                centerPointId: centerPoint.id,
                radiusPointId: point.id,
            };

            setDocument({
                ...document,
                circles: [...document.circles, circle],
            });

            setCompass({ stage: "idle" });

            setMousePos(null);

        }
    }

    function handleLineTool(x: number, y: number) {
        const point = findPointAt(x,y,document.points);

        if (!point) {
            return;
        }

        // first click
        if (!lineState.firstPointId) {
            setLineState({
                firstPointId: point.id,
            });

            return;
        }

        // prevent self-line
        if (lineState.firstPointId === point.id) {
            return;
        }

        // second click
        const line: Line = {
            id: crypto.randomUUID(),
            pointAId: lineState.firstPointId,
            pointBId: point.id
        };

        setDocument({
            ...document,
            lines: [...document.lines, line],
        });

        setLineState({});

        console.log(line)
    }


    return (

        <div className="canvas"
             onPointerDown={handlePointerDown}
             onPointerMove={handlePointerMove}
             onPointerUp={handlePointerUp}
        >
            {/* Render geometry as SVG */}
            <GeometrySvg document={document}
                         compass={compass}
                         lineState={lineState}
                         mousePos={mousePos}
                         hoveredPointId={hoveredPointId}
                         selectedPointId={selectedPointId}
            />
        </div>

    );
}