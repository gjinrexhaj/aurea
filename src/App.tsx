import { useState } from "react";
import Canvas from "./canvas/Canvas.tsx";
import "./App.css"
import type {ViewSettings} from "./ui/ViewSettings.ts";
import {Toolbar} from "./ui/Toolbar.tsx";
import type {GeometryLayer} from "./geometry/GeometryLayer.ts";

export default function App() {

    // declare state
    const [activeTool, setActiveTool] = useState("select");
    const [viewSettings, setViewSettings] =
        useState<ViewSettings>({
            showAxes: true,
            showGrid: false,
            showInfiniteLines: true,
        });
    const [activeLayer, setActiveLayer] = useState<GeometryLayer>("construction")

    // render component
    return (
        <div className="app">
            <div className="toolbar-outer">
                <Toolbar
                    activeTool={activeTool}
                    onToolChange={setActiveTool}
                    viewSettings={viewSettings}
                    setViewSettings={setViewSettings}
                    activeLayer={activeLayer}
                    onLayerChange={setActiveLayer}
                />
            </div>

            <div className="canvas-outer">
                <Canvas
                    activeTool={activeTool}
                    viewSettings={viewSettings}
                    activeLayer={activeLayer}
                />
            </div>
        </div>
  );
}