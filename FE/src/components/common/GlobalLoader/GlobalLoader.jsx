import React, { useEffect, useState } from 'react';
import './GlobalLoader.css';
import { useLoading } from '../../../context/LoadingContext';

export default function GlobalLoader() {
  const { loading } = useLoading();
  const [shouldRender, setShouldRender] = useState(loading);

  useEffect(() => {
    if (loading) {
      setShouldRender(true);
    } else {
      // Delay unmounting to let the fade-out animation play completely
      const timer = setTimeout(() => {
        setShouldRender(false);
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [loading]);

  if (!shouldRender) return null;

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
        {/* Spinner & Turtle Visual */}
        <div className="loader-visual">
          <div className="spinner-wrapper">
            {/* Spinning Rings (Dual concentric setup) */}
            <svg viewBox="0 0 120 120" className="spinner-svg">
              <defs>
                <linearGradient id="spinnerGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stop-color="#2dd4bf" /> {/* Aquamarine */}
                  <stop offset="50%" stop-color="#0d9488" /> {/* Teal */}
                  <stop offset="100%" stop-color="#0284c7" /> {/* Sky Blue */}
                </linearGradient>
                <linearGradient id="innerSpinnerGrad" x1="100%" y1="100%" x2="0%" y2="0%">
                  <stop offset="0%" stop-color="#0d9488" />
                  <stop offset="100%" stop-color="#5eead4" />
                </linearGradient>
              </defs>
              {/* Background trace ring */}
              <circle cx="60" cy="60" r="54" fill="none" stroke="rgba(255, 255, 255, 0.02)" strokeWidth="4" />
              
              {/* Outer Spinning Ring (Clockwise) */}
              <circle 
                className="spinner-ring-outer" 
                cx="60" 
                cy="60" 
                r="54" 
                fill="none" 
                stroke="url(#spinnerGrad)" 
                strokeWidth="3.5" 
                strokeLinecap="round" 
                strokeDasharray="90 250" 
              />
              
              {/* Inner Spinning Ring (Counter-Clockwise) */}
              <circle 
                className="spinner-ring-inner" 
                cx="60" 
                cy="60" 
                r="46" 
                fill="none" 
                stroke="url(#innerSpinnerGrad)" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeDasharray="65 190" 
                opacity="0.85"
              />
            </svg>

            {/* Turtle in the Center */}
            <div className="turtle-wrapper">
              <svg viewBox="0 0 100 100" className="turtle-svg">
                <defs>
                  <linearGradient id="shellGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="#0ea5e9" />
                    <stop offset="50%" stop-color="#0d9488" />
                    <stop offset="100%" stop-color="#115e59" />
                  </linearGradient>
                  <linearGradient id="flipperGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="#2dd4bf" />
                    <stop offset="100%" stop-color="#0f766e" />
                  </linearGradient>
                  <linearGradient id="bodyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stop-color="#5eead4" />
                    <stop offset="100%" stop-color="#0d9488" />
                  </linearGradient>
                </defs>
                
                <g className="turtle-group">
                  {/* Tail */}
                  <path d="M 50 68 L 47 74 L 53 74 Z" fill="url(#bodyGrad)" />
                  
                  {/* Rear Flippers */}
                  <path className="flipper rear-left" d="M 40 60 C 35 65 30 73 35 76 C 39 78 43 70 43 64 Z" fill="url(#flipperGrad)" />
                  <path className="flipper rear-right" d="M 60 60 C 65 65 70 73 65 76 C 61 78 57 70 57 64 Z" fill="url(#flipperGrad)" />
                  
                  {/* Front Flippers */}
                  <path className="flipper front-left" d="M 38 42 C 25 40 10 47 8 56 C 8 61 17 61 27 52 C 33 47 38 43 38 42 Z" fill="url(#flipperGrad)" />
                  <path className="flipper front-right" d="M 62 42 C 75 40 90 47 92 56 C 92 61 83 61 73 52 C 67 47 62 43 62 42 Z" fill="url(#flipperGrad)" />
                  
                  {/* Head */}
                  <path className="turtle-head" d="M 46 30 C 46 22 54 22 54 30 C 54 34 46 34 46 30 Z" fill="url(#bodyGrad)" />
                  
                  {/* Shell (Caparazón) */}
                  <path className="turtle-shell" d="M 50 29 C 36 29 34 67 50 67 C 66 67 64 29 50 29 Z" fill="url(#shellGrad)" stroke="#0f766e" strokeWidth="0.5" />
                  
                  {/* Shell Geometric Patterns */}
                  <path d="M 50 29 L 50 67 M 50 36 L 43 42 L 43 53 L 50 59 L 57 53 L 57 42 Z" fill="none" stroke="rgba(255,255,255,0.22)" strokeWidth="0.8" />
                  <path d="M 43 42 L 36 38 M 43 53 L 36 57 M 57 42 L 64 38 M 57 53 L 64 57" fill="none" stroke="rgba(255,255,255,0.22)" strokeWidth="0.8" />
                </g>
              </svg>
            </div>
          </div>

          {/* Floating Marine Particles */}
          <div className="bubbles-container">
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
