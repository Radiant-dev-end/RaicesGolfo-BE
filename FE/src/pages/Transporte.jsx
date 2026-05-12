import React from 'react';
import Navbar from '../components/INICIO/NAVBAR/Navbar';
import IMGULTIMA from '../components/INICIO/IMGULTIMA/ImgUltima';
import Footer from '../components/INICIO/FOOTER/Footer';
import TransporteComponent from '../components/TRANSPORTE/Transporte';
import '../components/TRANSPORTE/Transporte.css';


function Transporte() {
  return (
    <div className="transporte-page">
      <Navbar variant="solid" />

      <header className="transporte-hero">
        <h1>Horarios y Transporte</h1>
        <p>Planifica tu viaje a la hermosa Isla Venado.</p>
      </header>

      <main className="transporte-container">
        <TransporteComponent />
      </main>
      <IMGULTIMA />
      <Footer />
    </div>
  );
}

export default Transporte;
