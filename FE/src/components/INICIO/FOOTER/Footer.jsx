import React from 'react';
import { Link } from 'react-router-dom';
import SharkLogo from '../../common/SharkLogo';
import './Footer.css';

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer-container">
      <div className="footer-content">
        <div className="footer-section brand-section">
          <SharkLogo color="white" />
          <p className="footer-description">
            Descubre la magia del Golfo de Nicoya. Ofrecemos experiencias únicas de hospedaje, tours y gastronomía local con un compromiso hacia el turismo sostenible y la comunidad.
          </p>
          <div className="social-icons">
            <a href="#" className="social-link" aria-label="Facebook">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
            </a>
            <a href="#" className="social-link" aria-label="Instagram">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
            </a>
          </div>
        </div>

        <div className="footer-section links-section">
          <h3 className="footer-heading">Enlaces Rápidos</h3>
          <ul className="footer-links">
            <li><Link to="/">Inicio</Link></li>
            <li><Link to="/habitaciones">Habitaciones</Link></li>
            <li><Link to="/tours">Tours</Link></li>
            <li><Link to="/gastronomia">Gastronomía</Link></li>
            <li><Link to="/transporte">Transporte</Link></li>
            <li><Link to="/isla-venado">Isla Venado</Link></li>
          </ul>
        </div>

        <div className="footer-section contact-section">
          <h3 className="footer-heading">Contacto</h3>
          <ul className="contact-info">
            <li>
              <svg className="contact-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
              <span>+506 8000 0000</span>
            </li>
            <li>
              <svg className="contact-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
              <span>info@raicesdelgolfo.com</span>
            </li>
            <li>
              <svg className="contact-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
              <span>Isla Venado, Golfo de Nicoya, Costa Rica</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; {currentYear} Raíces del Golfo. Todos los derechos reservados.</p>
        <div className="footer-bottom-links">
          <Link to="/privacidad">Política de Privacidad</Link>
          <Link to="/terminos">Términos de Servicio</Link>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
