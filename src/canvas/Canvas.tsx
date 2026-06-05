import { useState } from "react";
import type { Point } from "../geometry/Point.ts";
import "./Canvas.css"


type CanvasProps = {
    activeTool: string;
};


export default function Canvas({activeTool}: CanvasProps) {

    // declare state
    const [points, setPoints] = useState<Point[]>([]);

    function handlePointerDown(event: React.PointerEvent<HTMLDivElement>) {

        if (activeTool !== "point") {
            return;
        }

        // calculate viewport offset
        const rect =
            event.currentTarget.getBoundingClientRect();

        // create point
        const point: Point = {
            id: crypto.randomUUID(),
            x: event.clientX - rect.left,
            y: event.clientY - rect.top,
        };

        console.log(point);
        // add point to state
        setPoints([...points, point]);
    }

    return (

        <div className="canvas"
             onPointerDown={handlePointerDown}
        >
            {/* Render geometry as SVG */}
            <svg width="100%" height="100%">
                {points.map(point => (
                    <circle
                        key={point.id}
                        cx={point.x}
                        cy={point.y}
                        r="2"
                    />
                ))}
            </svg>
        </div>

    );
}