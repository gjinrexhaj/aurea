export type Selection =
    | {
        type: "point";
        id: string;
    }
    | {
        type: "line";
        id: string;
    }
    | {
        type: "circle";
        id: string;
    }
    | null;