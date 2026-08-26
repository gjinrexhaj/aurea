import { useEffect, useRef, useState } from 'react';
import { subscribeToLogs, type LogEntry, getLogs } from '../util/Logger';
import "./ConsolePanel.css"

// TODO: make it look prettier
// TODO: add autoscroll toggle button
// TODO: add text wrap toggle button
// TODO: add clear console button
// TODO: place on bottom of right panel on startup

export function ConsolePanel() {
  const [logs, setLogs] = useState<LogEntry[]>(getLogs());
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    return subscribeToLogs((entry) => {
      setLogs((current) => [...current, entry]);
    });
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: 'smooth',
    });
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
              className={`console-line console-${entry.level}`}
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
    </div>
  );
}
