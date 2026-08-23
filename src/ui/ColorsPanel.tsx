import {useEffect, useState} from "react";
import {RgbaColorPicker} from "react-colorful";
import {
    defaultGeometryColors,
    type GeometryColors,
    type LayeredColor,
    type RgbaColor,
} from "./GeometryColors.ts";
import "./ColorsPanel.css";

type ColorsPanelProps = {
    colors: GeometryColors;
    setColors: React.Dispatch<React.SetStateAction<GeometryColors>>;
};

type ColorTarget =
    | {group: "point"; layer: "graphite" | "ink"}
    | {group: "circle"; layer: "graphite" | "ink"}
    | {group: "line"; layer: "graphite" | "ink"}
    | {group: "axes"}
    | {group: "infiniteLines"};

type PickerState = {
    title: string;
    target: ColorTarget;
    color: RgbaColor;
} | null;

function applyColorChange(
    current: GeometryColors,
    target: ColorTarget,
    next: RgbaColor
): GeometryColors {
    const nextColors = {...current};

    switch (target.group) {
        case "point":
            nextColors.point = {
                ...nextColors.point,
                [target.layer]: next,
            };
            break;
        case "circle":
            nextColors.circle = {
                ...nextColors.circle,
                [target.layer]: next,
            };
            break;
        case "line":
            nextColors.line = {
                ...nextColors.line,
                [target.layer]: next,
            };
            break;
        case "axes":
            nextColors.axes = next;
            break;
        case "infiniteLines":
            nextColors.infiniteLines = next;
            break;
    }

    return nextColors;
}

function getDefaultColor(target: ColorTarget): RgbaColor {
    switch (target.group) {
        case "point":
            return defaultGeometryColors.point[target.layer];
        case "circle":
            return defaultGeometryColors.circle[target.layer];
        case "line":
            return defaultGeometryColors.line[target.layer];
        case "axes":
            return defaultGeometryColors.axes;
        case "infiniteLines":
            return defaultGeometryColors.infiniteLines;
    }
}

function ColorSwatch({
    label,
    color,
    onClick,
}: {
    label: string;
    color: RgbaColor;
    onClick: () => void;
}) {
    return (
        <button type="button" className="color-swatch" onClick={onClick}>
            <span className="color-swatch-label">{label}</span>
            <span
                className="color-swatch-preview"
                style={{background: `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a})`}}
            />
            <span className="color-swatch-value">
                rgba({color.r}, {color.g}, {color.b}, {color.a.toFixed(2)})
            </span>
        </button>
    );
}

function LayeredSwatches({
    label,
    colors,
    onPick,
}: {
    label: string;
    colors: LayeredColor;
    onPick: (layer: "graphite" | "ink", color: RgbaColor) => void;
}) {
    return (
        <section className="colors-section">
            <strong>{label}</strong>
            <div className="color-layer-grid">
                <ColorSwatch
                    label="Graphite"
                    color={colors.graphite}
                    onClick={() => onPick("graphite", colors.graphite)}
                />
                <ColorSwatch
                    label="Ink"
                    color={colors.ink}
                    onClick={() => onPick("ink", colors.ink)}
                />
            </div>
        </section>
    );
}

export function ColorsPanel({colors, setColors}: ColorsPanelProps) {
    const [picker, setPicker] = useState<PickerState>(null);

    useEffect(() => {
        function onKeyDown(event: KeyboardEvent) {
            if (event.key === "Escape") {
                setPicker(null);
            }
        }

        window.addEventListener("keydown", onKeyDown);
        return () => window.removeEventListener("keydown", onKeyDown);
    }, []);

    function openPicker(title: string, target: ColorTarget, color: RgbaColor) {
        setPicker({title, target, color});
    }

    function updateColor(next: RgbaColor) {
        setPicker(prev => (prev ? {...prev, color: next} : prev));

        setColors(current => {
            if (!picker) {
                return current;
            }

            return applyColorChange(current, picker.target, next);
        });
    }

    function resetToDefault() {
        if (!picker) {
            return;
        }

        const next = getDefaultColor(picker.target);
        setPicker(prev => (prev ? {...prev, color: next} : prev));
        setColors(current => applyColorChange(current, picker.target, next));
    }

    return (
        <div className="colors-panel-wrapper">
            <div className="colors-panel">
                <LayeredSwatches
                    label="Points"
                    colors={colors.point}
                    onPick={(layer, color) =>
                        openPicker(`Points ${layer}`, {group: "point", layer}, color)
                    }
                />
                <LayeredSwatches
                    label="Circles"
                    colors={colors.circle}
                    onPick={(layer, color) =>
                        openPicker(`Circles ${layer}`, {group: "circle", layer}, color)
                    }
                />
                <LayeredSwatches
                    label="Lines"
                    colors={colors.line}
                    onPick={(layer, color) =>
                        openPicker(`Lines ${layer}`, {group: "line", layer}, color)
                    }
                />
                <div className="colors-section">
                    <ColorSwatch
                        label="Axes"
                        color={colors.axes}
                        onClick={() => openPicker("Axes", {group: "axes"}, colors.axes)}
                    />
                </div>
                <div className="colors-section">
                    <ColorSwatch
                        label="Infinite Lines"
                        color={colors.infiniteLines}
                        onClick={() =>
                            openPicker(
                                "Infinite Lines",
                                {group: "infiniteLines"},
                                colors.infiniteLines
                            )
                        }
                    />
                </div>
            </div>

            {picker && (
                <div
                    className="color-modal-backdrop"
                    onClick={() => setPicker(null)}
                >
                    <div
                        className="color-modal"
                        onClick={event => event.stopPropagation()}
                    >
                        <div className="color-modal-header">
                            <strong>{picker.title}</strong>
                            <div className="color-modal-actions">
                                <button
                                    type="button"
                                    className="color-modal-reset"
                                    onClick={resetToDefault}
                                >
                                    Revert
                                </button>
                                <button
                                    type="button"
                                    className="color-modal-close"
                                    onClick={() => setPicker(null)}
                                >
                                    Close
                                </button>
                            </div>
                        </div>

                        <div
                            className="color-modal-preview"
                            style={{
                                background: `rgba(${picker.color.r}, ${picker.color.g}, ${picker.color.b}, ${picker.color.a})`,
                            }}
                        />

                        <RgbaColorPicker color={picker.color} onChange={updateColor} />
                    </div>
                </div>
            )}
        </div>
    );
}
