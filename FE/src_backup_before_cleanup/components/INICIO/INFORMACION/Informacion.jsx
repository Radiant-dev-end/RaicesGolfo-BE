import React from 'react';
import './Informacion.css';
import infoImg from '../../VIDEOS Y IMG/image-copy.png';

function Informacion() {
  return (
    <section className="info-section">
      <div className="info-container">
        <div className="info-content">
          <h2 className="info-title">El Majestuoso Golfo de Nicoya</h2>
          <div className="info-divider"></div>
          <p className="info-description">
            El Golfo de Nicoya es el entrante de mar más profundo de Costa Rica, un paraíso natural de aproximadamente 2,500 km² que separa las provincias de Guanacaste y Puntarenas. Sus aguas albergan una biodiversidad inigualable, desde extensos manglares hasta el estuario vital del río Tempisque.
          </p>
          <p className="info-description">
            En Raíces del Golfo, nuestra misión es preservar este ecosistema único. A través del turismo sostenible, invitamos a nuestros visitantes a explorar islas emblemáticas como Chira, Venado y San Lucas, promoviendo el bienestar de las comunidades locales y la protección de su herencia natural.
          </p>
          
          <div className="info-stats">
            <div className="stat-item">
              <span className="stat-number">10+</span>
              <span className="stat-label">Años de Experiencia</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">100%</span>
              <span className="stat-label">Compromiso Sostenible</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">5K+</span>
              <span className="stat-label">Visitantes Felices</span>
            </div>
          </div>
        </div>

        <div className="info-image-container">
          <img src={infoImg} alt="Raíces del Golfo" className="info-image" />
        </div>
      </div>
    </section>
  );
}

export default Informacion;
