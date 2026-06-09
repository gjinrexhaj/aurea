import type {GeometryLayer} from "./GeometryLayer.ts";

export type Line = {
    id: string,
    pointAId: string,
    pointBId: string,
    layer: GeometryLayer,
}