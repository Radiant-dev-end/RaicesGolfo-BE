// src/components/HABITACIONES/Habitaciones.jsx
// Este es un ejemplo de cómo reutilizar ReservaModal en otras secciones

import React, { useState } from 'react';
import './Habitaciones.css';
import ReservaModal from '../MODAL/ReservaModal';
import { WHATSAPP_HABITACIONES } from '../../config/whatsapp';

function Habitaciones({ imagen, nombre, descripcion, precio }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleReserve = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <div className="habitacion-card">
        <img src={imagen} alt={nombre} />
        <h3>{nombre}</h3>
        <p>{descripcion}</p>
        <div className="habitacion-footer">
          <span className="precio">{precio}</span>
          <button onClick={handleReserve} className="btn-reservar">
            Reservar
          </button>
        </div>
      </div>

      <ReservaModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        tourName={nombre}
        whatsappNumber={WHATSAPP_HABITACIONES}
      />
    </>
  );
}

export default Habitaciones;