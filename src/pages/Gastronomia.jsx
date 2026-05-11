
import React, { useEffect } from 'react';
import GastroNavbar from '../components/GASTRONOMIA/NAVBAR/GastroNavbar';
import GastronomiaPosada from '../components/GASTRONOMIA/CONTENEDORES/GastronomiaPosada';
import GastronomiaIsla from '../components/GASTRONOMIA/CONTENEDORES/GastronomiaIsla';
import Footer from '../components/INICIO/FOOTER/Footer';

function Gastronomia() {
  // Ensure the page scrolls to top when loaded (unless there's a hash in the URL)
  useEffect(() => {
    if (!window.location.hash) {
      window.scrollTo(0, 0);
    }
  }, []);

  return (
    <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh' }}>
      <GastroNavbar />
      
      {/* Spacer to push content down beneath fixed transparent navbar if desired - but usually we have a hero. 
          Given there is no hero requested, we can use padding-top on the first section to prevent overlap.
          The GastronomiaSection class already has padding: 100px 0; which clears the 80px navbar! */}

      <GastronomiaPosada />
      <GastronomiaIsla />
      <Footer />
    </div>
  );
}

export default Gastronomia;
