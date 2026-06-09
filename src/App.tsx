import { useState } from "react";

import LandingPage from "./pages/LandingPage";
import EditorPage from "./pages/EditorPage";

export default function App() {

    const [entered, setEntered] =
        useState(false);

    if (!entered) {
        return (
            <LandingPage
                onEnter={() => setEntered(true)}
            />
        );
    }

    return <EditorPage />;
}