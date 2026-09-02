import type { HistoryStep } from '../construction/HistoryStep.ts';
import { describeHistoryStep } from '../construction/historyUtils.ts';
import './HistoryPanel.css';
import { useEffect, useRef } from 'react';

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
  const bottomRef = useRef<HTMLLIElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
    });
  }, [history]);

  return (
    <div className="history-panel-wrapper">
      <div className="history-panel-body">
        <div className="history-list-scroll">
          <ol className="history-list">
            {history.length === 0 ? (
              <li className="history-empty">No construction steps yet</li>
            ) : (
              history.map((step, index) => (
                <li
                  key={step.id}
                  ref={index === history.length - 1 ? bottomRef : undefined}
                >
                  <button
                    type="button"
                    className={
                      selectedHistoryId === step.id
                        ? 'history-item active'
                        : 'history-item'
                    }
                    onClick={() =>
                      onSelectHistoryId(
                        selectedHistoryId === step.id ? null : step.id,
                      )
                    }
                  >
                    {describeHistoryStep(step)}
                  </button>
                </li>
              ))
            )}
          </ol>
        </div>

        <button
          type="button"
          className="history-undo-button history-undo-button-footer"
          onClick={onUndo}
          disabled={history.length === 0}
        >
          Undo
        </button>
      </div>
    </div>
  );
}
