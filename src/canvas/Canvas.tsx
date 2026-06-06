import {useState} from "react";
import type { Point } from "../geometry/Point.ts";
import "./Canvas.css"
import type {GeometryDocument} from "../geometry/GeometryDocument.ts";
import GeometrySvg from "./GeometrySvg.tsx";
import type {Circle} from "../geometry/Circle.ts";
import type {CursorPos} from "../geometry/utils/CursorPos.ts";
import type {CompassState} from "../geometry/utils/CompassState.ts";
import {findPointAt} from "../geometry/utils/HitTesting.ts";


type CanvasProps = {
    activeTool: string;
};


export default function Canvas({activeTool}: CanvasProps) {

    // declare selected and hovering point ids for selection tool
    const [selectedPointId, setSelectedPointId] = useState<string | null>(null);
    const [hoveredPointId, setHoveredPointId] = useState<string | null>(null);

    // declare geometry document
    const [document, setDocument] = useState<GeometryDocument>({
        points: [],
        circles: []
    });

    // mouse position tracking state
    const [mousePos, setMousePos] = useState<CursorPos | null>(null);

    // declare compass state
    const [compass, setCompass] = useState<CompassState>({
        stage: "idle",
    })

    function handlePointerMove(event: React.PointerEvent<HTMLDivElement>) {
        const rect = event.currentTarget.getBoundingClientRect();

        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        setMousePos({ x, y });

        // hover detection
        const hoverPoint = findPointAt(x,y,document.points);

        setHoveredPointId(hoverPoint ? hoverPoint.id : null);
    }

    function handlePointerDown(event: React.PointerEvent<HTMLDivElement>) {
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
        }
    }

    function handleSelectTool(x: number, y: number) {
        const point = findPointAt(x,y,document.points)

        if (point) {
            setSelectedPointId(point.id)
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
        console.log(document)

        // first click
        if (compass.stage === "idle") {
            const anchor: Point = {
                id: crypto.randomUUID(),
                x,
                y,
            };

            setCompass({
                stage: "anchor",
                anchor,
            });

            return;
        }

        // second click
        if (compass.stage === "anchor" && compass.anchor) {

            const dx = x - compass.anchor.x;
            const dy = y - compass.anchor.y;

            const r = Math.sqrt(dx * dx + dy * dy);

            const centerPoint: Point = {
                id: crypto.randomUUID(),
                x: compass.anchor.x,
                y: compass.anchor.y
            };

            const circle: Circle = {
                id: crypto.randomUUID(),
                center: centerPoint,
                radius: r

            };

            setDocument({
                ...document,
                circles: [...document.circles, circle],
            });

            // reset compass
            setCompass({ stage: "idle" });
            setMousePos(null);
        }
    }


    return (

        <div className="canvas"
             onPointerDown={handlePointerDown}
             onPointerMove={handlePointerMove}
        >
            {/* Render geometry as SVG */}
            <GeometrySvg document={document}
                         compass={compass}
                         mousePos={mousePos}
                         hoveredPointId={hoveredPointId}
                         selectedPointId={selectedPointId}
            />
        </div>

    );
}