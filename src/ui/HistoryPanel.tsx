import type {HistoryStep} from "../construction/HistoryStep.ts";
import {describeHistoryStep} from "../construction/historyUtils.ts";
import {Window} from "./Window.tsx";
import "./HistoryPanel.css";

type HistoryPanelProps = {
    history: HistoryStep[];
    selectedHistoryId: string | null;
    onSelectHistoryId: (historyId: string | null) => void;
    onUndo: () => void;
};

const MIN_WIDTH = 240;
const EDGE_PADDING = 12;

function getInitialBounds() {
    const width = MIN_WIDTH;
    const height = 280;

    return {
        left: Math.max(EDGE_PADDING, window.innerWidth - width - EDGE_PADDING),
        top: EDGE_PADDING,
        width,
        height,
    };
}

export function HistoryPanel({
    history,
    selectedHistoryId,
    onSelectHistoryId,
    onUndo,
}: HistoryPanelProps) {
    return (
        <Window title="History" initialBounds={getInitialBounds()}>
            <div className="history-panel-body">
                <ol className="history-list">
                    {history.map(step => (
                        <li key={step.id}>
                            <button
                                type="button"
                                className={
                                    selectedHistoryId === step.id
                                        ? "history-item active"
                                        : "history-item"
                                }
                                onClick={() =>
                                    onSelectHistoryId(
                                        selectedHistoryId === step.id ? null : step.id
                                    )
                                }
                            >
                                {describeHistoryStep(step)}
                            </button>
                        </li>
                    ))}
                </ol>

                <button
                    type="button"
                    className="history-undo-button history-undo-button-footer"
                    onClick={onUndo}
                    disabled={history.length === 0}
                >
                    Undo
                </button>
            </div>
        </Window>
    );
}
