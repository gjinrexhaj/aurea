import type { HistoryStep } from '../construction/HistoryStep.ts';
import { describeHistoryStep } from '../construction/historyUtils.ts';
import './HistoryPanel.css';
import { useEffect, useRef } from 'react';

type HistoryPanelProps = {
  history: HistoryStep[];
  selectedHistoryId: string | null;
  onSelectHistoryId: (historyId: string | null) => void;
  onUndo: () => void;
  hideSubsequentSteps: boolean;
  onHideSubsequentStepsChange: (hide: boolean) => void;
};

export function HistoryPanel({
  history,
  selectedHistoryId,
  onSelectHistoryId,
  onUndo,
  hideSubsequentSteps,
  onHideSubsequentStepsChange,
}: HistoryPanelProps) {
  const bottomRef = useRef<HTMLLIElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const selectedIndex = history.findIndex(
    (step) => step.id === selectedHistoryId,
  );
  const isPreviewing = hideSubsequentSteps && selectedIndex >= 0;

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
    });
  }, [history]);

  useEffect(() => {
    if (!selectedHistoryId) {
      return;
    }

    listRef.current
      ?.querySelector('.history-item.active')
      ?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, [selectedHistoryId]);

  function handleListKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    const isPrevious = event.key === 'ArrowLeft' || event.key === 'ArrowUp';
    const isNext = event.key === 'ArrowRight' || event.key === 'ArrowDown';

    if (!isPrevious && !isNext) {
      return;
    }

    event.preventDefault();

    const nextIndex = isPrevious
      ? selectedIndex < 0
        ? history.length - 1
        : Math.max(0, selectedIndex - 1)
      : selectedIndex < 0
        ? 0
        : Math.min(history.length - 1, selectedIndex + 1);

    const nextStep = history[nextIndex];
    if (nextStep) {
      onSelectHistoryId(nextStep.id);
    }
  }

  function getItemClassName(step: HistoryStep, index: number) {
    if (step.id === selectedHistoryId) {
      return 'history-item active';
    }

    if (isPreviewing && index < selectedIndex) {
      return 'history-item prior';
    }

    return 'history-item';
  }

  return (
    <div className="history-panel-wrapper">
      <div className="history-panel-body">
        <div
          className="history-list-scroll"
          ref={listRef}
          onKeyDown={handleListKeyDown}
        >
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
                    className={getItemClassName(step, index)}
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

      <label
        className={`history-floating-toggle${
          selectedHistoryId === null ? ' disabled' : ''
        }`}
      >
        <input
          type="checkbox"
          checked={hideSubsequentSteps}
          disabled={selectedHistoryId === null}
          onChange={(event) =>
            onHideSubsequentStepsChange(event.target.checked)
          }
        />
        <span>Playback mode</span>
      </label>
    </div>
  );
}
