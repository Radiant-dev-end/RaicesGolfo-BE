import React from 'react';
import './Contenedor.css';
import playaImg from '../../VIDEOS Y IMG/playa.png';
import gastronomiaImg from '../../VIDEOS Y IMG/gastronomia.png';
import aventuraImg from '../../VIDEOS Y IMG/aventura.png';

function Contenedor() {
  const caracteristicas = [
    {
      titulo: 'Exploración Sin Límites',
      descripcion: 'Navega por los rincones más vírgenes del Golfo de Nicoya, desde manglares remotos hasta playas de aguas cristalinas.'
    },
    {
      titulo: 'Gastronomía con Propósito',
      descripcion: 'Sabores que cuentan historias. Nuestros platos son elaborados con ingredientes locales, apoyando a pescadores y agricultores.'
    },
    {
      titulo: 'Sostenibilidad Real',
      descripcion: 'Cada tour y estancia contribuye directamente a la conservación de la biodiversidad y al bienestar de Isla Venado.'
    }
  ];

  return (
    <section className="contenedor-extra">
      <div className="contenedor-container">
        <div className="contenedor-header">
          <h2 className="contenedor-title">Experiencias Inolvidables</h2>
          <p className="contenedor-subtitle">Sumérgete en la esencia de Raíces del Golfo a través de nuestras actividades destacadas.</p>
        </div>

        <div className="contenedor-gallery">
          <div className="gallery-item large">
            <img src={playaImg} alt="Playa Paraíso" className="gallery-img" />
            <div className="gallery-info">
              <h3>Playas Vírgenes</h3>
              <p>Relájate en santuarios naturales rodeados de selva.</p>
            </div>
          </div>
          <div className="gallery-side">
            <div className="gallery-item small">
              <img src={gastronomiaImg} alt="Gastronomía Local" className="gallery-img" />
              <div className="gallery-info">
                <h3>Sabor Auténtico</h3>
                <p>Cenas tradicionales frente al mar.</p>
              </div>
            </div>
            <div className="gallery-item small">
              <img src={aventuraImg} alt="Aventura Golfo" className="gallery-img" />
              <div className="gallery-info">
                <h3>Tours de Aventura</h3>
                <p>Avistamiento de delfines y fauna marina.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="contenedor-info-grid">
          {caracteristicas.map((item, index) => (
            <div key={index} className="info-item">
              <div className="info-icon-dot"></div>
              <h4 className="info-item-title">{item.titulo}</h4>
              <p className="info-item-text">{item.descripcion}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Contenedor;
