import type { GeometryDocument } from '../../geometry/GeometryDocument.ts';
import type { Point } from '../../geometry/Point.ts';
import type { Circle } from '../../geometry/Circle.ts';

export type ExportFormat = 'jpg' | 'png' | 'svg';
export type ExportTarget = 'canvas' | 'shape';

export type ExportElements = {
  points: boolean;
  circles: boolean;
  lines: boolean;
  axes: boolean;
  infiniteLines: boolean;
  graphite: boolean;
  ink: boolean;
  background: boolean;
};

export type ExportOptions = {
  format: ExportFormat;
  target: ExportTarget;
  elements: ExportElements;
};

type Bounds = {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
};

const DEFAULT_EXPORT_SIZE = 100;
const MAX_RASTER_SIZE = 4096;

export async function exportDocument(
  document: GeometryDocument,
  svgElement: SVGSVGElement,
  options: ExportOptions,
): Promise<void> {
  const canvasElement = svgElement.closest('.canvas');
  const backgroundColor = canvasElement
    ? window.getComputedStyle(canvasElement).backgroundColor
    : '#ffffff';
  const svg = prepareSvg(svgElement, options, backgroundColor);

  if (options.target === 'shape') {
    const bounds = getShapeBounds(document, options.elements);
    const padding = getBoundsPadding(bounds);
    const viewBox = {
      minX: bounds.minX - padding,
      minY: bounds.minY - padding,
      width: Math.max(DEFAULT_EXPORT_SIZE, bounds.maxX - bounds.minX + padding * 2),
      height: Math.max(DEFAULT_EXPORT_SIZE, bounds.maxY - bounds.minY + padding * 2),
    };

    svg.removeAttribute('width');
    svg.removeAttribute('height');
    svg.setAttribute('viewBox', `${viewBox.minX} ${viewBox.minY} ${viewBox.width} ${viewBox.height}`);
    const scene = svg.querySelector(':scope > g');
    scene?.removeAttribute('transform');
    svg.setAttribute('width', `${viewBox.width}`);
    svg.setAttribute('height', `${viewBox.height}`);
  } else {
    const dimensions = svgElement.getBoundingClientRect();
    svg.setAttribute('width', `${Math.max(1, Math.round(dimensions.width))}`);
    svg.setAttribute('height', `${Math.max(1, Math.round(dimensions.height))}`);
  }

  const svgText = new XMLSerializer().serializeToString(svg);
  const filename = `aurea-${options.target}.${options.format}`;

  if (options.format === 'svg') {
    downloadBlob(new Blob([svgText], { type: 'image/svg+xml;charset=utf-8' }), filename);
    return;
  }

  const image = await loadSvgImage(svgText);
  const dimensions = getRasterDimensions(svg, options.target);
  const canvas = window.document.createElement('canvas');
  canvas.width = dimensions.width;
  canvas.height = dimensions.height;
  const context = canvas.getContext('2d');

  if (!context) {
    throw new Error('Unable to create a canvas context for export');
  }

  if (options.format === 'jpg') {
    context.fillStyle = backgroundColor || '#ffffff';
    context.fillRect(0, 0, canvas.width, canvas.height);
  }

  context.drawImage(image, 0, 0, canvas.width, canvas.height);
  const blob = await canvasToBlob(canvas, options.format);
  downloadBlob(blob, filename);
}

function prepareSvg(
  source: SVGSVGElement,
  options: ExportOptions,
  backgroundColor: string,
): SVGSVGElement {
  const svg = source.cloneNode(true) as SVGSVGElement;
  svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');

  svg.querySelectorAll<SVGElement>('[data-export-kind]').forEach((element) => {
    const kind = element.dataset.exportKind;
    const layer = element.dataset.exportLayer;
    const shouldIncludeKind =
      kind === 'points'
        ? options.elements.points
        : kind === 'circles'
          ? options.elements.circles
          : kind === 'lines'
            ? options.elements.lines
            : kind === 'axes'
              ? options.elements.axes
              : kind === 'infiniteLines'
                ? options.elements.infiniteLines
                : true;
    const shouldIncludeLayer =
      layer === 'graphite'
        ? options.elements.graphite
        : layer === 'ink'
          ? options.elements.ink
          : true;

    if (!shouldIncludeKind || !shouldIncludeLayer) {
      element.remove();
    }
  });

  if (options.elements.background) {
    const background = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    background.setAttribute('width', '100%');
    background.setAttribute('height', '100%');
    background.setAttribute('fill', backgroundColor || '#ffffff');
    svg.insertBefore(background, svg.firstChild);
  }

  return svg;
}

