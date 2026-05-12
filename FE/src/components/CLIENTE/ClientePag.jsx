import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Swal from 'sweetalert2';
import NavbarCliente from './NavbarCliente';
import Opiniones from '../INICIO/OPINIONES/Opiniones';
import { getTours } from '../../services/CrudTours';

import { getReservasByUser, createReserva, getAllReservas } from '../../services/CrudReservas';
import { getRoomReservasByUser, createRoomReserva, getAllRoomReservas } from '../../services/CrudReservasHabitaciones';

import { updateUserProfile } from '../../services/CrudParaUsuarios';
import { getHabitaciones } from '../../services/CrudHabitaciones';
import './ClientePag.css';

// Importar imágenes de tours para el catálogo
import posada1 from '../VIDEOS Y IMG/posada1.jpg';
import posada2 from '../VIDEOS Y IMG/posada2.jpg';
import posada3 from '../VIDEOS Y IMG/posada3.jpg';
import posada4 from '../VIDEOS Y IMG/posada4.jpg';
import isla1 from '../VIDEOS Y IMG/isla1.jpg';
import isla2 from '../VIDEOS Y IMG/isla2.jpg';
import isla3 from '../VIDEOS Y IMG/isla3.jpg';
import isla4 from '../VIDEOS Y IMG/isla4.jpg';
import isla5 from '../VIDEOS Y IMG/isla5.jpg';
import habi1Img from '../VIDEOS Y IMG/Habi.1.webp';
import habi2Img from '../VIDEOS Y IMG/Habi.2.avif';
import chiraVistaImg from '../VIDEOS Y IMG/img-1019-2.jpg';
import chiraRefugioImg from '../VIDEOS Y IMG/img-0984-2.jpg';

const IMAGES_MAP = {
  't001': posada1, 't002': posada2, 't003': posada3, 't004': posada4,
  't005': isla1, 't006': isla2, 't007': isla3, 't008': isla4, 't009': isla5,
};

const ROOM_IMAGES_MAP = {
  hab001: habi1Img,
  hab002: chiraVistaImg,
  hab003: chiraRefugioImg,
  hab004: 'https://islavenado-cr.com/wp-content/uploads/2024/05/Cabinas-Atardecer-5.jpg',
  hab005: habi2Img,
  'glamping ecologico isla de chira': habi1Img,
  'habitacion brisa del golfo': chiraVistaImg,
  'eco-refugio del pescador': chiraRefugioImg,
  'habitacion vista al mar': 'https://islavenado-cr.com/wp-content/uploads/2024/05/Cabinas-Atardecer-5.jpg',
  'suite familiar raices': habi2Img,
};

const ROOM_DEFAULT_IMAGES = [
  'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600&q=80',
  'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600&q=80',
  'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=600&q=80',
  'https://images.unsplash.com/photo-1521783988139-89397d761dce?w=600&q=80'
];

