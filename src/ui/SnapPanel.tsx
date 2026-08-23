import {defaultSnapSettings, type SnapSettings} from "../geometry/snap/SnapSettings.ts";
import "./SnapPanel.css";

type SnapPanelProps = {
    snapSettings: SnapSettings;
    setSnapSettings: React.Dispatch<React.SetStateAction<SnapSettings>>;
};

const RADIUS_PRESETS = [4, 6, 8, 12, 16, 24];

export function SnapPanel({snapSettings, setSnapSettings}: SnapPanelProps) {
    function updateSetting<K extends keyof SnapSettings>(key: K, value: SnapSettings[K]) {
        setSnapSettings(prev => ({
            ...prev,
            [key]: value,
        }));
    }

    function handleRadiusChange(value: number) {
        const clamped = Math.max(1, Math.min(100, Math.round(value)));
        updateSetting("snapRadius", clamped);
    }

    function resetToDefaults() {
        setSnapSettings(defaultSnapSettings);
    }

    return (
        <div className="snap-panel-wrapper">
            <div className="snap-panel">
                {/* Master Switch */}
                <section className="snap-section snap-master-section">
                    <label className="snap-toggle-label master-label">
                        <input
                            type="checkbox"
                            checked={snapSettings.enabled}
                            onChange={e => updateSetting("enabled", e.target.checked)}
                        />
                        <span className="snap-toggle-title">Enable Snapping</span>
                    </label>
                </section>

                {/* Snap Radius Controls */}
                <section
                    className={`snap-section ${!snapSettings.enabled ? "disabled" : ""}`}
                >
                    <div className="snap-section-header">
                        <strong>Snap Radius</strong>
                        <span className="snap-radius-badge">{snapSettings.snapRadius} px</span>
                    </div>

                    <div className="snap-radius-slider-row">
                        <input
                            type="range"
                            min="1"
                            max="30"
                            step="1"
                            value={snapSettings.snapRadius}
                            disabled={!snapSettings.enabled}
                            onChange={e => handleRadiusChange(Number(e.target.value))}
                            className="snap-radius-slider"
                        />
                        <div className="snap-radius-input-wrap">
                            <button
                                type="button"
                                className="snap-stepper-btn"
                                disabled={!snapSettings.enabled || snapSettings.snapRadius <= 1}
                                onClick={() => handleRadiusChange(snapSettings.snapRadius - 1)}
                            >
                                -
                            </button>
                            <input
                                type="number"
                                min="1"
                                max="100"
                                value={snapSettings.snapRadius}
                                disabled={!snapSettings.enabled}
                                onChange={e => handleRadiusChange(Number(e.target.value))}
                                className="snap-radius-number"
                            />
                            <button
                                type="button"
                                className="snap-stepper-btn"
                                disabled={!snapSettings.enabled || snapSettings.snapRadius >= 100}
                                onClick={() => handleRadiusChange(snapSettings.snapRadius + 1)}
                            >
                                +
                            </button>
                        </div>
                    </div>

                    <div className="snap-presets-row">
                        <span className="snap-presets-label">Presets:</span>
                        <div className="snap-presets-buttons">
                            {RADIUS_PRESETS.map(preset => (
                                <button
                                    key={preset}
                                    type="button"
                                    className={`snap-preset-btn ${
                                        snapSettings.snapRadius === preset ? "active" : ""
                                    }`}
                                    disabled={!snapSettings.enabled}
                                    onClick={() => handleRadiusChange(preset)}
                                >
                                    {preset}px
                                </button>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Intersection Snap Types */}
                <section
                    className={`snap-section ${!snapSettings.enabled ? "disabled" : ""}`}
                >
                    <div className="snap-section-header">
                        <strong>Intersection Snapping</strong>
                    </div>

                    <div className="snap-toggles-list">
                        <label className="snap-toggle-label">
                            <input
                                type="checkbox"
                                checked={snapSettings.snapLineLine}
                                disabled={!snapSettings.enabled}
                                onChange={e => updateSetting("snapLineLine", e.target.checked)}
                            />
                            <div className="snap-toggle-text">
                                <span className="snap-toggle-title">Line – Line</span>
                                <span className="snap-toggle-desc">
                                    Snap to intersections between straight lines
                                </span>
                            </div>
                        </label>

                        <label className="snap-toggle-label">
                            <input
                                type="checkbox"
                                checked={snapSettings.snapLineCircle}
                                disabled={!snapSettings.enabled}
                                onChange={e =>
                                    updateSetting("snapLineCircle", e.target.checked)
                                }
                            />
                            <div className="snap-toggle-text">
                                <span className="snap-toggle-title">Line – Circle</span>
                                <span className="snap-toggle-desc">
                                    Snap to intersections between lines and circles
                                </span>
                            </div>
                        </label>

                        <label className="snap-toggle-label">
                            <input
                                type="checkbox"
                                checked={snapSettings.snapCircleCircle}
                                disabled={!snapSettings.enabled}
                                onChange={e =>
                                    updateSetting("snapCircleCircle", e.target.checked)
                                }
                            />
                            <div className="snap-toggle-text">
                                <span className="snap-toggle-title">Circle – Circle</span>
                                <span className="snap-toggle-desc">
                                    Snap to intersections between two circles
                                </span>
                            </div>
                        </label>
                    </div>
                </section>

                {/* Additional Target Snaps */}
                <section
                    className={`snap-section ${!snapSettings.enabled ? "disabled" : ""}`}
                >
                    <div className="snap-section-header">
                        <strong>Target Snapping</strong>
                    </div>

                    <div className="snap-toggles-list">
                        <label className="snap-toggle-label">
                            <input
                                type="checkbox"
                                checked={snapSettings.snapPoints}
                                disabled={!snapSettings.enabled}
                                onChange={e => updateSetting("snapPoints", e.target.checked)}
                            />
                            <div className="snap-toggle-text">
                                <span className="snap-toggle-title">Point Vertices</span>
                                <span className="snap-toggle-desc">
                                    Snap to existing points on the canvas
                                </span>
                            </div>
                        </label>

                        <label className="snap-toggle-label">
                            <input
                                type="checkbox"
                                checked={snapSettings.snapOrigin}
                                disabled={!snapSettings.enabled}
                                onChange={e => updateSetting("snapOrigin", e.target.checked)}
                            />
                            <div className="snap-toggle-text">
                                <span className="snap-toggle-title">Origin (0, 0)</span>
                                <span className="snap-toggle-desc">
                                    Snap to the center origin coordinate
                                </span>
                            </div>
                        </label>
                    </div>
                </section>

                {/* Reset button */}
                <div className="snap-actions">
                    <button
                        type="button"
                        className="snap-reset-button"
                        onClick={resetToDefaults}
                    >
                        Reset Snap Settings
                    </button>
                </div>
            </div>
        </div>
    );
}
