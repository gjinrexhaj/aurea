import type { GeometryDocument } from '../../geometry/GeometryDocument.ts';
import type { HistoryStep } from '../../construction/HistoryStep.ts';
import type { GeometryColors } from '../../ui/GeometryColors.ts';
import type { IJsonModel } from 'flexlayout-react';

const DEFAULT_DOCUMENT_NAME = 'aurea-document';
const LOCAL_STORAGE_KEY = 'aurea:current-document';
const CAMERA_STORAGE_KEY = 'aurea:camera';
const APPEARANCE_STORAGE_KEY = 'aurea:appearance';
const LAYOUT_STORAGE_KEY = 'aurea:layout';

export type CameraState = {
  x: number;
  y: number;
  zoom: number;
};

export type AppearanceState = {
  isDarkMode: boolean;
  colors: GeometryColors;
};

export type PersistedDocument = {
  document: GeometryDocument;
  history: HistoryStep[];
};

export function saveDocumentToLocalStorage(
  document: GeometryDocument,
  history: HistoryStep[],
): void {
  try {
    window.localStorage.setItem(
      LOCAL_STORAGE_KEY,
      JSON.stringify({ document, history }),
    );
  } catch (error) {
    console.error('Unable to save document to local storage', error);
  }
}

export function loadDocumentFromLocalStorage(): PersistedDocument | null {
  try {
    const data = window.localStorage.getItem(LOCAL_STORAGE_KEY);
    return data ? parseDocument(data) : null;
  } catch (error) {
    console.error('Unable to load document from local storage', error);
    return null;
  }
}

export function saveCameraToLocalStorage(camera: CameraState): void {
  try {
    window.localStorage.setItem(CAMERA_STORAGE_KEY, JSON.stringify(camera));
  } catch (error) {
    console.error('Unable to save camera to local storage', error);
  }
}

export function loadCameraFromLocalStorage(): CameraState | null {
  try {
    const data = window.localStorage.getItem(CAMERA_STORAGE_KEY);
    if (!data) {
      return null;
    }

    const parsed: unknown = JSON.parse(data);
    if (!isCameraState(parsed)) {
      throw new Error('Stored camera state is invalid');
    }

    return parsed;
  } catch (error) {
    console.error('Unable to load camera from local storage', error);
    return null;
  }
}

export function saveAppearanceToLocalStorage(appearance: AppearanceState): void {
  try {
    window.localStorage.setItem(
      APPEARANCE_STORAGE_KEY,
      JSON.stringify(appearance),
    );
  } catch (error) {
    console.error('Unable to save appearance to local storage', error);
  }
}

export function loadAppearanceFromLocalStorage(): AppearanceState | null {
  try {
    const data = window.localStorage.getItem(APPEARANCE_STORAGE_KEY);
    if (!data) {
      return null;
    }

    const parsed: unknown = JSON.parse(data);
    if (!isAppearanceState(parsed)) {
      throw new Error('Stored appearance state is invalid');
    }

    return parsed;
  } catch (error) {
    console.error('Unable to load appearance from local storage', error);
    return null;
  }
}

export function saveLayoutToLocalStorage(layout: IJsonModel): void {
  try {
    window.localStorage.setItem(LAYOUT_STORAGE_KEY, JSON.stringify(layout));
  } catch (error) {
    console.error('Unable to save layout to local storage', error);
  }
}

export function loadLayoutFromLocalStorage(): IJsonModel | null {
  try {
    const data = window.localStorage.getItem(LAYOUT_STORAGE_KEY);
    if (!data) {
      return null;
    }

    const parsed: unknown = JSON.parse(data);
    if (!isLayoutModel(parsed)) {
      throw new Error('Stored layout is invalid');
    }

    return parsed;
  } catch (error) {
    console.error('Unable to load layout from local storage', error);
    return null;
  }
}

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

function isCameraState(value: unknown): value is CameraState {
  return (
    isRecord(value) &&
    typeof value.x === 'number' &&
    Number.isFinite(value.x) &&
    typeof value.y === 'number' &&
    Number.isFinite(value.y) &&
    typeof value.zoom === 'number' &&
    Number.isFinite(value.zoom) &&
    value.zoom > 0
  );
}

function isAppearanceState(value: unknown): value is AppearanceState {
  return (
    isRecord(value) &&
    typeof value.isDarkMode === 'boolean' &&
    isGeometryColors(value.colors)
  );
}

function isLayoutModel(value: unknown): value is IJsonModel {
  return (
    isRecord(value) &&
    isRecord(value.global) &&
    Array.isArray(value.borders) &&
    isRecord(value.layout)
  );
}

function isGeometryColors(value: unknown): value is GeometryColors {
  if (!isRecord(value)) {
    return false;
  }

  return (
    isLayeredColor(value.point) &&
    isLayeredColor(value.circle) &&
    isLayeredColor(value.line) &&
    isRgbaColor(value.axes) &&
    isRgbaColor(value.infiniteLines)
  );
}

function isLayeredColor(value: unknown): boolean {
  return isRecord(value) && isRgbaColor(value.graphite) && isRgbaColor(value.ink);
}

function isRgbaColor(value: unknown): boolean {
  return (
    isRecord(value) &&
    isFiniteColorChannel(value.r) &&
    isFiniteColorChannel(value.g) &&
    isFiniteColorChannel(value.b) &&
    isFiniteColorChannel(value.a)
  );
}

function isFiniteColorChannel(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value);
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
