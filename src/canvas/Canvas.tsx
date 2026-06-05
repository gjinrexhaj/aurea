import {useEffect, useState} from "react";
import type { Point } from "../geometry/Point.ts";
import "./Canvas.css"
import type {GeometryDocument} from "../geometry/GeometryDocument.ts";
import GeometrySvg from "./GeometrySvg.tsx";
import type {Circle} from "../geometry/Circle.ts";
import type {CursorPos} from "../geometry/CursorPos.ts";
import type {CompassState} from "../geometry/CompassState.ts";


type CanvasProps = {
    activeTool: string;
};


export default function Canvas({activeTool}: CanvasProps) {

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

    let previewRadius = 0;

    if (
        activeTool === "compass" &&
        compass.stage === "anchor" &&
        compass.anchor &&
        mousePos
    ) {
        const dx = mousePos.x - compass.anchor.x;
        const dy = mousePos.y - compass.anchor.y;

        previewRadius = Math.sqrt(dx * dx + dy * dy);
    }

    // track compass state, reset to idle when switched from
    useEffect(() => {
        setCompass({stage: "idle"});
    }, [activeTool]);

    function handlePointerMove(event: React.PointerEvent<HTMLDivElement>) {
        console.log("move");

        if (activeTool !== "compass") return;
        if (compass.stage !== "anchor") return;
        if (!compass.anchor) return;

        const rect =
            event.currentTarget.getBoundingClientRect();

        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        console.log(x, y);
        setMousePos({ x, y });
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

    function handlePointerDown(event: React.PointerEvent<HTMLDivElement>) {
        // calculate viewport offset
        const rect =
            event.currentTarget.getBoundingClientRect();

        // get x and y value of cursor
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        // perform action based on tool
        switch(activeTool) {
            case "point":
                return handlePointTool(x, y);
            case "compass":
                return handleCompassClick(x,y)
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
                         previewRadius={previewRadius}/>
        </div>

    );
}