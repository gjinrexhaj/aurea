import type {GeometryLayer} from "../geometry/GeometryLayer.ts";

export type CreatePointStep = {
    id: string;
    type: "point";
    x: number;
    y: number;
    layer: GeometryLayer;
};

export type CreateCircleStep = {
    id: string;
    type: "circle";
    centerPointId: string;
    radiusPointId: string;
};

export type CreateLineStep = {
    id: string;
    type: "line";
    pointAId: string;
    pointBId: string;
};

export type ConstructionStep =
    | CreatePointStep
    | CreateCircleStep
    | CreateLineStep;