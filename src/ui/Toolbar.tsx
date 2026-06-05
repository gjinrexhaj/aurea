import { TOOLS } from "../store/tools";
import "./Toolbar.css"

type ToolbarProps = {
    activeTool: string;
    onToolChange: (tool: string) => void;
};

export default function Toolbar({
                                    activeTool,
                                    onToolChange,
                                }: ToolbarProps) {
    return (
        <div className="toolbar">
            {TOOLS.map(tool => (
                <button
                    key={tool}
                    className={
                        activeTool === tool
                            ? "tool-button active"
                            : "tool-button"
                    }
                    onClick={() =>
                        onToolChange(tool)
                    }
                >
                    {tool}
                </button>
            ))}
        </div>
    );
}