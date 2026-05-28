import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import SharkLogo from '../../common/SharkLogo';
import './GastroNavbar.css';

function GastroNavbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Inicio', path: '/' },
    { name: 'Habitaciones', path: '/habitaciones' },
    { name: 'Tours', path: '/tours' },
    { name: 'Gastronomía', path: '/gastronomia' },
    { name: 'Transporte', path: '/transporte' },
    { name: 'Historia de la Isla', path: '/historia-de-la-isla' },
    { name: 'Acerca de', path: '/acerca-de' },
  ];

  return (
    <nav className={`gastro-navbar ${scrolled ? 'gastro-navbar-scrolled' : ''}`}>
      <div className="gastro-navbar-container">
        <div className="gastro-navbar-logo">
          <Link to="/">
            <SharkLogo color={scrolled ? "#0d9488" : "white"} />
          </Link>
        </div>

        {/* Desktop Menu */}
        <ul className={`gastro-navbar-menu ${menuOpen ? 'active' : ''}`}>
          {navLinks.map((link, index) => (
            <li key={index} className="gastro-navbar-item">
              <Link 
                to={link.path} 
                className={`gastro-navbar-link ${location.pathname === link.path ? 'active-link' : ''}`}
                onClick={() => setMenuOpen(false)}
              >
                {link.name}
              </Link>
            </li>
          ))}
          {/* Mobile Reservar link */}
          <li className="gastro-navbar-item mobile-only">
             <Link 
                to="/reservar" 
                className="gastro-navbar-link btn-reservar-mobile"
                onClick={() => setMenuOpen(false)}
              >
                Reservar
              </Link>
          </li>
        </ul>

        {/* Action Buttons */}
        <div className="gastro-navbar-actions">
          <Link to="/reservar" className="gastro-btn-reservar">
            Reservar Now
          </Link>
          <div className={`gastro-menu-icon ${menuOpen ? 'open' : ''}`} onClick={() => setMenuOpen(!menuOpen)}>
            <div className="bar"></div>
            <div className="bar"></div>
            <div className="bar"></div>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default GastroNavbar;
