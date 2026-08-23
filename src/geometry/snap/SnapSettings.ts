export type SnapSettings = {
    enabled: boolean;
    snapRadius: number;
    snapPoints: boolean;
    snapLineLine: boolean;
    snapLineCircle: boolean;
    snapCircleCircle: boolean;
    snapOrigin: boolean;
};

export const defaultSnapSettings: SnapSettings = {
    enabled: true,
    snapRadius: 6,
    snapPoints: true,
    snapLineLine: true,
    snapLineCircle: true,
    snapCircleCircle: true,
    snapOrigin: true,
};
