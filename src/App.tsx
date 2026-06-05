import { useState } from "react";
import Toolbar from "./ui/Toolbar";

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

        <p>Current Tool: {activeTool}</p>
      </div>
  );
}