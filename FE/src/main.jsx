import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import Routing from './routes/Routing'

// Punto de entrada de React.
// Aqui se monta toda la aplicacion dentro del div#root definido por Vite.
createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* Routing centraliza todas las vistas y decide que pagina renderizar segun la URL. */}
    <Routing />
  </StrictMode>
)
