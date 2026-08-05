import {useState} from "react";
import type {ViewSettings} from "../ui/ViewSettings.ts";
import type {GeometryLayer} from "../geometry/GeometryLayer.ts";
import {Toolbar} from "../ui/Toolbar.tsx";
import Canvas from "../canvas/Canvas.tsx";
import {ColorsPanel} from "../ui/ColorsPanel.tsx";
import {defaultGeometryColors} from "../ui/GeometryColors.ts";
import "./EditorPage.css"

export default function EditorPage() {

    // declare state
    const [activeTool, setActiveTool] = useState("select");
    const [viewSettings, setViewSettings] =
        useState<ViewSettings>({
            showAxes: true,
            showGrid: false,
            showInfiniteLines: false,
        });
    const [activeLayer, setActiveLayer] = useState<GeometryLayer>("construction")
    const [colors, setColors] = useState(defaultGeometryColors);

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
                    colors={colors}
                />
            </div>

            <ColorsPanel
                colors={colors}
                setColors={setColors}
            />
        </div>
    );
}