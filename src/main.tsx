import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import "./global.css"
import { BrowserRouter } from "react-router-dom"



createRoot(document.getElementById('root')!).render(
  // <StrictMode>
    <BrowserRouter>
        <App></App>
    </BrowserRouter>
  // </StrictMode>,
)