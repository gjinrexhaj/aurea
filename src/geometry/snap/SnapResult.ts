export type SnapResult =
    | {
        type: "point";
        pointId: string;
        x: number;
        y: number;
    }
    | {
        type: "intersection";
        x: number;
        y: number;
    }
    | null;