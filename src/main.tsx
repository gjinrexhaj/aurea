import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'



createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

// alert("USAGE GUIDE" +
//     "\n" +
//     "\nline and compass require two points" +
//     "\n'del' or 'backspace' to delete selected geometry" +
//     "\nscroll wheel to zoom, middle mouse to pan"
// )