import React from 'react';
import { Link } from 'react-router-dom';
import './Servicios.css';

function Servicios() {
  const servicios = [
    {
      id: 1,
      titulo: 'Habitaciones',
      descripcion: 'Despierta con el sonido de la selva en nuestras estancias bioclimáticas frente al mar.',
      icono: '🏨'
    },
    {
      id: 2,
      titulo: 'Tours & Aventura',
      descripcion: 'Explora Isla Venado y el Golfo de Nicoya con guías locales certificados y apasionados.',
      icono: '🛶'
    },
    {
      id: 3,
      titulo: 'Gastronomía',
      descripcion: 'Disfruta de platillos frescos con ingredientes directos de nuestra propia granja y del mar.',
      icono: '🍽️'
    },
    {
      id: 4,
      titulo: 'Transporte',
      descripcion: 'Traslados seguros y cómodos por tierra y mar hacia nuestros destinos paradisíacos.',
      icono: '🚤'
    }
  ];

  return (
    <section className="servicios-section">
      <div className="servicios-container">
        {/* Lado Izquierdo: Información descriptiva */}
        <div className="servicios-info-col">
          <h2 className="servicios-main-title">
            Ofrecemos una <span className="highlight">Experiencia</span> 100% Inmersiva.
          </h2>
          <p className="servicios-description">
            En Raíces del Golfo no solo te ofrecemos un lugar donde quedarte, te brindamos una conexión real con la biodiversidad de Costa Rica. Cada servicio está diseñado bajo principios de sostenibilidad y apoyo comunitario.
          </p>
          <p className="servicios-description">
            Tu visita apoya la economía local y contribuye a la protección de los ecosistemas marinos que rodean nuestras hermosas islas.
          </p>
          
          <div className="servicios-action">
            <Link to="/login" className="servicios-reserve-btn">
              <span className="btn-icon">📅</span>
              RESERVAR AHORA
              <div className="btn-tail"></div>
            </Link>
          </div>
        </div>

        {/* Lado Derecho: Grid de Tarjetas */}
        <div className="servicios-grid-col">
          {servicios.map((servicio) => (
            <div key={servicio.id} className="servicio-card">
              <div className="servicio-icon-box">
                <span className="servicio-icon">{servicio.icono}</span>
              </div>
              <h3 className="servicio-card-title">{servicio.titulo}</h3>
              <p className="servicio-card-text">{servicio.descripcion}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Servicios;
