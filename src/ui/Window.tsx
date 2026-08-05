import {useRef, useState} from "react";
import type {ReactNode} from "react";
import "./Window.css";

export type WindowBounds = {
    left: number;
    top: number;
    width: number;
    height: number;
};

type ResizeDirection = "top-left" | "top-right" | "bottom-left" | "bottom-right";

type ResizeSession = {
    direction: ResizeDirection;
    startX: number;
    startY: number;
    bounds: WindowBounds;
};

type DragSession = {
    startX: number;
    startY: number;
    bounds: WindowBounds;
};

type WindowProps = {
    title: string;
    initialBounds: WindowBounds;
    children: ReactNode;
};

const MIN_WIDTH = 240;
const MIN_HEIGHT = 180;
const COLLAPSED_HEIGHT = 48;
const EDGE_PADDING = 12;

export function Window({title, initialBounds, children}: WindowProps) {
    const [bounds, setBounds] = useState<WindowBounds>(initialBounds);
    const [collapsed, setCollapsed] = useState(false);
    const resizeSession = useRef<ResizeSession | null>(null);
    const dragSession = useRef<DragSession | null>(null);

    function clampBounds(nextBounds: WindowBounds): WindowBounds {
        const maxLeft = Math.max(EDGE_PADDING, window.innerWidth - MIN_WIDTH - EDGE_PADDING);
        const maxTop = Math.max(EDGE_PADDING, window.innerHeight - COLLAPSED_HEIGHT - EDGE_PADDING);

        return {
            left: Math.min(Math.max(nextBounds.left, EDGE_PADDING), maxLeft),
            top: Math.min(Math.max(nextBounds.top, EDGE_PADDING), maxTop),
            width: Math.max(
                MIN_WIDTH,
                Math.min(nextBounds.width, window.innerWidth - EDGE_PADDING - nextBounds.left)
            ),
            height: Math.max(
                MIN_HEIGHT,
                Math.min(nextBounds.height, window.innerHeight - EDGE_PADDING - nextBounds.top)
            ),
        };
    }

    function handleToggleCollapsed(event: React.MouseEvent<HTMLButtonElement>) {
        event.preventDefault();
        event.stopPropagation();

        setCollapsed(prev => !prev);
    }

    function handleDragPointerDown(event: React.PointerEvent<HTMLDivElement>) {
        event.preventDefault();
        event.stopPropagation();
        event.currentTarget.setPointerCapture(event.pointerId);
        dragSession.current = {
            startX: event.clientX,
            startY: event.clientY,
            bounds,
        };
    }

    function handleDragPointerMove(event: React.PointerEvent<HTMLDivElement>) {
        const session = dragSession.current;
        if (!session) {
            return;
        }

        const dx = event.clientX - session.startX;
        const dy = event.clientY - session.startY;
        const nextBounds = clampBounds({
            ...session.bounds,
            left: session.bounds.left + dx,
            top: session.bounds.top + dy,
        });

        setBounds(nextBounds);
    }

    function stopDrag() {
        dragSession.current = null;
    }

    function handleResizePointerDown(direction: ResizeDirection, event: React.PointerEvent<HTMLDivElement>) {
        if (collapsed) {
            return;
        }

        event.preventDefault();
        event.stopPropagation();
        event.currentTarget.setPointerCapture(event.pointerId);
        resizeSession.current = {
            direction,
            startX: event.clientX,
            startY: event.clientY,
            bounds,
        };
    }

    function handleResizePointerMove(event: React.PointerEvent<HTMLDivElement>) {
        const session = resizeSession.current;
        if (!session) {
            return;
        }

        const dx = event.clientX - session.startX;
        const dy = event.clientY - session.startY;
        const start = session.bounds;
        const right = start.left + start.width;
        const bottom = start.top + start.height;

        let left = start.left;
        let top = start.top;
        let width: number;
        let height: number;

        if (session.direction === "top-left" || session.direction === "bottom-left") {
            const nextLeft = start.left + dx;
            left = Math.min(Math.max(nextLeft, EDGE_PADDING), right - MIN_WIDTH);
            width = right - left;
        } else {
            width = Math.min(
                Math.max(start.width + dx, MIN_WIDTH),
                window.innerWidth - EDGE_PADDING - start.left
            );
        }

        if (session.direction === "top-left" || session.direction === "top-right") {
            const nextTop = start.top + dy;
            top = Math.min(Math.max(nextTop, EDGE_PADDING), bottom - MIN_HEIGHT);
            height = bottom - top;
        } else {
            height = Math.min(
                Math.max(start.height + dy, MIN_HEIGHT),
                window.innerHeight - EDGE_PADDING - start.top
            );
        }

        setBounds({
            left,
            top,
            width,
            height,
        });
    }

    function stopResize() {
        resizeSession.current = null;
    }

    return (
        <aside
            className={collapsed ? "window-shell collapsed" : "window-shell"}
            style={{
                left: `${bounds.left}px`,
                top: `${bounds.top}px`,
                width: `${bounds.width}px`,
                height: `${collapsed ? COLLAPSED_HEIGHT : bounds.height}px`,
            }}
            onPointerDown={event => event.stopPropagation()}
            onPointerUp={event => event.stopPropagation()}
            onWheel={event => event.stopPropagation()}
            onClick={event => event.stopPropagation()}
        >
            <div
                className="window-header"
                onPointerDown={handleDragPointerDown}
                onPointerMove={handleDragPointerMove}
                onPointerUp={stopDrag}
                onPointerCancel={stopDrag}
            >
                <strong className="window-title">{title}</strong>
                <button
                    type="button"
                    className="window-toggle-button"
                    onPointerDown={event => event.stopPropagation()}
                    onClick={handleToggleCollapsed}
                >
                    {collapsed ? "Show" : "Hide"}
                </button>
            </div>

            {!collapsed && (
                <div className="window-content">{children}</div>
            )}

            {!collapsed && (
                <>
                    <div
                        className="window-resize-handle window-resize-handle-top-left"
                        onPointerDown={event => handleResizePointerDown("top-left", event)}
                        onPointerMove={handleResizePointerMove}
                        onPointerUp={stopResize}
                        onPointerCancel={stopResize}
                    />
                    <div
                        className="window-resize-handle window-resize-handle-top-right"
                        onPointerDown={event => handleResizePointerDown("top-right", event)}
                        onPointerMove={handleResizePointerMove}
                        onPointerUp={stopResize}
                        onPointerCancel={stopResize}
                    />
                    <div
                        className="window-resize-handle window-resize-handle-bottom-left"
                        onPointerDown={event => handleResizePointerDown("bottom-left", event)}
                        onPointerMove={handleResizePointerMove}
                        onPointerUp={stopResize}
                        onPointerCancel={stopResize}
                    />
                    <div
                        className="window-resize-handle window-resize-handle-bottom-right"
                        onPointerDown={event => handleResizePointerDown("bottom-right", event)}
                        onPointerMove={handleResizePointerMove}
                        onPointerUp={stopResize}
                        onPointerCancel={stopResize}
                    />
                </>
            )}
        </aside>
    );
}
