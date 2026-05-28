// src/components/MODAL/ReservaModal.jsx
// Modal flotante para elegir entre reserva en línea o por WhatsApp

import React from 'react';
import { useNavigate } from 'react-router-dom';
import './ReservaModal.css';

<<<<<<< HEAD
function ReservaModal({ isOpen, onClose, tourName, whatsappNumber }) {
=======
function ReservaModal({ isOpen, onClose, tourName, whatsappNumber, type = 'tour' }) {
>>>>>>> 304ceb4bcc6eae6de179494f37c5768d2b51a2dd
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleReservarEnLinea = () => {
    const user = localStorage.getItem('user');
<<<<<<< HEAD
    if (user) {
      // Si está logueado, ir al panel de cliente
      navigate('/cliente', { state: { selectedTour: tourName, tab: 'reservas' } });
    } else {
      // Si no, ir al login
      navigate('/login');
=======
    const targetTab = type === 'room' ? 'hospedajes' : 'reservas';
    
    if (user) {
      // Si está logueado, ir al panel de cliente
      navigate('/cliente', { state: { selectedTour: tourName, tab: targetTab } });
    } else {
      // Si no, ir al login, pasando el estado del tour/habitación deseada
      navigate('/login', { state: { selectedTour: tourName, tab: targetTab } });
>>>>>>> 304ceb4bcc6eae6de179494f37c5768d2b51a2dd
    }
    onClose();
  };

  const handleReservarWhatsApp = () => {
    // Construir mensaje de WhatsApp
    const mensaje = `Hola, me gustaría reservar ${tourName}`;
    const encodedMensaje = encodeURIComponent(mensaje);
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMensaje}`;
    
    // Abrir WhatsApp en nueva pestaña
    window.open(whatsappUrl, '_blank');
    onClose();
  };

  return (
    <>
      {/* Overlay semitransparente */}
      <div className="modal-overlay" onClick={onClose}></div>

      {/* Modal flotante */}
      <div className="modal-floating">
        <button className="modal-close" onClick={onClose}>
          ✕
        </button>

        <h2 className="modal-title">¿Cómo deseas reservar?</h2>
        <p className="modal-subtitle">Elige tu opción preferida</p>

        <div className="modal-options">
          {/* Opción 1: Reservar en línea */}
          <button
            className="modal-option modal-option-online"
            onClick={handleReservarEnLinea}
          >
            <div className="modal-option-icon">📱</div>
            <div className="modal-option-text">
              <h3>Reservar en Línea</h3>
              <p>Accede a tu cuenta y reserva directamente</p>
            </div>
            <div className="modal-option-arrow">→</div>
          </button>

          {/* Opción 2: Reservar por WhatsApp */}
          <button
            className="modal-option modal-option-whatsapp"
            onClick={handleReservarWhatsApp}
          >
            <div className="modal-option-icon">💬</div>
            <div className="modal-option-text">
              <h3>Reservar por WhatsApp</h3>
              <p>Chatea con nosotros directamente</p>
            </div>
            <div className="modal-option-arrow">→</div>
          </button>
        </div>

        <p className="modal-footer">
          Cualquiera de las dos opciones es igual de fácil
        </p>
      </div>
    </>
  );
}

export default ReservaModal;