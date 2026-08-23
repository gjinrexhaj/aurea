import {useCallback, useEffect, useRef, useState} from "react";
import type {Point} from "../geometry/Point.ts";
import "./Canvas.css";
import type {GeometryDocument} from "../geometry/GeometryDocument.ts";
import GeometrySvg from "./GeometrySvg.tsx";
import type {Circle} from "../geometry/Circle.ts";
import type {CursorPos} from "../geometry/utils/CursorPos.ts";
import type {CompassState} from "../geometry/state/CompassState.ts";
import {findPointAt, pickAt} from "../geometry/utils/HitTesting.ts";
import type {LineState} from "../geometry/state/LineState.ts";
import type {Line} from "../geometry/Line.ts";
import {getPointById} from "../geometry/utils/GetPointById.ts";
import type {Selection} from "../geometry/state/Selection.ts";
import type {Hover} from "../geometry/state/Hover.ts";
import {snapAt} from "../geometry/snap/SnapEngine.ts";
import type {SnapResult} from "../geometry/snap/SnapResult.ts";
import type {ViewSettings} from "../ui/ViewSettings.ts";
import type {GeometryLayer} from "../geometry/GeometryLayer.ts";
import type {HistoryStep} from "../construction/HistoryStep.ts";
import {getHistoryHighlight, undoHistoryStep} from "../construction/historyUtils.ts";
import type {GeometryColors} from "../ui/GeometryColors.ts";

type CanvasProps = {
    activeTool: string;
    viewSettings: ViewSettings;
    activeLayer: GeometryLayer;
    colors: GeometryColors;
    history?: HistoryStep[];
    onHistoryChange?: (history: HistoryStep[]) => void;
    selectedHistoryId?: string | null;
    onSelectHistoryId?: (id: string | null) => void;
    onRegisterUndo?: (undoFn: () => void) => void;
};

