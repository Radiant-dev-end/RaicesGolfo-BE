import React from 'react';
import './Logros.css';

function Logros() {
  const logrosData = [
    {
      id: 1,
      dato: '100%',
      descripcion: 'Bandera Azul Ecológica por la protección de nuestras playas.'
    },
    {
      id: 2,
      dato: '500+',
      descripcion: 'Nidos de tortugas protegidos y liberados exitosamente cada año.'
    },
    {
      id: 3,
      dato: 'Nivel 5',
      descripcion: 'Certificación de Turismo Sostenible con los más altos estándares.'
    },
    {
      id: 4,
      dato: '50+',
      descripcion: 'Familias locales apoyadas directamente a través del ecoturismo.'
    }
  ];

  return (
    <section className="logros-section">
      <div className="logros-container">
        <div className="logros-grid">
          {logrosData.map((logro) => (
            <div key={logro.id} className="logro-card">
              <h3 className="logro-dato">{logro.dato}</h3>
              <p className="logro-descripcion">{logro.descripcion}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Logros;
