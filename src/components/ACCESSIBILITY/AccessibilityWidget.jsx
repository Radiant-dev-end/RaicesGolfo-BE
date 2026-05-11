// src/components/ACCESSIBILITY/AccessibilityWidget.jsx
import React, { useState, useEffect, useRef } from 'react';
import './AccessibilityWidget.css';

const AccessibilityWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const widgetRef = useRef(null);

  // Initial State from LocalStorage or Defaults
  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem('site_accessibility_settings');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return null;
      }
    }
    return {
      textSize: 0, // 0 = normal, 1 = large, 2 = x-large
      highContrast: false,
      darkMode: false,
      legibleFont: false
    };
  });

  // Apply classes to HTML tag when settings change
  useEffect(() => {
    const htmlElement = document.documentElement;
    
    // Clear previous classes
    htmlElement.classList.remove(
      'a11y-text-large', 
      'a11y-text-xlarge', 
      'a11y-high-contrast', 
      'a11y-dark-mode', 
      'a11y-legible-font'
    );

    // Apply new classes based on state
    if (settings.textSize === 1) htmlElement.classList.add('a11y-text-large');
    if (settings.textSize === 2) htmlElement.classList.add('a11y-text-xlarge');
    if (settings.highContrast) htmlElement.classList.add('a11y-high-contrast');
    if (settings.darkMode) htmlElement.classList.add('a11y-dark-mode');
    if (settings.legibleFont) htmlElement.classList.add('a11y-legible-font');

    // Save to LocalStorage
    localStorage.setItem('site_accessibility_settings', JSON.stringify(settings));
  }, [settings]);

  // Handle outside click to close panel
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (widgetRef.current && !widgetRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const togglePanel = () => {
    setIsOpen(!isOpen);
  };

  const handleTextSize = () => {
    setSettings(prev => ({
      ...prev,
      textSize: prev.textSize >= 2 ? 0 : prev.textSize + 1
    }));
  };

  const toggleSetting = (key) => {
    setSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const resetSettings = () => {
    setSettings({
      textSize: 0,
      highContrast: false,
      darkMode: false,
      legibleFont: false
    });
  };

  return (
    <div className="a11y-widget-wrapper" ref={widgetRef}>
      {/* Floating Button */}
      <button 
        className="a11y-fab" 
        onClick={togglePanel}
        aria-label="Abrir panel de accesibilidad"
        aria-expanded={isOpen}
      >
        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm9 7h-6v13h-2v-6h-2v6H9V9H3V7h18v2z"/>
        </svg>
      </button>

      {/* Accessibility Panel */}
      <div className={`a11y-panel ${isOpen ? 'open' : ''}`} role="dialog" aria-modal="true" aria-label="Opciones de accesibilidad">
        <div className="a11y-header">
          <h3>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
               <path d="M12 2c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm9 7h-6v13h-2v-6h-2v6H9V9H3V7h18v2z"/>
            </svg>
            Accesibilidad
          </h3>
          <button className="a11y-close-btn" onClick={() => setIsOpen(false)} aria-label="Cerrar panel">×</button>
        </div>

        <div className="a11y-content">
          
          {/* Text Size */}
          <button 
            className={`a11y-option-btn ${settings.textSize > 0 ? 'active' : ''}`}
            onClick={handleTextSize}
            aria-pressed={settings.textSize > 0}
          >
            <div className="icon-char">A+</div>
            <span className="a11y-option-text">Aumentar Texto {settings.textSize > 0 && `(x${settings.textSize})`}</span>
          </button>

          {/* High Contrast */}
          <button 
            className={`a11y-option-btn ${settings.highContrast ? 'active' : ''}`}
            onClick={() => toggleSetting('highContrast')}
            aria-pressed={settings.highContrast}
          >
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zm0-2V4c4.418 0 8 3.582 8 8s-3.582 8-8 8z"/>
            </svg>
            <span className="a11y-option-text">Alto Contraste</span>
          </button>

          {/* Dark Mode */}
          <button 
            className={`a11y-option-btn ${settings.darkMode ? 'active' : ''}`}
            onClick={() => toggleSetting('darkMode')}
            aria-pressed={settings.darkMode}
          >
            <svg viewBox="0 0 24 24" fill="currentColor">
               <path d="M12 3a9 9 0 1 0 9 9c0-.46-.04-.92-.1-1.36a5.389 5.389 0 0 1-4.4 2.26 5.403 5.403 0 0 1-3.14-9.8c-.44-.06-.9-.1-1.36-.1z"/>
            </svg>
            <span className="a11y-option-text">Modo Oscuro</span>
          </button>

          {/* Legible Font */}
          <button 
            className={`a11y-option-btn ${settings.legibleFont ? 'active' : ''}`}
            onClick={() => toggleSetting('legibleFont')}
            aria-pressed={settings.legibleFont}
          >
             <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M9.62 18L5.41 6h2.8l2.91 8.92h.06L14.09 6h2.8l-4.21 12H9.62z"/>
             </svg>
            <span className="a11y-option-text">Fuente Legible</span>
          </button>

          {/* Reset */}
          <div className="a11y-reset-wrapper">
             <button className="a11y-reset-btn" onClick={resetSettings}>
               <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                 <path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/>
               </svg>
               Restablecer ajustes
             </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default AccessibilityWidget;
