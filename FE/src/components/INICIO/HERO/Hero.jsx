import React from 'react';
import { Link } from 'react-router-dom';
import './Hero.css';
import bgVideo from '../../VIDEOS Y IMG/Herooo.mp4';

function Hero() {
  return (
    <div className="hero-container">

      <video autoPlay loop muted playsInline className="hero-video">
        <source src={bgVideo} type="video/mp4" />
        Tu navegador no soporta el formato de video.
      </video>

      <div className="hero-overlay"></div>

      <div className="hero-content">
        <h1 className="hero-title">Descubre las Raíces del Golfo</h1>

        <p className="hero-subtitle">
          Naturaleza, Hospedaje y Aventura Inolvidable en Costa Rica
        </p>

        {/* BOTON PEZ */}
        <Link to="/historia-de-las-islas" className="fish-btn-link">
          <div className="fish-btn">
            <svg className="fish" viewBox="0 0 200 80">

              {/* cuerpo */}
              <ellipse cx="90" cy="40" rx="55" ry="25" className="fish-body" />

              {/* cola */}
              <polygon points="140,40 180,15 180,65" className="fish-tail" />

              {/* ojo */}
              <circle cx="60" cy="35" r="4" className="fish-eye" />

              {/* texto */}
              <text x="90" y="47" textAnchor="middle" className="fish-text">
                Explorar
              </text>

            </svg>
          </div>
        </Link>

      </div>
    </div>
  );
}

export default Hero;
