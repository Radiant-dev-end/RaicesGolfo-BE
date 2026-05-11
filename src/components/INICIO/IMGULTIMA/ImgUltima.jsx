import React from 'react';
import './IMGULTIMA.css';
import footerBg from '../../VIDEOS Y IMG/footer-bg.png';

function IMGULTIMA() {
  return (
    <footer className="footer-only-img">
      <img src={footerBg} alt="Footer landscape" className="footer-full-image" />
    </footer>
  );
}

export default IMGULTIMA;
