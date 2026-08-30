import type {GeometryLayer} from "../geometry/GeometryLayer.ts";

export type RgbaColor = {
    r: number;
    g: number;
    b: number;
    a: number;
};

export type LayeredColor = {
    graphite: RgbaColor;
    ink: RgbaColor;
};

export type GeometryColors = {
    point: LayeredColor;
    circle: LayeredColor;
    line: LayeredColor;
    axes: RgbaColor;
    infiniteLines: RgbaColor;
};

export const defaultGeometryColors: GeometryColors = {
    point: {
        graphite: {r: 150, g: 150, b: 150, a: 1},
        ink: {r: 0, g: 0, b: 0, a: 1},
    },
    circle: {
        graphite: {r: 211, g: 211, b: 211, a: 1},
        ink: {r: 0, g: 0, b: 0, a: 1},
    },
    line: {
        graphite: {r: 211, g: 211, b: 211, a: 1},
        ink: {r: 0, g: 0, b: 0, a: 1},
    },
    axes: {r: 0, g: 123, b: 255, a: 1},
    infiniteLines: {r: 211, g: 211, b: 211, a: 1},
};

export function rgbaToCss(color: RgbaColor): string {
    return `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a})`;
}

export function colorForLayeredValue(value: LayeredColor, layer: GeometryLayer): RgbaColor {
    return layer === "construction" ? value.graphite : value.ink;
}
