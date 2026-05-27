// src/pages/HistoriaIslasPage.jsx
// Página de Historia de las Islas

import React, { useEffect } from 'react';
import Navbar from '../components/INICIO/NAVBAR/Navbar';
import HistoriaIslasComponent from '../components/HISTORIADELASISLAS/HistoriaIslas';
import Footer from '../components/INICIO/FOOTER/Footer';

function HistoriaIslasPage() {
  // Scroll al top cuando carga la página
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="historia-islas-page">
      <Navbar />
      <HistoriaIslasComponent />
      <Footer />
    </div>
  );
}

export default HistoriaIslasPage;
