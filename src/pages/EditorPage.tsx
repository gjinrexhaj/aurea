import {useCallback, useRef, useState} from "react";
import {Layout, Model, type TabNode, type IJsonModel} from "flexlayout-react";
import "flexlayout-react/style/light.css";
import type {ViewSettings} from "../ui/ViewSettings.ts";
import type {GeometryLayer} from "../geometry/GeometryLayer.ts";
import {Toolbar} from "../ui/Toolbar.tsx";
import Canvas from "../canvas/Canvas.tsx";
import {ColorsPanel} from "../ui/ColorsPanel.tsx";
import {HistoryPanel} from "../ui/HistoryPanel.tsx";
import type {HistoryStep} from "../construction/HistoryStep.ts";
import {defaultGeometryColors} from "../ui/GeometryColors.ts";
import "./EditorPage.css";

const defaultLayoutJson: IJsonModel = {
    global: {
        tabEnablePopout: true,
        tabEnablePopoutFloatIcon: true,
        tabEnablePopoutIcon: true,
        tabSetEnableMaximize: true,
        tabEnableClose: false,
        tabSetMinWidth: 240,
        tabSetMinHeight: 200,
    },
    borders: [],
    layout: {
        type: "row",
        weight: 100,
        children: [
            {
                type: "tabset",
                weight: 75,
                enableTabStrip: false,
                children: [
                    {
                        type: "tab",
                        id: "canvas-tab",
                        name: "Canvas",
                        component: "canvas",
                        enableClose: false,
                        enableDrag: false,
                    },
                ],
            },
            {
                type: "tabset",
                weight: 25,
                id: "panels-tabset",
                children: [
                    {
                        type: "tab",
                        id: "colors-tab",
                        name: "Colors",
                        component: "colors",
                        enableClose: false,
                    },
                    {
                        type: "tab",
                        id: "history-tab",
                        name: "History",
                        component: "history",
                        enableClose: false,
                    },
                ],
            },
        ],
    },
};

export default function EditorPage() {
    // declare state
    const [model] = useState(() => Model.fromJson(defaultLayoutJson));
    const [activeTool, setActiveTool] = useState("select");
    const [viewSettings, setViewSettings] = useState<ViewSettings>({
        showAxes: true,
        showGrid: false,
        showInfiniteLines: false,
    });
    const [activeLayer, setActiveLayer] = useState<GeometryLayer>("construction");
    const [colors, setColors] = useState(defaultGeometryColors);
    const [history, setHistory] = useState<HistoryStep[]>([]);
    const [selectedHistoryId, setSelectedHistoryId] = useState<string | null>(null);

    const undoRef = useRef<(() => void) | null>(null);
    const handleRegisterUndo = useCallback((undoFn: () => void) => {
        undoRef.current = undoFn;
    }, []);

    const handleUndo = useCallback(() => {
        undoRef.current?.();
    }, []);

    const factory = useCallback(
        (node: TabNode) => {
            const component = node.getComponent();
            switch (component) {
                case "canvas":
                    return (
                        <div className="canvas-outer">
                            <Canvas
                                activeTool={activeTool}
                                viewSettings={viewSettings}
                                activeLayer={activeLayer}
                                colors={colors}
                                history={history}
                                onHistoryChange={setHistory}
                                selectedHistoryId={selectedHistoryId}
                                onSelectHistoryId={setSelectedHistoryId}
                                onRegisterUndo={handleRegisterUndo}
                            />
                        </div>
                    );
                case "colors":
                    return (
                        <ColorsPanel
                            colors={colors}
                            setColors={setColors}
                        />
                    );
                case "history":
                    return (
                        <HistoryPanel
                            history={history}
                            selectedHistoryId={selectedHistoryId}
                            onSelectHistoryId={setSelectedHistoryId}
                            onUndo={handleUndo}
                        />
                    );
                default:
                    return null;
            }
        },
        [
            activeTool,
            viewSettings,
            activeLayer,
            colors,
            history,
            selectedHistoryId,
            handleRegisterUndo,
            handleUndo,
        ]
    );

    // render component
    return (
        <div className="app">
            <div className="toolbar-outer">
                <Toolbar
                    activeTool={activeTool}
                    onToolChange={setActiveTool}
                    viewSettings={viewSettings}
                    setViewSettings={setViewSettings}
                    activeLayer={activeLayer}
                    onLayerChange={setActiveLayer}
                />
            </div>

            <div className="layout-outer">
                <Layout model={model} factory={factory} />
            </div>
        </div>
    );
}