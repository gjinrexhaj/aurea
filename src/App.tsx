import EditorPage from "./pages/EditorPage";
import LandingPage from "./pages/LandingPage.tsx";
import {Routes, Route} from "react-router-dom";
import ManualPage from './pages/ManualPage.tsx';

export default function App() {

    return (
        <Routes>
            <Route path="/" element={ <LandingPage/> }></Route>
            <Route path="/app" element={ <EditorPage/> }></Route>
            <Route path="/manual" element={<ManualPage/>}></Route>
        </Routes>
    );
}