export default function Canvas({
    activeTool,
    viewSettings,
    activeLayer,
    colors,
    history: externalHistory,
    onHistoryChange,
    selectedHistoryId: externalSelectedHistoryId,
    onSelectHistoryId,
    onRegisterUndo,
}: CanvasProps) {
    const [camera, setCamera] = useState({
        x: window.innerWidth / 2,
        y: window.innerHeight / 2,
        zoom: 1,
    });
    const [isPanning, setIsPanning] = useState(false);
    const lastPanPosition = useRef({x: 0, y: 0});

    const [snapResult, setSnapResult] = useState<SnapResult>(null);
    const [selection, setSelection] = useState<Selection>(null);
    const [hovered, setHovered] = useState<Hover>(null);
    const [document, setDocument] = useState<GeometryDocument>({
        points: [],
        circles: [],
        lines: [],
    });
    const [mousePos, setMousePos] = useState<CursorPos | null>(null);
    const [compass, setCompass] = useState<CompassState>({
        stage: "idle",
    });
    const [lineState, setLineState] = useState<LineState>({});
    const [internalHistory, setInternalHistory] = useState<HistoryStep[]>([]);
    const [internalSelectedHistoryId, setInternalSelectedHistoryId] = useState<string | null>(null);

    const history = externalHistory !== undefined ? externalHistory : internalHistory;
    const selectedHistoryId =
        externalSelectedHistoryId !== undefined
            ? externalSelectedHistoryId
            : internalSelectedHistoryId;

    const setHistory = useCallback(
        (action: React.SetStateAction<HistoryStep[]>) => {
            if (onHistoryChange) {
                if (typeof action === "function") {
                    setInternalHistory(prev => {
                        const next = action(prev);
                        onHistoryChange(next);
                        return next;
                    });
                } else {
                    setInternalHistory(action);
                    onHistoryChange(action);
                }
            } else {
                setInternalHistory(action);
            }
        },
        [onHistoryChange]
    );

    const setSelectedHistoryId = useCallback(
        (id: string | null) => {
            if (onSelectHistoryId) {
                onSelectHistoryId(id);
            } else {
                setInternalSelectedHistoryId(id);
            }
        },
        [onSelectHistoryId]
    );

    const selectedHistoryStep =
        history.find(step => step.id === selectedHistoryId) ?? null;
    const historyHighlight = getHistoryHighlight(selectedHistoryStep);

    useEffect(() => {
        const timeoutId = window.setTimeout(() => {
            setCompass({stage: "idle"});
            setLineState({});
        }, 0);

        return () => window.clearTimeout(timeoutId);
    }, [activeTool]);

    const handleDeleteSelection = useCallback(() => {
        if (!selection) {
            return;
        }

        if (selection.type === "point") {
            const pointId = selection.id;
            const deletedPoints = document.points.filter(point => point.id === pointId);
            const deletedLines = document.lines.filter(
                line => line.pointAId === pointId || line.pointBId === pointId
            );
            const deletedCircles = document.circles.filter(
                circle => circle.centerPointId === pointId || circle.radiusPointId === pointId
            );

            setDocument(prev => ({
                points: prev.points.filter(point => point.id !== pointId),
                lines: prev.lines.filter(
                    line => line.pointAId !== pointId && line.pointBId !== pointId
                ),
                circles: prev.circles.filter(
                    circle =>
                        circle.centerPointId !== pointId && circle.radiusPointId !== pointId
                ),
            }));
            setHistory(prev => [
                ...prev,
                {
                    id: crypto.randomUUID(),
                    type: "delete",
                    deleted: {
                        points: deletedPoints,
                        lines: deletedLines,
                        circles: deletedCircles,
                    },
                },
            ]);
        }

        if (selection.type === "line") {
            const lineId = selection.id;
            const deletedLines = document.lines.filter(line => line.id === lineId);

            setDocument(prev => ({
                ...prev,
                lines: prev.lines.filter(line => line.id !== lineId),
            }));
            setHistory(prev => [
                ...prev,
                {
                    id: crypto.randomUUID(),
                    type: "delete",
                    deleted: {
                        points: [],
                        circles: [],
                        lines: deletedLines,
                    },
                },
            ]);
        }

        if (selection.type === "circle") {
            const circleId = selection.id;
            const deletedCircles = document.circles.filter(circle => circle.id === circleId);

            setDocument(prev => ({
                ...prev,
                circles: prev.circles.filter(circle => circle.id !== circleId),
            }));
            setHistory(prev => [
                ...prev,
                {
                    id: crypto.randomUUID(),
                    type: "delete",
                    deleted: {
                        points: [],
                        circles: deletedCircles,
                        lines: [],
                    },
                },
            ]);
        }

        setSelection(null);
    }, [document.circles, document.lines, document.points, selection, setHistory]);

    const handleUndo = useCallback(() => {
        const lastStep = history[history.length - 1];
        if (!lastStep) {
            return;
        }

        setDocument(prev => undoHistoryStep(prev, lastStep));
        setHistory(prev => prev.slice(0, -1));
        setSelection(null);

        if (selectedHistoryId === lastStep.id) {
            setSelectedHistoryId(null);
        }
    }, [history, selectedHistoryId, setHistory, setSelectedHistoryId]);

    useEffect(() => {
        onRegisterUndo?.(handleUndo);
    }, [handleUndo, onRegisterUndo]);

    useEffect(() => {
        function onKeyDown(e: KeyboardEvent) {
            if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "z") {
                e.preventDefault();
                handleUndo();
                return;
            }

            if (e.key === "Backspace" || e.key === "Delete") {
                e.preventDefault();
                handleDeleteSelection();
            }
        }

        window.addEventListener("keydown", onKeyDown);
        return () => window.removeEventListener("keydown", onKeyDown);
    }, [handleDeleteSelection, handleUndo]);

    function handlePointerMove(event: React.PointerEvent<HTMLDivElement>) {
        if (isPanning && lastPanPosition.current) {
            const dx = event.clientX - lastPanPosition.current.x;
            const dy = event.clientY - lastPanPosition.current.y;

            setCamera(prev => ({
                ...prev,
                x: prev.x + dx,
                y: prev.y + dy,
            }));

            lastPanPosition.current = {x: event.clientX, y: event.clientY};
            return;
        }

        const rect = event.currentTarget.getBoundingClientRect();
        const screenX = event.clientX - rect.left;
        const screenY = event.clientY - rect.top;
        const {x, y} = screenToWorld(screenX, screenY, camera);

        setSnapResult(snapAt(x, y, document));
        setMousePos({x, y});
        setHovered(pickAt(x, y, document));
    }

    function handlePointerDown(event: React.PointerEvent<HTMLDivElement>) {
        if (event.button === 1) {
            setIsPanning(true);
            lastPanPosition.current = {x: event.clientX, y: event.clientY};
            event.currentTarget.setPointerCapture(event.pointerId);
            return;
        }

        event.currentTarget.setPointerCapture(event.pointerId);

        const rect = event.currentTarget.getBoundingClientRect();
        const screenX = event.clientX - rect.left;
        const screenY = event.clientY - rect.top;
        const {x, y} = screenToWorld(screenX, screenY, camera);

        switch (activeTool) {
            case "select":
                return handleSelectTool(x, y);
            case "point":
                return handlePointTool(x, y);
            case "compass":
                return handleCompassClick(x, y);
            case "line":
                return handleLineTool(x, y);
        }
    }

    function handlePointerUp(event: React.PointerEvent<HTMLDivElement>) {
        if (event.button === 1) {
            setIsPanning(false);
        }

        if (event.currentTarget.hasPointerCapture(event.pointerId)) {
            event.currentTarget.releasePointerCapture(event.pointerId);
        }
    }

    function handleSelectTool(x: number, y: number) {
        setSelection(pickAt(x, y, document));
    }

    function handlePointTool(x: number, y: number) {
        const snap = snapAt(x, y, document);
        if (snap?.type === "intersection") {
            x = snap.x;
            y = snap.y;
        }

        const point: Point = {
            id: crypto.randomUUID(),
            x,
            y,
            layer: activeLayer,
        };

        setDocument(prev => ({
            ...prev,
            points: [...prev.points, point],
        }));
        setHistory(prev => [
            ...prev,
            {
                id: point.id,
                type: "create",
                step: {
                    id: point.id,
                    type: "point",
                    x: point.x,
                    y: point.y,
                    layer: point.layer,
                },
            },
        ]);
    }

    function handleCompassClick(x: number, y: number) {
        const point = findPointAt(x, y, document.points);
        if (!point) {
            return;
        }

        if (compass.stage === "idle") {
            setCompass({stage: "anchor", centerPointId: point.id});
            return;
        }

        if (compass.stage === "anchor" && compass.centerPointId) {
            const centerPoint = getPointById(compass.centerPointId, document.points);
            if (!centerPoint || point.id === compass.centerPointId) {
                return;
            }

            const circle: Circle = {
                id: crypto.randomUUID(),
                centerPointId: centerPoint.id,
                radiusPointId: point.id,
                layer: activeLayer,
            };

            setDocument(prev => ({
                ...prev,
                circles: [...prev.circles, circle],
            }));
            setHistory(prev => [
                ...prev,
                {
                    id: circle.id,
                    type: "create",
                    step: {
                        id: circle.id,
                        type: "circle",
                        centerPointId: circle.centerPointId,
                        radiusPointId: circle.radiusPointId,
                    },
                },
            ]);

            setCompass({stage: "idle"});
            setMousePos(null);
        }
    }

    function handleLineTool(x: number, y: number) {
        const point = findPointAt(x, y, document.points);
        if (!point) {
            return;
        }

        if (!lineState.firstPointId) {
            setLineState({
                firstPointId: point.id,
            });
            return;
        }

        if (lineState.firstPointId === point.id) {
            return;
        }

        const line: Line = {
            id: crypto.randomUUID(),
            pointAId: lineState.firstPointId,
            pointBId: point.id,
            layer: activeLayer,
        };

        setDocument(prev => ({
            ...prev,
            lines: [...prev.lines, line],
        }));
        setHistory(prev => [
            ...prev,
            {
                id: line.id,
                type: "create",
                step: {
                    id: line.id,
                    type: "line",
                    pointAId: line.pointAId,
                    pointBId: line.pointBId,
                },
            },
        ]);
        setLineState({});
    }

    function screenToWorld(x: number, y: number, currentCamera: {x: number; y: number; zoom: number}) {
        return {
            x: (x - currentCamera.x) / currentCamera.zoom,
            y: (y - currentCamera.y) / currentCamera.zoom,
        };
    }

    function handleScrollWheel(e: React.WheelEvent<HTMLDivElement>) {
        e.preventDefault();

        const scaleFactor = 1.1;
        const direction = e.deltaY > 0 ? 1 / scaleFactor : scaleFactor;
        const rect = e.currentTarget.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        const worldBefore = screenToWorld(mouseX, mouseY, camera);

        setCamera(prev => {
            const newZoom = Math.max(0.1, Math.min(10, prev.zoom * direction));

            return {
                zoom: newZoom,
                x: mouseX - worldBefore.x * newZoom,
                y: mouseY - worldBefore.y * newZoom,
            };
        });
    }

    function handleContextMenu(e: React.MouseEvent<HTMLDivElement>) {
        e.preventDefault();

        setCompass({stage: "idle"});
        setLineState({});
    }

    return (
        <div
            className="canvas"
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onWheel={handleScrollWheel}
            onContextMenu={handleContextMenu}
        >
            <GeometrySvg
                document={document}
                compass={compass}
                lineState={lineState}
                mousePos={mousePos}
                hovered={hovered}
                selection={selection}
                snapResult={snapResult}
                camera={camera}
                viewSettings={viewSettings}
                colors={colors}
                historyHighlight={historyHighlight}
            />
        </div>
    );
}
