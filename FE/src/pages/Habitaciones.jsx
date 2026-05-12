import React from 'react';
import Navbar from '../components/HOSPEDAJE/NAVBAR/Navbar';
import HabitacionesComponent from '../components/HOSPEDAJE/HABITACIONES/Habitaciones';
import '../components/HOSPEDAJE/HABITACIONES/Habitaciones.css';
import Footer from '../components/INICIO/FOOTER/Footer';

function Habitaciones() {
  return (
    <div className="habitaciones-page">
      <Navbar />
      
      <header className="habitaciones-hero">
        <h1>Nuestras Habitaciones</h1>
        <p>Vive una experiencia única en armonía con la naturaleza.</p>
      </header>
      
      <main className="habitaciones-container">
        <HabitacionesComponent />
      </main>
      
      <Footer />
    </div>
  );
}

export default Habitaciones;
