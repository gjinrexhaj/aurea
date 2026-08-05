import type {GeometryLayer} from "./GeometryLayer.ts";

export type Point = {
    id: string,
    x: number;
    y: number;
    layer: GeometryLayer;
}