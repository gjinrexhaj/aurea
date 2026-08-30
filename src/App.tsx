import EditorPage from "./pages/EditorPage";
import LandingPage from "./pages/LandingPage.tsx";
import { logger } from './util/Logger.ts';
import {Routes, Route} from "react-router-dom";

export default function App() {

    logger.info("Aurea: Digital sacred geometry construction software");
    logger.info("Developed and maintained by Gjin Rexhaj");

    return (
        <Routes>
            <Route path="/aurea" element={ <LandingPage/> }></Route>
            <Route path="/aurea/app" element={ <EditorPage/> }></Route>
        </Routes>
    );
}