function getShapeBounds(
  document: GeometryDocument,
  elements: ExportElements,
): Bounds {
  // Axes and infinite lines are intentionally excluded: both extend beyond
  // the finite geometry and must not affect the actual-shape export bounds.
  const bounds: Bounds = {
    minX: Infinity,
    maxX: -Infinity,
    minY: Infinity,
    maxY: -Infinity,
  };

  if (elements.points) {
    document.points.forEach((point) => includePoint(bounds, point));
  }

  if (elements.lines) {
    document.lines.forEach((line) => {
      const pointA = document.points.find((point) => point.id === line.pointAId);
      const pointB = document.points.find((point) => point.id === line.pointBId);
      if (pointA) includePoint(bounds, pointA);
      if (pointB) includePoint(bounds, pointB);
    });
  }

  if (elements.circles) {
    document.circles.forEach((circle) => includeCircle(bounds, document, circle));
  }

  if (!Number.isFinite(bounds.minX)) {
    return {
      minX: -DEFAULT_EXPORT_SIZE / 2,
      maxX: DEFAULT_EXPORT_SIZE / 2,
      minY: -DEFAULT_EXPORT_SIZE / 2,
      maxY: DEFAULT_EXPORT_SIZE / 2,
    };
  }

  return bounds;
}

function includePoint(bounds: Bounds, point: Point) {
  bounds.minX = Math.min(bounds.minX, point.x);
  bounds.maxX = Math.max(bounds.maxX, point.x);
  bounds.minY = Math.min(bounds.minY, point.y);
  bounds.maxY = Math.max(bounds.maxY, point.y);
}

function includeCircle(
  bounds: Bounds,
  document: GeometryDocument,
  circle: Circle,
) {
  const center = document.points.find((point) => point.id === circle.centerPointId);
  const radiusPoint = document.points.find((point) => point.id === circle.radiusPointId);
  if (!center || !radiusPoint) return;

  const radius = Math.hypot(radiusPoint.x - center.x, radiusPoint.y - center.y);
  bounds.minX = Math.min(bounds.minX, center.x - radius);
  bounds.maxX = Math.max(bounds.maxX, center.x + radius);
  bounds.minY = Math.min(bounds.minY, center.y - radius);
  bounds.maxY = Math.max(bounds.maxY, center.y + radius);
}

function getBoundsPadding(bounds: Bounds): number {
  return Math.max(10, (bounds.maxX - bounds.minX) * 0.05, (bounds.maxY - bounds.minY) * 0.05);
}

function getRasterDimensions(
  svg: SVGSVGElement,
  target: ExportTarget,
): { width: number; height: number } {
  if (target === 'canvas') {
    const width = Math.max(1, Number(svg.getAttribute('width')) || 1);
    const height = Math.max(1, Number(svg.getAttribute('height')) || 1);
    return { width, height };
  }

  const viewBox = svg.viewBox.baseVal;
  const scale = Math.min(
    MAX_RASTER_SIZE / Math.max(viewBox.width, 1),
    MAX_RASTER_SIZE / Math.max(viewBox.height, 1),
    1,
  );
  return {
    width: Math.max(1, Math.round(viewBox.width * scale)),
    height: Math.max(1, Math.round(viewBox.height * scale)),
  };
}

function loadSvgImage(svgText: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error('Unable to render SVG for export'));
    image.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgText)}`;
  });
}

function canvasToBlob(canvas: HTMLCanvasElement, format: 'jpg' | 'png'): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error('Unable to create image export'));
          return;
        }
        resolve(blob);
      },
      format === 'jpg' ? 'image/jpeg' : 'image/png',
      0.92,
    );
  });
}

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}
