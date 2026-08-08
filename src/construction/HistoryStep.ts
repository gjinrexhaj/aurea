import type { Point } from "../geometry/Point.ts";
import type { Circle } from "../geometry/Circle.ts";
import type { Line } from "../geometry/Line.ts";
import type { ConstructionStep } from "./ConstructionStep.ts";

export type CreateHistoryStep = {
    id: string;
    type: "create";
    step: ConstructionStep;
};

export type DeleteHistoryStep = {
    id: string;
    type: "delete";
    deleted: {
        points: Point[];
        circles: Circle[];
        lines: Line[];
    };
};

export type HistoryStep = CreateHistoryStep | DeleteHistoryStep;
