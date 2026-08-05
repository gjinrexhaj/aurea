import type { HistoryStep } from "../construction/HistoryStep.ts";
import { describeHistoryStep } from "../construction/historyUtils.ts";
import "./HistoryPanel.css";

type HistoryPanelProps = {
    history: HistoryStep[];
    selectedHistoryId: string | null;
    onSelectHistoryId: (historyId: string | null) => void;
    onUndo: () => void;
};

export function HistoryPanel({
    history,
    selectedHistoryId,
    onSelectHistoryId,
    onUndo,
}: HistoryPanelProps) {
    return (
        <aside
            className="history-panel"
            onPointerDown={event => event.stopPropagation()}
            onPointerUp={event => event.stopPropagation()}
            onClick={event => event.stopPropagation()}
        >
            <div className="history-panel-header">
                <strong>History</strong>
                <button
                    type="button"
                    className="history-undo-button"
                    onClick={onUndo}
                    disabled={history.length === 0}
                >
                    Undo
                </button>
            </div>

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
        </aside>
    );
}
