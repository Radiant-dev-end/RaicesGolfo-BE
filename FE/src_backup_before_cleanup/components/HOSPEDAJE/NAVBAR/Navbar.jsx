import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import SharkLogo from '../../common/SharkLogo';
import './Navbar.css';

function Navbar() {
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
    <nav className={`navbar-hospedaje ${scrolled ? 'navbar-scrolled' : ''}`}>
      <div className="navbar-container">
        <div className="navbar-logo">
          <Link to="/">
            <SharkLogo color={scrolled ? "#0d9488" : "white"} />
          </Link>
        </div>

        {/* Desktop Menu */}
        <ul className={`navbar-menu ${menuOpen ? 'active' : ''}`}>
          {navLinks.map((link, index) => (
            <li key={index} className="navbar-item">
              <Link 
                to={link.path} 
                className={`navbar-link ${location.pathname === link.path ? 'active-link' : ''}`}
                onClick={() => setMenuOpen(false)}
              >
                {link.name}
              </Link>
            </li>
          ))}
          <li className="navbar-item mobile-only">
             <Link 
                to="/reservar" 
                className="navbar-link btn-reservar-mobile"
                onClick={() => setMenuOpen(false)}
              >
                Reservar
              </Link>
          </li>
        </ul>

        {/* Action Buttons */}
        <div className="navbar-actions">
          <Link to="/reservar" className="btn-reservar">
            Reservar Now
          </Link>
          <div className="menu-icon" onClick={() => setMenuOpen(!menuOpen)}>
            <div className={`bar ${menuOpen ? 'open' : ''}`}></div>
            <div className={`bar ${menuOpen ? 'open' : ''}`}></div>
            <div className={`bar ${menuOpen ? 'open' : ''}`}></div>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
