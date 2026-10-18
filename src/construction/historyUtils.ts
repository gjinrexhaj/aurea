import type { GeometryDocument } from '../geometry/GeometryDocument.ts';
import type { HistoryStep } from './HistoryStep.ts';
import { logger } from '../util/Logger.ts';

export type HistoryHighlight = {
  pointIds: string[];
  circleIds: string[];
  lineIds: string[];
};

export function describeHistoryStep(step: HistoryStep): string {
  if (step.type === 'create') {
    switch (step.step.type) {
      case 'point':
        return 'Created point';
      case 'circle':
        return 'Created circle';
      case 'line':
        return 'Created line';
    }
  }

  const pointCount = step.deleted.points.length;
  const circleCount = step.deleted.circles.length;
  const lineCount = step.deleted.lines.length;
  const parts = [
    pointCount ? `${pointCount} point${pointCount === 1 ? '' : 's'}` : null,
    circleCount ? `${circleCount} circle${circleCount === 1 ? '' : 's'}` : null,
    lineCount ? `${lineCount} line${lineCount === 1 ? '' : 's'}` : null,
  ].filter(Boolean);

  return parts.length > 0 ? `Deleted ${parts.join(', ')}` : 'Deleted geometry';
}

export function getHistoryHighlight(
  step: HistoryStep | null,
): HistoryHighlight | null {
  if (!step || step.type !== 'create') {
    return null;
  }

  switch (step.step.type) {
    case 'point':
      return {
        pointIds: [step.step.id],
        circleIds: [],
        lineIds: [],
      };
    case 'circle':
      return {
        pointIds: [],
        circleIds: [step.step.id],
        lineIds: [],
      };
    case 'line':
      return {
        pointIds: [],
        circleIds: [],
        lineIds: [step.step.id],
      };
  }
}

export type EntityIds = {
  pointIds: Set<string>;
  circleIds: Set<string>;
  lineIds: Set<string>;
};

export function getEntityIdsUpToStep(
  history: HistoryStep[],
  stepIndex: number,
): EntityIds {
  const ids: EntityIds = {
    pointIds: new Set(),
    circleIds: new Set(),
    lineIds: new Set(),
  };

  for (const step of history.slice(0, stepIndex + 1)) {
    if (step.type === 'create') {
      switch (step.step.type) {
        case 'point':
          ids.pointIds.add(step.step.id);
          break;
        case 'circle':
          ids.circleIds.add(step.step.id);
          break;
        case 'line':
          ids.lineIds.add(step.step.id);
          break;
      }
      continue;
    }

    for (const point of step.deleted.points) {
      ids.pointIds.delete(point.id);
    }
    for (const circle of step.deleted.circles) {
      ids.circleIds.delete(circle.id);
    }
    for (const line of step.deleted.lines) {
      ids.lineIds.delete(line.id);
    }
  }

  return ids;
}

export function filterDocumentByEntityIds(
  document: GeometryDocument,
  ids: EntityIds,
): GeometryDocument {
  return {
    points: document.points.filter((point) => ids.pointIds.has(point.id)),
    circles: document.circles.filter((circle) => ids.circleIds.has(circle.id)),
    lines: document.lines.filter((line) => ids.lineIds.has(line.id)),
  };
}

export function undoHistoryStep(
  document: GeometryDocument,
  step: HistoryStep,
): GeometryDocument {
  logger.history('Undo', step.type, 'step');

  if (step.type === 'create') {
    switch (step.step.type) {
      case 'point':
        return {
          ...document,
          points: document.points.filter((point) => point.id !== step.step.id),
        };
      case 'circle':
        return {
          ...document,
          circles: document.circles.filter(
            (circle) => circle.id !== step.step.id,
          ),
        };
      case 'line':
        return {
          ...document,
          lines: document.lines.filter((line) => line.id !== step.step.id),
        };
    }
  }

  return {
    points: [...document.points, ...step.deleted.points],
    circles: [...document.circles, ...step.deleted.circles],
    lines: [...document.lines, ...step.deleted.lines],
  };
}
