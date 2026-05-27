import React, { useEffect, useState } from 'react';
import './GlobalLoader.css';
import { useLoading } from '../../../context/LoadingContext';
import { useLocation } from 'react-router-dom';

export default function GlobalLoader() {
  const { loading } = useLoading();
  const location = useLocation();

  // Rutas donde el loader está permitido (login, panel cliente con reservas)
  const allowedPaths = ['/login', '/reservar', '/cliente'];
  const isAllowed = allowedPaths.some(path => location.pathname.startsWith(path));

  const [shouldRender, setShouldRender] = useState(loading && isAllowed);

  useEffect(() => {
    // Solo activar el loader si estamos en una ruta permitida
    if (!isAllowed) {
      setShouldRender(false);
      return;
    }

    if (loading) {
      setShouldRender(true);
    } else {
      // Delay unmounting to let the fade-out animation play completely
      const timer = setTimeout(() => {
        setShouldRender(false);
      }, 400);

      return () => clearTimeout(timer);
    }
  }, [loading, isAllowed]);

  if (!shouldRender || !isAllowed) return null;

  return (
    <div
      className={`global-loader-overlay ${loading ? 'fade-in' : 'fade-out'}`}
      role="alert"
      aria-live="assertive"
      aria-label="Cargando información"
    >
      {/* Ocean Depth Glow Effect */}
      <div className="loader-glow"></div>

      <div className="loader-content">
        {/* Horizontal Loading Bar Visual */}
        <div className="loader-visual-horizontal">
          <div className="progress-bar-container">
            <div className="progress-bar-track"></div>
            <div className="progress-bar-fill"></div>
          </div>

          {/* Floating Marine Particles */}
          <div className="bubbles-container horizontal-bubbles">
            <div className="bubble b1"></div>
            <div className="bubble b2"></div>
            <div className="bubble b3"></div>
            <div className="bubble b4"></div>
            <div className="bubble b5"></div>
          </div>
        </div>

        {/* Brand & Loading Info */}
        <div className="loader-text-wrapper">
          <h2 className="loader-title">RAÍCES DEL GOLFO</h2>

          <div className="loader-divider">
            <div className="loader-divider-line"></div>
            <div className="loader-divider-dot"></div>
            <div className="loader-divider-line"></div>
          </div>

          <p className="loader-status">Conectando con el Golfo...</p>
          <div className="loader-badge">CONSERVACIÓN ACTIVA</div>
        </div>
      </div>
    </div>
  );
}