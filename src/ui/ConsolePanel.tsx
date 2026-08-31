import { useEffect, useRef, useState } from 'react';
import { subscribeToLogs, type LogEntry, getLogs } from '../util/Logger';
import "./ConsolePanel.css"

// TODO: add clear console button

export function ConsolePanel() {
  const [logs, setLogs] = useState<LogEntry[]>(getLogs());
  const bottomRef = useRef<HTMLDivElement>(null);
  const [wrapText, setWrapText] = useState<boolean>(false);
  const [autoscroll, setAutoscroll] = useState<boolean>(true);

  const handleTextWrapButton = () => {
    setWrapText(prevState => !prevState);
  }

  const handleAutoscrollButton = () => {
    setAutoscroll(prevState => !prevState);
  }

  const handleClearButton = () => {
    const confirmed = confirm("penis");
    if (confirmed) {
      setLogs([]);
    }
  }

  useEffect(() => {
    return subscribeToLogs((entry) => {
      setLogs((current) => [...current, entry]);
    });
  }, []);

  useEffect(() => {

    if (autoscroll) {
      bottomRef.current?.scrollIntoView({
        behavior: 'smooth',
      });
    }
  }, [logs]);

  return (
    <div className="console-panel">
      <div className="console-content">
        {logs.length === 0 ? (
          <div className="console-empty">No console output</div>
        ) : (
          logs.map((entry) => (
            <div
              key={entry.id}
              className={`console-line console-${entry.level} ${wrapText ? 'is-wrapped': ''}`}
            >
              <span className="console-time">
                {entry.timestamp.toLocaleTimeString()}
              </span>

              <span className="console-level">{entry.level.toUpperCase()}</span>

              <span className="console-source">[{entry.source}]</span>

              <span className="console-message">{entry.message}</span>

              {entry.args.length > 0 && (
                <span className="console-args">
                  {entry.args.map((arg, index) => (
                    <span key={index}>
                      {typeof arg === 'string' ? arg : JSON.stringify(arg)}
                      {index < entry.args.length - 1 && ' '}
                    </span>
                  ))}
                </span>
              )}
            </div>
          ))
        )}

        <div ref={bottomRef} />
      </div>

      <div className="console-controls">
        <div className="control-item">
          <input type={"checkbox"} checked={wrapText} onInput={handleTextWrapButton}/><label>Wrap Text</label>
        </div>
        <div className="control-item">
          <input type={"checkbox"} checked={autoscroll} onInput={handleAutoscrollButton}/><label>Autoscroll</label>
        </div>

        <div className="control-item">
          <button onClick={handleClearButton}>Clear Console</button>
        </div>
      </div>

    </div>
  );
}
