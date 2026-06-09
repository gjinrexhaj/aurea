import { Tools } from "../store/Tools.ts";
import "./Toolbar.css"
import type {ViewSettings} from "./ViewSettings.ts";
import type {GeometryLayer} from "../geometry/GeometryLayer.ts";

type ToolbarProps = {
    activeTool: string;
    onToolChange: (tool: string) => void;

    viewSettings: ViewSettings;
    setViewSettings: React.Dispatch<React.SetStateAction<ViewSettings>>;

    activeLayer: GeometryLayer;
    onLayerChange: (layer: GeometryLayer) => void;
};



export function Toolbar({activeTool, onToolChange, viewSettings, setViewSettings, activeLayer, onLayerChange}: ToolbarProps) {

    return (
        <div className="toolbar">
            <div className="toolbar-tools">
                {Tools.map(tool => (
                    <button
                        key={tool}
                        className={
                            activeTool === tool
                                ? "tool-button active"
                                : "tool-button"
                        }
                        onClick={() => onToolChange(tool)}
                    >
                        {tool}
                    </button>
                ))}
            </div>
            <div className="toolbar-view">
                <label>
                    <input
                        type="checkbox"
                        checked={viewSettings.showAxes}
                        onChange={() =>
                            setViewSettings(prev => ({
                                ...prev,
                                showAxes: !prev.showAxes,
                            }))
                        }
                    />
                    Axes
                </label>
                <label>
                    <input
                        type="checkbox"
                        checked={viewSettings.showInfiniteLines}
                        onChange={() =>
                            setViewSettings(prev => ({
                                ...prev,
                                showInfiniteLines:
                                    !prev.showInfiniteLines,
                            }))
                        }
                    />
                    Infinite Lines
                </label>
            </div>
            <div className="toolbar-layer">

                <button
                    className={
                        activeLayer === "construction"
                            ? "tool-button active"
                            : "tool-button"
                    }
                    onClick={() => onLayerChange("construction")}
                >
                    graphite
                </button>

                <button
                    className={
                        activeLayer === "final"
                            ? "tool-button active"
                            : "tool-button"
                    }
                    onClick={() => onLayerChange("final")}
                >
                    ink
                </button>

            </div>
        </div>
    );
}

//
// export default function Toolbar({
//                                     activeTool,
//                                     onToolChange,
//                                 }: ToolbarProps) {
//     return (
//         <div className="toolbar">
//             {Tools.map(tool => (
//                 <button
//                     key={tool}
//                     className={
//                         activeTool === tool
//                             ? "tool-button active"
//                             : "tool-button"
//                     }
//                     onClick={() =>
//                         onToolChange(tool)
//                     }
//                 >
//                     {tool}
//                 </button>
//             ))}
//         </div>
//     );
// }