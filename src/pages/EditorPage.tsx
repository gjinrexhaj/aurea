import {useCallback, useRef, useState} from "react";
import {Layout, Model, type TabNode, type IJsonModel} from "flexlayout-react";
import "flexlayout-react/style/light.css";
import type {ViewSettings} from "../ui/ViewSettings.ts";
import type {GeometryLayer} from "../geometry/GeometryLayer.ts";
import {Toolbar} from "../ui/Toolbar.tsx";
import Canvas from "../canvas/Canvas.tsx";
import {ColorsPanel} from "../ui/ColorsPanel.tsx";
import {HistoryPanel} from "../ui/HistoryPanel.tsx";
import {SnapPanel} from "../ui/SnapPanel.tsx";
import type {HistoryStep} from "../construction/HistoryStep.ts";
import {defaultGeometryColors} from "../ui/GeometryColors.ts";
import {defaultSnapSettings, type SnapSettings} from "../geometry/snap/SnapSettings.ts";
import "./EditorPage.css";
import { ConsolePanel } from '../ui/ConsolePanel.tsx';

const defaultLayoutJson: IJsonModel = {
    global: {
        tabEnablePopout: true,
        tabEnablePopoutFloatIcon: true,
        tabEnablePopoutIcon: true,
        tabSetEnableMaximize: true,
        tabEnableClose: false,
        tabSetMinWidth: 200,
        tabSetMinHeight: 40,
    },
    borders: [],
    layout: {
        type: "row",
        weight: 100,
        children: [
            {
                type: "tabset",
                weight: 75,
                id: "canvas-tabset",
                children: [
                    {
                        type: "tab",
                        id: "canvas-tab",
                        name: "Canvas",
                        component: "canvas",
                        enableClose: false,
                    },
                ],
            },
        {
            type: "row",
            weight: 25,
            children: [
                {
                    type: "tabset",
                    id: "panels-tabset-upper",
                    weight: 60,
                    children: [
                        {
                            type: "tab",
                            id: "snap-tab",
                            name: "Snap",
                            component: "snap",
                            enableClose: false,
                        },
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
                        }
                    ]
                },
                {
                    type: "tabset",
                    id: "panels-tabset-lower",
                    weight: 40,
                    children: [
                        {
                            type: "tab",
                            id: "console-tab",
                            name: "Console",
                            component: "console",
                            enableClose: false,
                        }
                    ]
                }
            ]
        },

        ],
    },
    subLayouts: {
"toolbar-float": {
    type: "float",
    name: "Toolbar",
    rect: {
        x: 0,
        y: 10000,
        width: 790,
        height: 125,
    },
    layout: {
        type: "row",
        children: [
            {
                type: "tabset",
                id: "toolbar-tabset",
                children: [
                    {
                        type: "tab",
                        id: "toolbar-tab",
                        name: "Toolbar",
                        component: "toolbar",
                        enableClose: false,
                    },
                ],
            },
        ],
    },
},

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
    const [snapSettings, setSnapSettings] = useState<SnapSettings>(defaultSnapSettings);
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
                                snapSettings={snapSettings}
                                history={history}
                                onHistoryChange={setHistory}
                                selectedHistoryId={selectedHistoryId}
                                onSelectHistoryId={setSelectedHistoryId}
                                onRegisterUndo={handleRegisterUndo}
                            />
                        </div>
                    );
                case "toolbar":
                    return (
                        <Toolbar
                            activeTool={activeTool}
                            onToolChange={setActiveTool}
                            viewSettings={viewSettings}
                            setViewSettings={setViewSettings}
                            activeLayer={activeLayer}
                            onLayerChange={setActiveLayer}
                        />
                    );
                case "snap":
                    return (
                        <SnapPanel
                            snapSettings={snapSettings}
                            setSnapSettings={setSnapSettings}
                        />
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
                case "console":
                    return (
                      <ConsolePanel/>
                    )
                default:
                    return null;
            }
        },
        [
            activeTool,
            viewSettings,
            activeLayer,
            colors,
            snapSettings,
            history,
            selectedHistoryId,
            handleRegisterUndo,
            handleUndo,
        ]
    );

    // render component
    return (
        <div className="app">
            <div className="layout-outer">
                <Layout model={model} factory={factory} />
            </div>
        </div>
    );
}