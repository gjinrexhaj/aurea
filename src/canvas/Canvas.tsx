import {useEffect, useState} from "react";
import type { Point } from "../geometry/Point.ts";
import "./Canvas.css"
import type {GeometryDocument} from "../geometry/GeometryDocument.ts";
import GeometrySvg from "./GeometrySvg.tsx";
import type {Circle} from "../geometry/Circle.ts";
import type {CursorPos} from "../geometry/utils/CursorPos.ts";
import type {CompassState} from "../geometry/state/CompassState.ts";
import {findCircleAt, findLineAt, findPointAt, pickAt} from "../geometry/utils/HitTesting.ts";
import type {LineState} from "../geometry/state/LineState.ts";
import type {Line} from "../geometry/Line.ts";
import {getPointById} from "../geometry/utils/GetPointById.ts";
import type {Selection} from "../geometry/state/Selection.ts";
import type {Hover} from "../geometry/state/Hover.ts";
import {snapAt} from "../geometry/snap/SnapEngine.ts";
import type {SnapResult} from "../geometry/snap/SnapResult.ts";


type CanvasProps = {
    activeTool: string;
};


export default function Canvas({activeTool}: CanvasProps) {

    // declare snap state
    const [snapResult, setSnapResult] = useState<SnapResult>(null);

    // declare selected and hovering point ids for selection tool
    const [selection, setSelection] = useState<Selection>(null);
    const [hovered, setHovered] = useState<Hover>(null);

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

    // declare deletion keybind
    useEffect(() => {
        function onKeyDown(e: KeyboardEvent) {
            if (e.key === "Backspace" || e.key === "Delete") {
                handleDeleteSelection();
            }
        }
        window.addEventListener("keydown", onKeyDown);
        return () => window.removeEventListener("keydown", onKeyDown);
    }, [selection]);


    // tool functions
    function handlePointerMove(event: React.PointerEvent<HTMLDivElement>) {
        const rect = event.currentTarget.getBoundingClientRect();

        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        // snapping
        const snap = snapAt(x,y,document);
        setSnapResult(snap);


        // drag logic
        if (draggingPointId) {
            setDocument(prev => ({
                ...prev,
                points: prev.points.map(point => point.id === draggingPointId ? { ...point, x, y } : point),
            }));

            return;
        }

        setMousePos({ x, y });

        const hit = pickAt(x, y, document);
        setHovered(hit);
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
            case "select": {
                return handleSelectTool(x, y);
            }
            case "point": {
                return handlePointTool(x, y);
            }
            case "compass": {
                return handleCompassClick(x,y);
            }
            case "line": {
                return handleLineTool(x,y);
            }
        }
    }

    function handlePointerUp(event: React.PointerEvent<HTMLDivElement>) {

        if (event.currentTarget.hasPointerCapture(event.pointerId)) {
            event.currentTarget.releasePointerCapture(event.pointerId);
        }

        setDraggingPointId(null);
    }

    function handleSelectTool(x: number, y: number) {
        const hit = pickAt(x, y, document);

        setSelection(hit);

        // dragging is only allowed for points
        if (hit?.type === "point") {
            setDraggingPointId(hit.id);
        } else {
            setDraggingPointId(null);
        }

        console.log(hit)
    }

    function handlePointTool(x: number, y: number) {
        const snap = snapAt(x, y, document);

        if (snap?.type === "intersection") {
            x = snap.x;
            y = snap.y;
        }

        const point: Point = {
            id: crypto.randomUUID(), x: x, y: y
        }

        setDocument({
            ...document,
            points: [...document.points, point]
        });


        // // create point and add to GeometryDocument
        // const point: Point = {
        //     id: crypto.randomUUID(),
        //     x,
        //     y,
        // };
        // setDocument({
        //     ...document,
        //     points: [...document.points, point],
        // });
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

    function handleDeleteSelection() {
        if (!selection) {
            return;
        }

        // point deletion deletes all dependent geometry
        // line and circle deletion only deletes the line and circle in question
        switch (selection.type) {
            case "point": {
                const pointId = selection.id;

                setDocument(prev =>({
                    ...prev,
                    points: prev.points.filter(p => p.id !== pointId),
                    lines: prev.lines.filter(l => l.pointAId !== pointId && l.pointBId),
                    circles: prev.circles.filter(c => c.centerPointId !== pointId && pointId)
                }));

                break;
            }
            case "line": {
                setDocument(prev => ({
                    ...prev,
                    lines: prev.lines.filter(l => l.id !== selection.id)
                }));

                break;
            }
            case "circle": {
                setDocument(prev => ({
                    ...prev,
                    circles: prev.circles.filter(c => c.id !== selection.id)
                }));

                break;
            }
        }

        setSelection(null)
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
                         hovered={hovered}
                         selection={selection}
                         snapResult={snapResult}
            />
        </div>

    );
}