const normalizeText = value =>
  (value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();

const isBrokenRoomImagePath = image =>
  !image ||
  image.trim() === '' ||
  image.startsWith('/src/') ||
  image.startsWith('src/');

const getRoomImage = (room, index = 0) => {
  if (!room) return ROOM_DEFAULT_IMAGES[index % ROOM_DEFAULT_IMAGES.length];

  if (!isBrokenRoomImagePath(room.imagen)) {
    return room.imagen;
  }

  return (
    ROOM_IMAGES_MAP[room.id] ||
    ROOM_IMAGES_MAP[normalizeText(room.nombre)] ||
    ROOM_DEFAULT_IMAGES[index % ROOM_DEFAULT_IMAGES.length]
  );
};

// Vista principal del cliente autenticado.
// Coordina catalogos, reservas, perfil y mensajeria dentro de una sola interfaz.
function ClientePag() {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('inicio');
  const [userName, setUserName] = useState('Cliente');
  const [reservas, setReservas] = useState([]);
  const [reservasHab, setReservasHab] = useState([]);
  const [allTours, setAllTours] = useState([]);
  const [allHabitaciones, setAllHabitaciones] = useState([]);
  const [loadingTours, setLoadingTours] = useState(true);
  const [loadingHab, setLoadingHab] = useState(true);

  const [allToursReservations, setAllToursReservations] = useState([]);
  const [allRoomsReservations, setAllRoomsReservations] = useState([]);


  // Estado para el formulario de nueva reserva de tour
  const [newReserva, setNewReserva] = useState({
    tour: '',
    fecha: '',
    horario: ''
  });

  // Estado para el formulario de nueva reserva de habitación
  const [newRoomReserva, setNewRoomReserva] = useState({
    roomId: '',
    roomName: '',
    checkIn: '',
    checkOut: '',
    time: '12:00 PM',
    price: 0
  });

  // Estados para edición de perfil
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState({
    name: '',
    photo: ''
  });

  // Estado para mensajes del cliente
  const [clientMessage, setClientMessage] = useState({ asunto: '', mensaje: '' });
  const [sendingMsg, setSendingMsg] = useState(false);
  const [userMessages, setUserMessages] = useState([]);

  const fetchUserMessages = async () => {
    const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
    if (storedUser.id) {
      try {
        const res = await fetch(`http://localhost:3007/formularioContacto?userId=${storedUser.id}`);
        const data = await res.json();
        setUserMessages(data.reverse());
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    }
  };

  useEffect(() => {
    if (activeTab === 'mensajes') {
      fetchUserMessages();
    }
  }, [activeTab]);

  const handleSendClientMessage = async (e) => {
    e.preventDefault();
    const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
    
    if (!clientMessage.mensaje.trim()) {
      Swal.fire({
        title: 'Mensaje vacío',
        text: 'Por favor escribe un mensaje antes de enviar.',
        icon: 'warning',
        confirmButtonColor: '#0d9488'
      });
      return;
    }

    setSendingMsg(true);
    try {
      const messageData = {
        nombre: storedUser.name || 'Cliente',
        email: storedUser.email || 'No disponible',
        asunto: clientMessage.asunto || 'Consulta General',
        mensaje: clientMessage.mensaje,
        createdAt: new Date().toISOString(),
        userId: storedUser.id,
        status: 'Pendiente'
      };

      await fetch('http://localhost:3007/formularioContacto', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(messageData)
      });

      Swal.fire({
        title: '¡Mensaje Enviado!',
        text: 'Tu mensaje ha sido enviado al administrador. Te responderemos pronto.',
        icon: 'success',
        confirmButtonColor: '#0d9488'
      });
      setClientMessage({ asunto: '', mensaje: '' });
      fetchUserMessages();
    } catch (error) {
      console.error("Error al enviar mensaje:", error);
      Swal.fire({
        title: 'Error',
        text: 'No se pudo enviar el mensaje en este momento.',
        icon: 'error',
        confirmButtonColor: '#ef4444'
      });
    } finally {
      setSendingMsg(false);
    }
  };

  useEffect(() => {
    // Verificar si venimos desde un botón de "Reservar" en un Tour
    if (location.state && location.state.tab) {
      setActiveTab(location.state.tab);
      if (location.state.selectedTour) {
        setNewReserva(prev => ({ ...prev, tour: location.state.selectedTour }));
      }
    }

    const fetchData = async () => {
      try {
        setLoadingTours(true);
        setLoadingHab(true);

        const [toursRes, habRes, allToursRes, allRoomsRes] = await Promise.all([
          getTours(),
          getHabitaciones(),
          getAllReservas(),
          getAllRoomReservas()
        ]);

        setAllTours(toursRes.filter(t => t.disponible));
        setAllHabitaciones(habRes);
        setAllToursReservations(allToursRes);
        setAllRoomsReservations(allRoomsRes);

        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          const user = JSON.parse(storedUser);
          if (user.name) setUserName(user.name);
          if (user.id) {
            const [resTours, resHab] = await Promise.all([
              getReservasByUser(user.id),
              getRoomReservasByUser(user.id)
            ]);
            setReservas(resTours);
            setReservasHab(resHab);
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoadingTours(false);
        setLoadingHab(false);
      }
    };

    fetchData();
  }, [location.state]);


  // Funciones de validación de disponibilidad
  const isTourDateAvailable = (tourName, date, time) => {
    if (!tourName || !date || !time) return true;
    return !allToursReservations.some(res => 
      res.tourName === tourName && 
      res.date === date && 
      res.time === time &&
      res.status !== 'Denegada'
    );
  };

  const isRoomRangeAvailable = (roomId, checkIn, checkOut) => {
    if (!roomId || !checkIn || !checkOut) return true;
    const start = new Date(checkIn);
    const end = new Date(checkOut);

    return !allRoomsReservations.some(res => {
      if (res.roomId !== roomId || res.status === 'Denegada') return false;
      const resStart = new Date(res.checkIn);
      const resEnd = new Date(res.checkOut);
      // Traslape si (StartA <= EndB) y (EndA >= StartB)
      return start < resEnd && end > resStart;
    });
  };
  const handleCreateReserva = async (e) => {
    e.preventDefault();
    const storedUser = JSON.parse(localStorage.getItem('user') || '{}');

    if (!newReserva.tour || !newReserva.fecha || !newReserva.horario) {
      Swal.fire({
        icon: 'warning',
        title: 'Campos incompletos',
        text: 'Por favor completa todos los campos para tu reserva de tour.',
        confirmButtonColor: '#0d9488'
      });
      return;
    }


    if (!isTourDateAvailable(newReserva.tour, newReserva.fecha, newReserva.horario)) {
      Swal.fire({
        icon: 'warning',
        title: 'Horario no disponible',
        text: 'Lo sentimos, este horario ya esta reservado para este tour. Por favor elige otra fecha u horario.',
        confirmButtonColor: '#0d9488'
      });
      return;
    }


    const reservaData = {
      userId: storedUser.id,
      userName: storedUser.name || storedUser.email,
      tourName: newReserva.tour,
      date: newReserva.fecha,
      time: newReserva.horario,
      status: 'Pendiente',
      createdAt: new Date().toISOString()
    };

    try {
      const added = await createReserva(reservaData);
      setReservas([...reservas, added]);
      setNewReserva({ tour: '', fecha: '', horario: '' });
      Swal.fire({
        icon: 'success',
        title: '¡Reserva Enviada!',
        text: 'Tu solicitud de reserva de tour ha sido enviada con éxito.',
        confirmButtonColor: '#0d9488'
      });
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Hubo un problema al enviar tu reserva. Por favor intenta de nuevo.',
        confirmButtonColor: '#0d9488'
      });
    }
  };

  const handleCreateRoomReserva = async (e) => {
    e.preventDefault();
    const storedUser = JSON.parse(localStorage.getItem('user') || '{}');

    if (!newRoomReserva.roomId || !newRoomReserva.checkIn || !newRoomReserva.checkOut) {
      Swal.fire({
        icon: 'warning',
        title: 'Campos incompletos',
        text: 'Por favor completa todos los campos obligatorios para la reserva de habitación.',
        confirmButtonColor: '#0d9488'
      });
      return;
    }


    if (new Date(newRoomReserva.checkIn) >= new Date(newRoomReserva.checkOut)) {
      Swal.fire({
        icon: 'warning',
        title: 'Fechas invalidas',
        text: 'La fecha de salida debe ser posterior a la de entrada.',
        confirmButtonColor: '#0d9488'
      });
      return;
    }

    if (!isRoomRangeAvailable(newRoomReserva.roomId, newRoomReserva.checkIn, newRoomReserva.checkOut)) {
      Swal.fire({
        icon: 'warning',
        title: 'Habitacion no disponible',
        text: 'Lo sentimos, la habitacion no esta disponible para las fechas seleccionadas.',
        confirmButtonColor: '#0d9488'
      });
      return;
    }


    const reservaData = {
      userId: storedUser.id,
      userName: storedUser.name || storedUser.email,
      roomId: newRoomReserva.roomId,
      roomName: newRoomReserva.roomName,
      checkIn: newRoomReserva.checkIn,
      checkOut: newRoomReserva.checkOut,
      time: newRoomReserva.time,
      price: newRoomReserva.price,
      status: 'Pendiente',
      createdAt: new Date().toISOString()
    };

    try {
      const added = await createRoomReserva(reservaData);
      setReservasHab([...reservasHab, added]);
      setNewRoomReserva({ roomId: '', roomName: '', checkIn: '', checkOut: '', time: '12:00 PM', price: 0 });
      Swal.fire({
        icon: 'success',
        title: '¡Reserva de Habitación Enviada!',
        text: 'Tu solicitud ha sido enviada con éxito. Revisa el historial para ver el estado.',
        confirmButtonColor: '#0d9488'
      });
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo enviar la reserva de habitación.',
        confirmButtonColor: '#0d9488'
      });
    }
  };

  const calculateTotalPrice = (roomId, checkIn, checkOut) => {
    const room = allHabitaciones.find(h => h.id === roomId);
    if (room && checkIn && checkOut) {
      const start = new Date(checkIn);
      const end = new Date(checkOut);
      const nights = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
      if (nights > 0) {
        return room.precio * nights;
      }
    }
    return 0;
  };


  const renderContent = () => {
    switch (activeTab) {
      case 'inicio':
        return (
          <div className="cliente-tab-content fade-in">
            <header className="welcome-header">
              <h1>¡Hola, {userName}! 👋</h1>
              <p>Bienvenido a tu panel personal de Raíces del Golfo.</p>
            </header>

            <div className="client-stats-grid">
              <div className="client-stat-card">
                <div className="stat-icon">📅</div>
                <div className="stat-info">
                  <h3>Próximo Viaje</h3>
                  <p>{reservasHab.length > 0 ? reservasHab[reservasHab.length - 1].checkIn : 'Aún sin reservas'}</p>
                </div>
              </div>
              <div className="client-stat-card">
                <div className="stat-icon">⭐</div>
                <div className="stat-info">
                  <h3>Puntos de Canjeo</h3>
                  <p>150 pts</p>
                </div>
              </div>
              <div className="client-stat-card">
                <div className="stat-icon">⛵</div>
                <div className="stat-info">
                  <h3>Tours Hechos</h3>
                  <p>{reservas.length}</p>
                </div>
              </div>
            </div>

            <section className="quick-actions">
              <h2>¿Qué te gustaría hacer hoy?</h2>
              <div className="actions-grid">
                <button className="action-card" onClick={() => setActiveTab('reservas')}>
                  <span className="action-emoji">🛶</span>
                  <span>Explorar Tours</span>
                </button>
                <button className="action-card" onClick={() => setActiveTab('hospedajes')}>
                  <span className="action-emoji">🏨</span>
                  <span>Ver Habitaciones</span>
                </button>
                <button className="action-card" onClick={() => setActiveTab('perfil')}>
                  <span className="action-emoji">👤</span>
                  <span>Mi Perfil</span>
                </button>
              </div>
            </section>
          </div>
        );
      case 'reservas': {
        const selectedTourInfo = allTours.find(t => t.nombre === newReserva.tour);
        const horariosDisponibles = ["08:00 AM", "10:00 AM", "01:00 PM", "03:00 PM"];

        return (
          <div className="cliente-tab-content fade-in">
            <div className="reservas-layout-new">
              <section className="booking-section">
                <div className="section-header-flex">
                  <h2>Solicitar Nueva Reserva</h2>
                  <p>Selecciona un tour para ver sus detalles antes de reservar.</p>
                </div>

                <div className="booking-container-flex">
                  <div className="booking-form-wrapper">
                    <form className="reserva-form-compact" onSubmit={handleCreateReserva}>
                      <div className="form-group">
                        <label>1. Selecciona tu aventura:</label>
                        <div className="tour-selection-mini">
                          {loadingTours ? (
                            <p>Cargando tours...</p>
                          ) : (
                            allTours.map(t => (
                              <div
                                key={t.id}
                                className={`tour-mini-option ${newReserva.tour === t.nombre ? 'selected' : ''}`}
                                onClick={() => setNewReserva({ ...newReserva, tour: t.nombre })}
                              >
                                <div className="mini-img"><img src={t.imagen || IMAGES_MAP[t.id] || posada1} alt={t.nombre} /></div>
                                <span className="mini-name">{t.nombre}</span>
                                {newReserva.tour === t.nombre && <div className="mini-check">✓</div>}
                              </div>
                            ))
                          )}
                        </div>
                      </div>

                      <div className="form-row-vertical">
                        <div className="form-group">
                          <label>2. ¿Cuándo vienes?</label>
                          <input
                            type="date"
                            className="input-custom-style"
                            min={new Date().toISOString().split('T')[0]}
                            value={newReserva.fecha}
                            onChange={(e) => setNewReserva({ ...newReserva, fecha: e.target.value })}
                            required
                          />
                        </div>

                        <div className="form-group">
                          <label>3. Elige el horario:</label>
                          <div className="time-slots-grid">
                            {horariosDisponibles.map(h => (
                              <div
                                key={h}
                                className={`time-slot ${newReserva.horario === h ? 'selected' : ''}`}
                                onClick={() => setNewReserva({ ...newReserva, horario: h })}
                              >
                                {h}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      {!isTourDateAvailable(newReserva.tour, newReserva.fecha, newReserva.horario) && (
                        <div className="availability-warning">
                          ⚠️ Este horario no está disponible.
                        </div>
                      )}

                      <button 
                        type="submit" 
                        className={`btn-booking-modern ${newReserva.tour && newReserva.fecha && newReserva.horario && isTourDateAvailable(newReserva.tour, newReserva.fecha, newReserva.horario) ? 'ready' : 'disabled'}`}
                        disabled={!isTourDateAvailable(newReserva.tour, newReserva.fecha, newReserva.horario)}
                      >
                        <span>RESERVAR AHORA</span>
                        <div className="btn-shine"></div>
                      </button>
                    </form>
                  </div>

                  <div className={`tour-preview-card ${selectedTourInfo ? 'active' : 'inactive'}`}>
                    {selectedTourInfo ? (
                      <>
                        <div className="preview-image-container">
                          <img src={selectedTourInfo.imagen || IMAGES_MAP[selectedTourInfo.id] || posada1} alt={selectedTourInfo.nombre} />
                          <div className="preview-price-badge">${selectedTourInfo.precio} USD</div>
                        </div>
                        <div className="preview-info">
                          <h3>{selectedTourInfo.nombre}</h3>
                          <p>{selectedTourInfo.descripcion}</p>
                        </div>
                      </>
                    ) : (
                      <div className="preview-placeholder">
                        <div className="placeholder-icon">📷</div>
                        <p>Selecciona un tour para ver la información aquí.</p>
                      </div>
                    )}
                  </div>
                </div>
              </section>

              <section className="history-section-visual">
                <div className="section-header-flex">
                  <h2>Mi Historial de Reservas</h2>
                  <p>Consulta el estado de tus aventuras solicitadas.</p>
                </div>

                {reservas.length === 0 ? (
                  <div className="empty-state-visual">
                    <div className="empty-icon">🌊</div>
                    <p>Aún no tienes ninguna aventura en tu historial.</p>
                  </div>
                ) : (
                  <div className="reservation-cards-grid">
                    {reservas.slice().reverse().map((res) => {
                      const tourInfo = allTours.find(t => t.nombre === res.tourName);
                      return (
                        <div className="reserva-card-item" key={res.id}>
                          <div className="reserva-card-img">
                            <img src={tourInfo ? (tourInfo.imagen || IMAGES_MAP[tourInfo.id] || posada1) : posada1} alt={res.tourName} />
                            <span className={`reserva-status-tag ${res.status.toLowerCase()}`}>
                              {res.status}
                            </span>
                          </div>
                          <div className="reserva-card-body">
                            <h3>{res.tourName}</h3>
                            <div className="reserva-meta">
                              <span>📅 {res.date}</span>
                              <span>⏰ {res.time}</span>
                            </div>
                            {tourInfo && <p className="reserva-desc-short">{tourInfo.descripcion.substring(0, 60)}...</p>}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </section>
            </div>
          </div>
        );
      }
      case 'hospedajes': {
        const selectedRoomInfo = allHabitaciones.find(h => h.id === newRoomReserva.roomId);
        return (
          <div className="cliente-tab-content fade-in">
            <div className="reservas-layout-new">
              {/* Nueva sección: Formulario de Reserva de Habitación */}
              <section className="booking-section">
                <div className="section-header-flex">
                  <h2>Reservar Habitación</h2>
                  <p>Selecciona tu habitación ideal y las fechas de tu estancia.</p>
                </div>

                <div className="booking-container-flex">
                  <div className="booking-form-wrapper">
                    <form className="reserva-form-compact" onSubmit={handleCreateRoomReserva}>
                      <div className="form-group">
                        <label>1. Elige tu habitación:</label>
                        <div className="tour-selection-mini">
                          {loadingHab ? (
                            <p>Cargando habitaciones...</p>
                          ) : (
                            allHabitaciones.map(h => (
                              <div
                                key={h.id}
                                className={`tour-mini-option ${newRoomReserva.roomId === h.id ? 'selected' : ''}`}
                                onClick={() => {
                                  const totalPrice = calculateTotalPrice(h.id, newRoomReserva.checkIn, newRoomReserva.checkOut);
                                  setNewRoomReserva({ ...newRoomReserva, roomId: h.id, roomName: h.nombre, price: totalPrice });
                                }}
                              >
                                <div className="mini-img">
                                  <img
                                    src={getRoomImage(h, allHabitaciones.findIndex(room => room.id === h.id))}
                                    alt={h.nombre}
                                    onError={e => {
                                      e.target.src = ROOM_DEFAULT_IMAGES[0];
                                    }}
                                  />
                                </div>
                                <span className="mini-name">{h.nombre}</span>
                                {newRoomReserva.roomId === h.id && <div className="mini-check">✓</div>}
                              </div>
                            ))
                          )}
                        </div>
                      </div>

                      <div className="form-row-vertical">
                        <div className="form-group">
                          <label>2. Fecha de Entrada (Check-in):</label>
                          <input
                            type="date"
                            className="input-custom-style"
                            min={new Date().toISOString().split('T')[0]}
                            value={newRoomReserva.checkIn}
                            onChange={(e) => {
                              const totalPrice = calculateTotalPrice(newRoomReserva.roomId, e.target.value, newRoomReserva.checkOut);
                              setNewRoomReserva({ ...newRoomReserva, checkIn: e.target.value, price: totalPrice });
                            }}
                            required
                          />
                        </div>

                        <div className="form-group">
                          <label>3. Fecha de Salida (Check-out):</label>
                          <input
                            type="date"
                            className="input-custom-style"
                            min={newRoomReserva.checkIn || new Date().toISOString().split('T')[0]}
                            value={newRoomReserva.checkOut}
                            onChange={(e) => {
                              const totalPrice = calculateTotalPrice(newRoomReserva.roomId, newRoomReserva.checkIn, e.target.value);
                              setNewRoomReserva({ ...newRoomReserva, checkOut: e.target.value, price: totalPrice });
                            }}
                            required
                          />
                        </div>

                        <div className="form-group">
                          <label>4. Hora de llegada aproximada:</label>
                          <input
                            type="time"
                            className="input-custom-style"
                            value={newRoomReserva.time}
                            onChange={(e) => setNewRoomReserva({ ...newRoomReserva, time: e.target.value })}
                          />
                        </div>
                      </div>

                      {newRoomReserva.price > 0 && (
                        <div className="price-preview-total">
                          <span>Total Estimado:</span>
                          <strong>${newRoomReserva.price} USD</strong>
                        </div>
                      )}

                      {!isRoomRangeAvailable(newRoomReserva.roomId, newRoomReserva.checkIn, newRoomReserva.checkOut) && (
                        <div className="availability-warning">
                          ⚠️ Fechas no disponibles para esta habitación.
                        </div>
                      )}

                      <button 
                        type="submit" 
                        className={`btn-booking-modern ${newRoomReserva.roomId && newRoomReserva.checkIn && newRoomReserva.checkOut && isRoomRangeAvailable(newRoomReserva.roomId, newRoomReserva.checkIn, newRoomReserva.checkOut) ? 'ready' : 'disabled'}`}
                        disabled={!isRoomRangeAvailable(newRoomReserva.roomId, newRoomReserva.checkIn, newRoomReserva.checkOut)}
                      >
                        <span>SOLICITAR RESERVA</span>
                        <div className="btn-shine"></div>
                      </button>
                    </form>
                  </div>

                  <div className={`tour-preview-card ${selectedRoomInfo ? 'active' : 'inactive'}`}>
                    {selectedRoomInfo ? (
                      <>
                        <div className="preview-image-container">
                          <img
                            src={getRoomImage(selectedRoomInfo, allHabitaciones.findIndex(room => room.id === selectedRoomInfo.id))}
                            alt={selectedRoomInfo.nombre}
                            onError={e => {
                              e.target.src = ROOM_DEFAULT_IMAGES[0];
                            }}
                          />
                          <div className="preview-price-badge">${selectedRoomInfo.precio} / noche</div>
                        </div>
                        <div className="preview-info">
                          <h3>{selectedRoomInfo.nombre}</h3>
                          <p><strong>Capacidad:</strong> {selectedRoomInfo.capacidad} personas</p>
                          <p>{selectedRoomInfo.descripcion}</p>
                        </div>
                      </>
                    ) : (
                      <div className="preview-placeholder">
                        <div className="placeholder-icon">🛏️</div>
                        <p>Selecciona una habitación para ver los detalles.</p>
                      </div>
                    )}
                  </div>
                </div>
              </section>

              {/* Historial de Reservas */}
              <section className="history-section-visual">
                <div className="section-header-flex">
                  <h2>Mis Reservas de Habitaciones</h2>
                  <p>Consulta el estado de tus estancias solicitadas.</p>
                </div>

                {reservasHab.length === 0 ? (
                  <div className="empty-state-visual">
                    <div className="empty-icon">🏠</div>
                    <p>Aún no tienes ninguna reserva de habitación en tu historial.</p>
                  </div>
                ) : (
                  <div className="reservation-cards-grid">
                    {reservasHab.slice().reverse().map((res) => {
                      const roomInfo = allHabitaciones.find(h => h.id === res.roomId || h.nombre === res.roomName);
                      return (
                        <div className="reserva-card-item" key={res.id}>
                          <div className="reserva-card-img">
                            <img
                              src={getRoomImage(roomInfo || { nombre: res.roomName }, allHabitaciones.findIndex(room => room.id === roomInfo?.id))}
                              alt={res.roomName}
                              onError={e => { e.target.src = ROOM_DEFAULT_IMAGES[0]; }}
                            />
                            <span className={`reserva-status-tag ${res.status.toLowerCase()}`}>
                              {res.status}
                            </span>
                          </div>
                          <div className="reserva-card-body">
                            <h3>{res.roomName}</h3>
                            <div className="reserva-meta">
                              <span>📅 {res.checkIn} al {res.checkOut}</span>
                              <span style={{ fontWeight: '700', color: '#0d9488' }}>💰 ${res.price} USD</span>
                            </div>
                            {res.time && <div className="small-text" style={{ marginTop: '5px' }}>⏰ LLegada: {res.time}</div>}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </section>
            </div>
          </div>
        );
      }
      case 'servicios':
        return (
          <div className="cliente-tab-content fade-in">
            <Opiniones />
          </div>
        );
      case 'perfil': {
        const currentUser = JSON.parse(localStorage.getItem('user') || '{}');

        const handleStartEditing = () => {
          setEditedUser({
            name: userName,
            photo: currentUser.photo || ''
          });
          setIsEditing(true);
        };

        const handleSaveProfile = async () => {
          try {
            const updated = await updateUserProfile(currentUser.id, editedUser);
            
            // Actualizar localStorage
            const newUser = { ...currentUser, ...updated };
            localStorage.setItem('user', JSON.stringify(newUser));
            
            // Actualizar estados locales
            setUserName(updated.name || userName);
            setIsEditing(false);
            Swal.fire({
              icon: 'success',
              title: 'Perfil Actualizado',
              text: 'Tus cambios han sido guardados correctamente.',
              confirmButtonColor: '#0d9488'
            });
          } catch (error) {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'No se pudo actualizar el perfil.',
              confirmButtonColor: '#ef4444'
            });
          }
        };

        return (
          <div className="cliente-tab-content fade-in">
            <h2>Mi Perfil</h2>
            <div className="profile-details-card">
              <div className="profile-header-info">
                {isEditing ? (
                  <div className="avatar-edit-container">
                    <div className="avatar-large">
                      {editedUser.photo && editedUser.photo.trim() !== '' ? (
                        <img src={editedUser.photo} alt="Profile" className="avatar-img" />
                      ) : (
                        (editedUser.name || '').substring(0, 2).toUpperCase()
                      )}
                    </div>
                    <div className="input-group-modern">
                      <label>URL de Foto de Perfil:</label>
                      <input 
                        type="text" 
                        value={editedUser.photo} 
                        onChange={(e) => setEditedUser({...editedUser, photo: e.target.value})}
                        placeholder="https://ejemplo.com/foto.jpg"
                        className="input-custom-style"
                      />
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="avatar-large">
                      {currentUser.photo && currentUser.photo.trim() !== '' ? (
                        <img src={currentUser.photo} alt="Profile" className="avatar-img" />
                      ) : (
                        (userName || '').substring(0, 2).toUpperCase()
                      )}
                    </div>
                    <div>
                      <h3>{userName}</h3>
                      <p>Cliente de Raíces del Golfo</p>
                    </div>
                  </>
                )}
              </div>
              
              <div className="details-list">
                <div className="detail-item">
                  <span className="detail-label">Nombre:</span>
                  {isEditing ? (
                    <input 
                      type="text" 
                      value={editedUser.name} 
                      onChange={(e) => setEditedUser({...editedUser, name: e.target.value})}
                      className="input-custom-style"
                    />
                  ) : (
                    <span className="detail-value">{userName}</span>
                  )}
                </div>
                <div className="detail-item">
                  <span className="detail-label">Email:</span>
                  <span className="detail-value">{currentUser.email || 'No disponible'}</span>
                </div>
                {!isEditing && (
                  <div className="detail-item">
                    <span className="detail-label">Rol:</span>
                    <span className="detail-value">{currentUser.role || 'Cliente'}</span>
                  </div>
                )}
              </div>
              
              <div className="profile-actions-footer">
                {isEditing ? (
                  <>
                    <button className="btn-save-modern" onClick={handleSaveProfile}>Guardar Cambios</button>
                    <button className="btn-cancel-modern" onClick={() => setIsEditing(false)}>Cancelar</button>
                  </>
                ) : (
                  <button className="btn-edit" onClick={handleStartEditing}>Editar Perfil</button>
                )}
              </div>
            </div>
          </div>
        );
      }
      case 'mensajes':
        return (
          <div className="cliente-tab-content fade-in">
            <header className="section-header-flex">
              <h2>Soporte y Consultas</h2>
              <p>Envíanos tus dudas y revisa las respuestas del administrador.</p>
            </header>

            <div className="soporte-layout" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginTop: '1.5rem' }}>
              <div className="contact-form-side">
                <form className="client-message-form" onSubmit={handleSendClientMessage} style={{ background: 'white', padding: '1.5rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                  <h3>Nueva Consulta</h3>
                  <div className="form-group" style={{ marginBottom: '1rem' }}>
                    <label>Asunto:</label>
                    <input 
                      type="text" 
                      placeholder="Ej: Duda sobre mi reserva"
                      value={clientMessage.asunto}
                      onChange={(e) => setClientMessage({...clientMessage, asunto: e.target.value})}
                      className="input-custom-style"
                    />
                  </div>
                  <div className="form-group" style={{ marginBottom: '1rem' }}>
                    <label>Mensaje:</label>
                    <textarea 
                      placeholder="Describe tu consulta aquí..."
                      value={clientMessage.mensaje}
                      onChange={(e) => setClientMessage({...clientMessage, mensaje: e.target.value})}
                      required
                      className="input-custom-style"
                      style={{ minHeight: '120px', resize: 'vertical' }}
                    ></textarea>
                  </div>
                  <button type="submit" className="btn-booking-modern ready" disabled={sendingMsg} style={{ width: '100%' }}>
                    {sendingMsg ? 'Enviando...' : 'ENVIAR CONSULTA'}
                  </button>
                </form>
                <div className="contact-info-mini-cards" style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                  <div style={{ flex: 1, padding: '1rem', background: '#f8fafc', borderRadius: '8px', textAlign: 'center' }}>
                    <span style={{ fontSize: '1.2rem' }}>📧</span>
                    <p style={{ margin: '5px 0 0', fontSize: '0.8rem', fontWeight: '600' }}>Email</p>
                  </div>
                  <div style={{ flex: 1, padding: '1rem', background: '#f8fafc', borderRadius: '8px', textAlign: 'center' }}>
                    <span style={{ fontSize: '1.2rem' }}>📞</span>
                    <p style={{ margin: '5px 0 0', fontSize: '0.8rem', fontWeight: '600' }}>WhatsApp</p>
                  </div>
                </div>
              </div>

              <div className="messages-history-side">
                <h3 style={{ marginBottom: '1rem' }}>Historial de Mensajes</h3>
                {userMessages.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '3rem', background: '#f8fafc', borderRadius: '12px', color: '#94a3b8' }}>
                    <p>No tienes mensajes anteriores.</p>
                  </div>
                ) : (
                  <div className="messages-list-scroll" style={{ maxHeight: '500px', overflowY: 'auto', paddingRight: '10px' }}>
                    {userMessages.map(msg => (
                      <div key={msg.id} className="message-thread" style={{ marginBottom: '1.5rem', padding: '1rem', background: 'white', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                        <div className="user-query">
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                            <strong style={{ color: '#0d9488' }}>{msg.asunto}</strong>
                            <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{new Date(msg.createdAt).toLocaleDateString()}</span>
                          </div>
                          <p style={{ margin: 0, fontSize: '0.9rem' }}>{msg.mensaje}</p>
                        </div>
                        {msg.respuestaAdmin ? (
                          <div className="admin-reply" style={{ marginTop: '1rem', padding: '1rem', background: '#f0fdfa', borderRadius: '8px', borderLeft: '4px solid #0d9488' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
                              <strong style={{ fontSize: '0.85rem', color: '#115e59' }}>Respuesta Administrativa:</strong>
                              <span style={{ fontSize: '0.7rem', color: '#5fb3b3' }}>{new Date(msg.respondidoAt).toLocaleDateString()}</span>
                            </div>
                            <p style={{ margin: 0, fontSize: '0.9rem', fontStyle: 'italic' }}>{msg.respuestaAdmin}</p>
                          </div>
                        ) : (
                          <div style={{ marginTop: '0.8rem', fontSize: '0.8rem', color: '#eab308', display: 'flex', alignItems: 'center', gap: '5px' }}>
                            <span>⏳ En espera de respuesta...</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="cliente-page-layout">
      <NavbarCliente />
      <div className="cliente-container">
        <aside className="cliente-sidebar">
          <ul className="client-nav-list">
            <li>
              <button
                className={`client-nav-btn ${activeTab === 'inicio' ? 'active' : ''}`}
                onClick={() => setActiveTab('inicio')}
              >
                <span className="nav-icon">🏠</span> Inicio
              </button>
            </li>
            <li>
              <button
                className={`client-nav-btn ${activeTab === 'reservas' ? 'active' : ''}`}
                onClick={() => setActiveTab('reservas')}
              >
                <span className="nav-icon">📋</span> Mis Tours
              </button>
            </li>
            <li>
              <button
                className={`client-nav-btn ${activeTab === 'hospedajes' ? 'active' : ''}`}
                onClick={() => setActiveTab('hospedajes')}
              >
                <span className="nav-icon">🛌</span> Habitaciones
              </button>
            </li>
            <li>
              <button
                className={`client-nav-btn ${activeTab === 'mensajes' ? 'active' : ''}`}
                onClick={() => setActiveTab('mensajes')}
              >
                <span className="nav-icon">📧</span> Soporte
              </button>
            </li>
            <li>
              <button
                className={`client-nav-btn ${activeTab === 'servicios' ? 'active' : ''}`}
                onClick={() => setActiveTab('servicios')}
              >
                <span className="nav-icon">⭐</span> Opiniones
              </button>
            </li>
            <li>
              <button
                className={`client-nav-btn ${activeTab === 'perfil' ? 'active' : ''}`}
                onClick={() => setActiveTab('perfil')}
              >
                <span className="nav-icon">👤</span> Mi Perfil
              </button>
            </li>
          </ul>
        </aside>

        <main className="cliente-main">

          {renderContent()}
        </main>
      </div>
    </div>
  );
}

export default ClientePag;
