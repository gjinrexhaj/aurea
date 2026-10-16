import type { GeometryDocument } from '../../geometry/GeometryDocument.ts';
import type { HistoryStep } from '../../construction/HistoryStep.ts';

const DEFAULT_DOCUMENT_NAME = 'aurea-document';

export type PersistedDocument = {
  document: GeometryDocument;
  history: HistoryStep[];
};

export function saveDocument(
  document: GeometryDocument,
  history: HistoryStep[],
  fileName = DEFAULT_DOCUMENT_NAME,
): void {
  const data = JSON.stringify({ document, history }, null, 2);
  const blob = new Blob([data], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const anchor = window.document.createElement('a');
  const normalizedName = fileName.trim() || DEFAULT_DOCUMENT_NAME;
  const downloadName = normalizedName.toLowerCase().endsWith('.json')
    ? normalizedName
    : `${normalizedName}.json`;

  anchor.href = url;
  anchor.download = downloadName;
  anchor.click();
  URL.revokeObjectURL(url);
}

export function loadDocument(): Promise<PersistedDocument | null> {
  return new Promise((resolve, reject) => {
    const input = window.document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json,.json';

    input.addEventListener('change', async () => {
      const file = input.files?.[0];
      if (!file) {
        resolve(null);
        return;
      }

      try {
        const text = await file.text();
        resolve(parseDocument(text));
      } catch (error) {
        reject(error instanceof Error ? error : new Error('Unable to load document'));
      }
    });
    input.addEventListener('cancel', () => resolve(null));

    input.click();
  });
}

function parseDocument(data: string): PersistedDocument {
  let parsed: unknown;

  try {
    parsed = JSON.parse(data);
  } catch {
    throw new Error('The selected file is not valid JSON');
  }

  if (isGeometryDocument(parsed)) {
    return { document: parsed, history: [] };
  }

  if (!isPersistedDocument(parsed)) {
    throw new Error('The selected file is not a valid geometry document');
  }

  return parsed;
}

function isPersistedDocument(value: unknown): value is PersistedDocument {
  return (
    isRecord(value) &&
    isGeometryDocument(value.document) &&
    Array.isArray(value.history) &&
    value.history.every(isHistoryStep)
  );
}

function isGeometryDocument(value: unknown): value is GeometryDocument {
  if (!isRecord(value)) {
    return false;
  }

  return (
    Array.isArray(value.points) &&
    value.points.every(isPoint) &&
    Array.isArray(value.lines) &&
    value.lines.every(isLine) &&
    Array.isArray(value.circles) &&
    value.circles.every(isCircle)
  );
}

function isPoint(value: unknown): boolean {
  return (
    isRecord(value) &&
    typeof value.id === 'string' &&
    typeof value.x === 'number' &&
    Number.isFinite(value.x) &&
    typeof value.y === 'number' &&
    Number.isFinite(value.y) &&
    isLayer(value.layer)
  );
}

function isLine(value: unknown): boolean {
  return (
    isRecord(value) &&
    typeof value.id === 'string' &&
    typeof value.pointAId === 'string' &&
    typeof value.pointBId === 'string' &&
    isLayer(value.layer)
  );
}

function isCircle(value: unknown): boolean {
  return (
    isRecord(value) &&
    typeof value.id === 'string' &&
    typeof value.centerPointId === 'string' &&
    typeof value.radiusPointId === 'string' &&
    isLayer(value.layer)
  );
}

function isHistoryStep(value: unknown): value is HistoryStep {
  if (!isRecord(value) || typeof value.id !== 'string') {
    return false;
  }

  if (value.type === 'create') {
    return isCreateStep(value.step);
  }

  if (value.type === 'delete' && isRecord(value.deleted)) {
    return (
      Array.isArray(value.deleted.points) &&
      value.deleted.points.every(isPoint) &&
      Array.isArray(value.deleted.lines) &&
      value.deleted.lines.every(isLine) &&
      Array.isArray(value.deleted.circles) &&
      value.deleted.circles.every(isCircle)
    );
  }

  return false;
}

function isCreateStep(value: unknown): boolean {
  if (!isRecord(value) || typeof value.id !== 'string' || typeof value.type !== 'string') {
    return false;
  }

  if (value.type === 'point') {
    return (
      typeof value.x === 'number' &&
      Number.isFinite(value.x) &&
      typeof value.y === 'number' &&
      Number.isFinite(value.y) &&
      isLayer(value.layer)
    );
  }

  if (value.type === 'circle') {
    return (
      typeof value.centerPointId === 'string' &&
      typeof value.radiusPointId === 'string'
    );
  }

  return (
    value.type === 'line' &&
    typeof value.pointAId === 'string' &&
    typeof value.pointBId === 'string'
  );
}

function isLayer(value: unknown): value is 'construction' | 'final' {
  return value === 'construction' || value === 'final';
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}
