import type {GeometryLayer} from "./GeometryLayer.ts";

export type Circle = {
    id: string,
    centerPointId: string,
    radiusPointId: string,
    layer: GeometryLayer,
}