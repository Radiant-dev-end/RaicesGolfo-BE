import React from 'react'
import Navbar from '../components/INICIO/NAVBAR/Navbar'
import Hero from '../components/INICIO/HERO/Hero'
import Informacion from '../components/INICIO/INFORMACION/Informacion'
import Logros from '../components/INICIO/LOGROS/Logros'
import Contenedor from '../components/INICIO/CONTENEDOR/Contenedor'
import Carrusel from '../components/INICIO/CARRUSEL/Carrusel'
import ImgUltima from '../components/INICIO/IMGULTIMA/ImgUltima'
import Footer from '../components/INICIO/FOOTER/Footer'

// Pagina de inicio.
// Compone la landing principal uniendo secciones visuales reutilizables.
function Inicio() {
  return (
    <div>
      {/* Navbar y hero presentan la identidad principal del proyecto. */}
      <Navbar />
      <Hero />

      {/* Estas secciones explican servicios, logros e informacion destacada. */}
      <Informacion />
      <Logros />
      <Contenedor />
      <Carrusel />
      <ImgUltima />

      {/* Footer cierra la navegacion general de la pagina. */}
      <Footer />
    </div>
  )
}
export default Inicio
