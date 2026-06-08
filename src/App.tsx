import { useState } from "react";
import Toolbar from "./ui/Toolbar";
import Canvas from "./canvas/Canvas.tsx";
import "./App.css"

export default function App() {

    // declare state
    const [activeTool, setActiveTool] =
      useState("select");

    // render component
    return (
        <div className="app">
            <div className="toolbar-outer">
                <Toolbar
                    activeTool={activeTool}
                    onToolChange={setActiveTool}
                />
            </div>

            <div className="canvas-outer">
                <Canvas
                    activeTool={activeTool}
                />
            </div>
        </div>
  );
}