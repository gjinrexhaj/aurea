import { useState } from "react";
import Toolbar from "./ui/Toolbar";
import Canvas from "./canvas/Canvas.tsx";

export default function App() {
  // declare state
  const [activeTool, setActiveTool] =
      useState("select");

  // render component
  return (
      <div>
        <Toolbar
            activeTool={activeTool}
            onToolChange={setActiveTool}
        />

        <Canvas
            activeTool={activeTool}
        />

      </div>
  );
}