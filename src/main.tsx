import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import "./global.css"
import {HashRouter} from "react-router-dom"



createRoot(document.getElementById('root')!).render(
  // <StrictMode>
    <HashRouter>
        <App></App>
    </HashRouter>
  // </StrictMode>,
)