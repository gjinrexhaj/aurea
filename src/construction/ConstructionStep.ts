export type CreatePointStep = {
    id: string;
    type: "point";
    x: number;
    y: number;
};

export type CreateCircleStep = {
    id: string;
    type: "circle";
    centerPointId: string;
    radius: number;
};

export type ConstructionStep =
    | CreatePointStep
    | CreateCircleStep;