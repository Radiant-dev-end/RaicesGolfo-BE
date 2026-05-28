import React, { useState, useEffect } from 'react';
import './Carrusel.css';

// Importando imágenes de alta calidad generadas
import img1 from '../../VIDEOS Y IMG/gastronomia_1.png';
import img2 from '../../VIDEOS Y IMG/gastronomia_2.png';
import img3 from '../../VIDEOS Y IMG/isla_1.png';
import img4 from '../../VIDEOS Y IMG/isla_2.png';

const images = [
  { url: img1, title: 'Sabores del Golfo', subtitle: 'Gastronomía auténtica con ingredientes locales' },
  { url: img2, title: 'Experiencia Culinaria', subtitle: 'Tradición y frescura en cada plato' },
  { url: img3, title: 'Paraísos Escondidos', subtitle: 'Descubre la magia de la Isla Venado y sus alrededores' },
  { url: img4, title: 'Naturaleza Pura', subtitle: 'Vistas panorámicas y atardeceres de ensueño' },
];

function Carrusel() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000); 
    return () => clearInterval(timer);
  }, []);

  const goToNext = () => {
    setCurrentIndex((currentIndex + 1) % images.length);
  };

  const goToPrev = () => {
    setCurrentIndex((currentIndex - 1 + images.length) % images.length);
  };

  return (
    <section className="carrusel-section">
      <div className="carrusel-container">
        <div className="carrusel-wrapper">
          {images.map((image, index) => (
            <div
              key={index}
              className={`carrusel-slide ${index === currentIndex ? 'active' : ''}`}
            >
              <img src={image.url} alt={image.title} className="carrusel-img" />
              <div className="carrusel-overlay">
                <div className="carrusel-content">
                  <h2 className="carrusel-title">{image.title}</h2>
                  <p className="carrusel-subtitle">{image.subtitle}</p>
                </div>
              </div>
            </div>
          ))}

          {/* Botones de navegación */}
          <button className="carrusel-btn prev" onClick={goToPrev}>
            &#10094;
          </button>
          <button className="carrusel-btn next" onClick={goToNext}>
            &#10095;
          </button>

          {/* Indicadores (dots) */}
          <div className="carrusel-dots">
            {images.map((_, index) => (
              <span
                key={index}
                className={`dot ${index === currentIndex ? 'active' : ''}`}
                onClick={() => setCurrentIndex(index)}
              ></span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default Carrusel;
