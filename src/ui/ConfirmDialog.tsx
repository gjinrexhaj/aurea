import { useEffect } from 'react';
import './ConfirmDialog.css';

type ConfirmDialogProps = {
  title: string;
  message: string;
  confirmLabel: string;
  cancelLabel?: string;
  neutralLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  onNeutral?: () => void;
};

export function ConfirmDialog({
  title,
  message,
  confirmLabel,
  cancelLabel = 'Cancel',
  neutralLabel,
  onConfirm,
  onCancel,
  onNeutral,
}: ConfirmDialogProps) {
  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        onCancel();
      }
    }

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [onCancel]);

  return (
    <div className="confirm-dialog-backdrop" onClick={onCancel}>
      <div
        className="confirm-dialog"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="confirm-dialog-header">
          <strong>{title.toUpperCase()}</strong>
        </div>
        <p className="confirm-dialog-message">{message}</p>
        <div className="confirm-dialog-actions">
          <button
            type="button"
            className="confirm-dialog-close"
            onClick={onCancel}
          >
            {cancelLabel}
          </button>
          {neutralLabel && onNeutral && (
            <button
              type="button"
              className="confirm-dialog-close"
              onClick={onNeutral}
            >
              {neutralLabel}
            </button>
          )}
          <button
            type="button"
            className="confirm-dialog-confirm"
            onClick={onConfirm}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
