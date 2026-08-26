// import { useState } from "react";

import EditorPage from "./pages/EditorPage";
import { logger } from './util/Logger.ts';

export default function App() {

    // const [entered, setEntered] =
    //     useState(false);

    // if (!entered) {
    //     return (
    //         <LandingPage
    //             onEnter={() => setEntered(true)}
    //         />
    //     );
    // }

    logger.info("Aurea: Digital sacred geometry construction software")
    logger.info("Developed and maintained by Gjin Rexhaj")

    return <EditorPage />;
}