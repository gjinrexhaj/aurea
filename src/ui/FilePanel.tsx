import './FilePanel.css'
import { createPortal } from 'react-dom';
import { useEffect, useRef, useState } from 'react';
import { useDocument } from '../context/DocumentContext.tsx';
import { ConfirmDialog } from './ConfirmDialog.tsx';
import type { HistoryStep } from '../construction/HistoryStep.ts';
import {
    exportDocument,
    type ExportElements,
    type ExportFormat,
    type ExportTarget,
} from '../services/export/exportDocument.ts';
import {
    loadDocument,
    saveDocument,
} from '../services/persistence/documentPersistence.ts';

type FilePanelProps = {
    history: HistoryStep[];
    onHistoryChange: (history: HistoryStep[]) => void;
    onHistorySelectionChange: (historyId: string | null) => void;
};

export function FilePanel({
    history,
    onHistoryChange,
    onHistorySelectionChange,
}: FilePanelProps) {
    const { document: geomDocument, setDocument } = useDocument();
    const [exportFormat, setExportFormat] = useState<ExportFormat>('png');
    const [exportTarget, setExportTarget] = useState<ExportTarget>('canvas');
    const [exportElements, setExportElements] = useState<ExportElements>({
        points: true,
        circles: true,
        lines: true,
        axes: true,
        infiniteLines: false,
        graphite: true,
        ink: true,
        background: false,
    });
    const [isExporting, setIsExporting] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [showNewConfirm, setShowNewConfirm] = useState(false);
    const [showSaveDialog, setShowSaveDialog] = useState(false);
    const [saveFileName, setSaveFileName] = useState('aurea-document');
    const [showDocumentContent, setShowDocumentContent] = useState(false);
    const [documentAutoscroll, setDocumentAutoscroll] = useState(true);
    const documentContentRef = useRef<HTMLPreElement>(null);
    const documentJson = JSON.stringify(geomDocument, null, 2);
    const documentJsonLines = documentJson.split('\n');
    const lastCreatedId = history.at(-1)?.type === 'create' ? history.at(-1)?.id : null;
    const highlightedLines = new Set<number>();
    const modalRoot =
        document.querySelector<HTMLElement>('.app') ?? document.body;

    if (lastCreatedId) {
        const idLine = documentJsonLines.findIndex((line) =>
            line.includes(`"id": "${lastCreatedId}"`),
        );

        if (idLine >= 0) {
            let startLine = idLine;
            while (startLine > 0 && !documentJsonLines[startLine].trim().startsWith('{')) {
                startLine -= 1;
            }

            let endLine = idLine;
            while (
                endLine < documentJsonLines.length - 1 &&
                !/^\s*},?\s*$/.test(documentJsonLines[endLine])
            ) {
                endLine += 1;
            }

            for (let line = startLine; line <= endLine; line += 1) {
                highlightedLines.add(line);
            }
        }
    }

    useEffect(() => {
        if (!documentAutoscroll || !showDocumentContent || !documentContentRef.current) {
            return;
        }

        const lastHistoryStep = history[history.length - 1];
        if (lastHistoryStep?.type !== 'create') {
            return;
        }

        const targetIndex = documentJson.indexOf(`"id": "${lastHistoryStep.id}"`);
        if (targetIndex < 0) {
            return;
        }

        const targetLine = documentJson.slice(0, targetIndex).split('\n').length - 1;
        const lineCount = documentJsonLines.length;
        const lineHeight = documentContentRef.current.scrollHeight / lineCount;
        const targetOffset = targetLine * lineHeight - documentContentRef.current.clientHeight / 2;

        documentContentRef.current.scrollTo({
            top: Math.max(0, targetOffset),
            behavior: 'smooth',
        });
    }, [documentAutoscroll, documentJson, history, showDocumentContent]);

    const handleExport = async () => {
        const svg = document.querySelector<SVGSVGElement>('.canvas svg');
        if (!svg) {
            console.error('Unable to export: canvas SVG was not found');
            return;
        }

        setIsExporting(true);
        try {
            await exportDocument(geomDocument, svg, {
                format: exportFormat,
                target: exportTarget,
                elements: exportElements,
            });
        } catch (error) {
            console.error('Unable to export document', error);
        } finally {
            setIsExporting(false);
        }
    };

    const handleSave = () => {
        saveDocument(geomDocument, history, saveFileName);
        setShowSaveDialog(false);
    };

    const handleLoad = async () => {
        setIsLoading(true);
        try {
            const loadedDocument = await loadDocument();
            if (loadedDocument) {
                setDocument(loadedDocument.document);
                onHistoryChange(loadedDocument.history);
                onHistorySelectionChange(null);
            }
        } catch (error) {
            console.error('Unable to load document', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="file-panel-wrapper">
            <div className="file-panel">
                <section className="file-section file-summary">
                    <div className="file-section-header">
                        <strong>Document</strong>
                        <button
                            className="file-view-content-button"
                            type="button"
                            aria-expanded={showDocumentContent}
                            onClick={() => setShowDocumentContent((visible) => !visible)}
                        >
                            {showDocumentContent ? 'Hide content' : 'View content'}
                        </button>
                    </div>
                    {showDocumentContent ? (
                        <div className="file-document-content-wrap">
                            <pre className="file-document-content" ref={documentContentRef}>
                                {documentJsonLines.map((line, index) => (
                                    <span
                                        className={
                                            highlightedLines.has(index)
                                                ? 'file-document-line is-highlighted'
                                                : 'file-document-line'
                                        }
                                        key={`${index}-${line}`}
                                    >
                                        {line}
                                        {index < documentJsonLines.length - 1 ? '\n' : ''}
                                    </span>
                                ))}
                            </pre>
                            <label className="file-document-autoscroll">
                                <input
                                    type="checkbox"
                                    checked={documentAutoscroll}
                                    onChange={(event) => setDocumentAutoscroll(event.target.checked)}
                                />
                                <span>Autoscroll</span>
                            </label>
                        </div>
                    ) : (
                        <div className="file-stat-grid">
                            <div className="file-stat">
                                <span className="file-stat-value">{geomDocument.points.length}</span>
                                <span className="file-stat-label">Points</span>
                            </div>
                            <div className="file-stat">
                                <span className="file-stat-value">{geomDocument.lines.length}</span>
                                <span className="file-stat-label">Lines</span>
                            </div>
                            <div className="file-stat">
                                <span className="file-stat-value">{geomDocument.circles.length}</span>
                                <span className="file-stat-label">Circles</span>
                            </div>
                        </div>
                    )}
                </section>

                <section className="file-section">
                    <div className="file-section-header">
                        <strong>File actions</strong>
                    </div>
                    <div className="file-actions">
                        <button className="file-button" type="button" onClick={() => setShowNewConfirm(true)}>
                            New
                        </button>
                        <button className="file-button" type="button" onClick={() => setShowSaveDialog(true)}>
                            Save
                        </button>
                        <button className="file-button" type="button" disabled={isLoading} onClick={() => void handleLoad()}>
                            Load
                        </button>
                    </div>
                </section>

                <section className="file-section file-export-card">
                    <div className="file-section-header">
                        <strong>Export</strong>
                    </div>
                    <div className="file-export-target">
                        <div className="file-target-switch" role="group" aria-label="Export target">
                            <button
                                className={`file-target-option${exportTarget === 'canvas' ? ' is-active' : ''}`}
                                type="button"
                                aria-pressed={exportTarget === 'canvas'}
                                onClick={() => setExportTarget('canvas')}
                            >
                                Canvas window
                            </button>
                            <button
                                className={`file-target-option${exportTarget === 'shape' ? ' is-active' : ''}`}
                                type="button"
                                aria-pressed={exportTarget === 'shape'}
                                onClick={() => setExportTarget('shape')}
                            >
                                Actual shape
                            </button>
                        </div>
                    </div>
                    <div className="file-export-target">
                        <div className="file-target-switch file-format-switch" role="group" aria-label="Export format">
                            {(['jpg', 'png', 'svg'] as const).map((format) => (
                                <button
                                    className={`file-target-option${exportFormat === format ? ' is-active' : ''}`}
                                    type="button"
                                    aria-pressed={exportFormat === format}
                                    onClick={() => setExportFormat(format)}
                                    key={format}
                                >
                                    {format.toUpperCase()}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="file-export-elements">
                        {(['points', 'circles', 'lines', 'axes', 'infiniteLines', 'graphite', 'ink', 'background'] as const).map((element) => (
                            <label className="file-checkbox-label" key={element}>
                                <input
                                    type="checkbox"
                                    checked={exportElements[element]}
                                    onChange={(event) =>
                                        setExportElements((current) => ({
                                            ...current,
                                            [element]: event.target.checked,
                                        }))
                                    }
                                />
                                <span>
                                    {element === 'infiniteLines'
                                        ? 'Infinite lines'
                                        : element.charAt(0).toUpperCase() + element.slice(1)}
                                </span>
                            </label>
                        ))}
                    </div>
                    <button
                        className="file-button file-export-button"
                        type="button"
                        disabled={isExporting}
                        onClick={() => void handleExport()}
                    >
                        Export {exportTarget === 'canvas' ? 'canvas' : 'shape'} as {exportFormat.toUpperCase()}
                    </button>
                </section>
            </div>
            {showSaveDialog && (
                createPortal(
                    <div className="file-dialog-backdrop" onClick={() => setShowSaveDialog(false)}>
                        <form
                            className="file-dialog"
                            onClick={(event) => event.stopPropagation()}
                            onKeyDown={(event) => event.stopPropagation()}
                            onSubmit={(event) => {
                                event.preventDefault();
                                handleSave();
                            }}
                        >
                            <div className="file-dialog-header">
                                <strong>Save document</strong>
                            </div>
                            <label className="file-dialog-field">
                                <span>File name</span>
                                <input
                                    autoFocus
                                    type="text"
                                    value={saveFileName}
                                    onChange={(event) => setSaveFileName(event.target.value)}
                                    placeholder="aurea-document"
                                />
                            </label>
                            <div className="file-dialog-actions">
                                <button
                                    className="file-dialog-cancel"
                                    type="button"
                                    onClick={() => setShowSaveDialog(false)}
                                >
                                    Cancel
                                </button>
                                <button className="file-dialog-save" type="submit">
                                    Save JSON
                                </button>
                            </div>
                        </form>
                    </div>,
                    modalRoot,
                )
            )}
            {showNewConfirm && (
                <ConfirmDialog
                    title="Create new document?"
                    message="This will clear all points, lines, and circles from the current geometry document."
                    cancelLabel="Cancel"
                    confirmLabel="Create new"
                    onCancel={() => setShowNewConfirm(false)}
                    onConfirm={() => {
                        setDocument({ points: [], lines: [], circles: [] });
                        onHistoryChange([]);
                        onHistorySelectionChange(null);
                        setShowNewConfirm(false);
                    }}
                />
            )}
        </div>
    )
}