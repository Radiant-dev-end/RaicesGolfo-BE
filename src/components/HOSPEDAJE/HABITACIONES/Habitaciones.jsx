import { useEffect, useState } from 'react';
import { ENDPOINTS } from '../../../config/api';
import './Habitaciones.css';
import ReservaModal from '../../MODAL/ReservaModal';
import { WHATSAPP_HABITACIONES } from '../../../config/whatsapp';
import habi1Img from '../../VIDEOS Y IMG/Habi.1.webp';
import habi2Img from '../../VIDEOS Y IMG/Habi.2.avif';
import chiraVistaImg from '../../VIDEOS Y IMG/img-1019-2.jpg';
import chiraRefugioImg from '../../VIDEOS Y IMG/img-0984-2.jpg';

const habitacionesEstaticas = [
  {
    id: 'static-1',
    nombre: 'Glamping Ecologico Isla de Chira',
    descripcion:
      'Vive la experiencia de acampar con lujo en el corazon de Isla de Chira. Estructuras elevadas con vistas inigualables al Golfo de Nicoya.',
    precio: 85,
    capacidad: 2,
    amenidades: ['Cama Queen', 'Iluminacion Solar', 'Terraza Privada', 'Desayuno Tipico', 'Senderos cercanos'],
    status: 'disponible',
    imagenes: [habi1Img],
  },
  {
    id: 'static-2',
    nombre: 'Habitacion Brisa del Golfo',
    descripcion:
      'Habitacion amplia con ventanales grandes para disfrutar de la brisa marina. Ubicada a pocos pasos de la costa.',
    precio: 110,
    capacidad: 4,
    amenidades: ['2 Camas Matrimoniales', 'Ventilador Potente', 'Bano Privado', 'Hamacas en exterior', 'Cerca del muelle'],
    status: 'disponible',
    imagenes: [chiraVistaImg],
  },
  {
    id: 'static-3',
    nombre: 'Eco-Refugio del Pescador',
    descripcion:
      'Sumergete en la cultura local en este refugio construido con maderas locales y tecnicas tradicionales de la isla.',
    precio: 70,
    capacidad: 2,
    amenidades: ['Cama Matrimonial', 'Decoracion Artesanal', 'Vistas al manglar', 'Guia de pesca incluido', 'Ambiente tranquilo'],
    status: 'disponible',
    imagenes: [chiraRefugioImg],
  },
  {
    id: 'static-4',
    nombre: 'Habitacion Vista al Mar',
    descripcion:
      'Disfruta de una vista espectacular al mar desde tu ventana. Habitacion equipada con todo lo necesario para tu comodidad.',
    precio: 95,
    capacidad: 3,
    amenidades: ['Cama Matrimonial', 'Balcon', 'Aire Acondicionado', 'TV por cable', 'Vistas al mar'],
    status: 'disponible',
    imagenes: ['https://islavenado-cr.com/wp-content/uploads/2024/05/Cabinas-Atardecer-5.jpg'],
  },
  {
    id: 'static-5',
    nombre: 'Suite Familiar Raices',
    descripcion:
      'Espacio ideal para familias que buscan comodidad y cercania a la naturaleza en un entorno seguro y espacioso.',
    precio: 150,
    capacidad: 5,
    amenidades: ['Camas King y Individuales', 'Cocineta equipada', 'Area de estar familiar', 'Vistas al jardin', 'Wifi en areas comunes'],
    status: 'disponible',
    imagenes: [habi2Img],
  },
  {
    id: 'static-6',
    nombre: 'Refugio Historico San Lucas',
    descripcion:
      'Ideal para quienes buscan descanso, aventura y un toque de historia en la antigua isla prision, hoy santuario de vida silvestre.',
    precio: 120,
    capacidad: 4,
    amenidades: ['Camas Matrimoniales', 'Decoracion Tematica', 'Tour historico opcional', 'Ventilacion Natural', 'Balcon con vista'],
    status: 'disponible',
    imagenes: ['https://a0.muscache.com/im/pictures/miso/Hosting-963071887857759256/original/ea191874-8dbd-461b-a48e-5c8901893413.jpeg'],
  },
  {
    id: 'static-7',
    nombre: 'Cabana Serena Isla Caballo',
    descripcion:
      'Rodeada de aguas calidas y paisajes naturales, ofrece playas serenas y la oportunidad de desconectarse del ritmo acelerado.',
    precio: 110,
    capacidad: 4,
    amenidades: ['Cama King', 'Frente al Mar', 'Hamacas Privadas', 'Cocina de lena', 'Ambiente de retiro'],
    status: 'disponible',
    imagenes: ['https://a0.muscache.com/im/pictures/4ac2fa8a-7fe5-47e5-beb3-3df2823f2734.jpg'],
  },
];

const IMAGENES_DEFECTO = [
  'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600&q=80',
  'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600&q=80',
  'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=600&q=80',
  'https://images.unsplash.com/photo-1521783988139-89397d761dce?w=600&q=80',
  'https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=600&q=80',
  'https://images.unsplash.com/photo-1540518614846-7eded433c457?w=600&q=80',
  'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=600&q=80',
  'https://images.unsplash.com/photo-1505693314120-0d443867891c?w=600&q=80',
];

const normalizarTexto = valor =>
  (valor ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();

function Habitaciones() {
  const [habitacionesAdmin, setHabitacionesAdmin] = useState([]);
  const [roomReservations, setRoomReservations] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [habitacionSeleccionada, setHabitacionSeleccionada] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [habitacionesRes, reservasRes] = await Promise.all([
          fetch(ENDPOINTS.HABITACIONES),
          fetch(ENDPOINTS.RESERVAS_HABITACIONES),
        ]);

        const habitacionesData = await habitacionesRes.json();
        const reservasData = await reservasRes.json();
        const disponibles = Array.isArray(habitacionesData)
          ? habitacionesData.filter(habitacion => habitacion.status === 'disponible')
          : [];

        setHabitacionesAdmin(disponibles);
        setRoomReservations(Array.isArray(reservasData) ? reservasData : []);
      } catch {
        setHabitacionesAdmin([]);
        setRoomReservations([]);
      } finally {
        setCargando(false);
      }
    };

    fetchData();
  }, []);

  const checkOccupied = (roomId, roomNombre) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const roomNombreNormalizado = normalizarTexto(roomNombre);

    return roomReservations.some(res => {
      const matches =
        res.roomId === roomId || normalizarTexto(res.roomName) === roomNombreNormalizado;
      if (!matches || res.status !== 'Aprobada') {
        return false;
      }

      const checkIn = new Date(res.checkIn);
      const checkOut = new Date(res.checkOut);
      checkIn.setHours(0, 0, 0, 0);
      checkOut.setHours(0, 0, 0, 0);

      return today >= checkIn && today < checkOut;
    });
  };

  const todasLasHabitaciones = habitacionesEstaticas.map(staticHab => {
    const adminData = habitacionesAdmin.find(
      h => normalizarTexto(h.nombre) === normalizarTexto(staticHab.nombre)
    );

    const isManualDisabled = adminData ? adminData.disponible === false : false;
    const isNowOccupied = checkOccupied(adminData?.id, staticHab.nombre);

    return {
      ...staticHab,
      disponible: !isManualDisabled && !isNowOccupied,
      isManualDisabled,
      isNowOccupied,
    };
  });

  const nombresEstaticos = new Set(habitacionesEstaticas.map(h => normalizarTexto(h.nombre)));
  const habitacionesNuevas = habitacionesAdmin
    .filter(h => !nombresEstaticos.has(normalizarTexto(h.nombre)))
    .map(h => ({
      ...h,
      isManualDisabled: h.disponible === false,
      isNowOccupied: checkOccupied(h.id, h.nombre),
      disponible: h.disponible !== false && !checkOccupied(h.id, h.nombre),
    }));

  const listaCompleta = [...todasLasHabitaciones, ...habitacionesNuevas];

  const handleReservar = habitacion => {
    setHabitacionSeleccionada(habitacion);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setHabitacionSeleccionada(null);
  };

  return (
    <>
      <div className="habitaciones-grid">
        {listaCompleta.map((hab, index) => (
          <div key={hab.id} className="habitacion-card">
            <div className="hab-image-container">
              <h5 className="hab-status">{hab.status}</h5>
              <img
                src={hab.imagenes ? hab.imagenes[0] : hab.imagen || IMAGENES_DEFECTO[index % IMAGENES_DEFECTO.length]}
                alt={hab.nombre}
                onError={e => {
                  e.target.src = IMAGENES_DEFECTO[0];
                }}
              />
              <div className="hab-price">${hab.precio}/noche</div>
            </div>

            <div className="hab-info">
              <div className="hab-header-info">
                <h3>{hab.nombre}</h3>
                <span
                  className={`availability-badge ${hab.isManualDisabled ? 'unavailable' : hab.isNowOccupied ? 'occupied' : 'available'}`}
                >
                  {hab.isManualDisabled ? '* No Disponible' : hab.isNowOccupied ? '* Ocupada' : '* Disponible'}
                </span>
              </div>

              <p>{hab.descripcion || hab.description}</p>

              {hab.amenidades && hab.amenidades.length > 0 && (
                <div className="hab-amenidades">
                  {hab.amenidades.map((amenidad, amenidadIndex) => (
                    <span key={amenidadIndex} className="amenidad-tag">
                      {amenidad}
                    </span>
                  ))}
                </div>
              )}

              {!hab.imagenes && (
                <div className="hab-amenidades">
                  <span className="amenidad-tag">Capacidad: {hab.capacidad} personas</span>
                  <span className="amenidad-tag">{hab.tipo}</span>
                </div>
              )}

              <button
                className="btn-reservar-hab"
                onClick={() => handleReservar(hab)}
                disabled={hab.disponible === false}
              >
                {hab.isManualDisabled ? 'No Disponible' : hab.isNowOccupied ? 'Habitacion Ocupada' : 'Reservar Habitacion'}
              </button>
            </div>
          </div>
        ))}

        {cargando && (
          <p style={{ gridColumn: '1 / -1', textAlign: 'center', color: '#64748b' }}>
            Cargando habitaciones adicionales...
          </p>
        )}
      </div>

      {habitacionSeleccionada && (
        <ReservaModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          tourName={habitacionSeleccionada.nombre}
          whatsappNumber={WHATSAPP_HABITACIONES}
        />
      )}
    </>
  );
}

export default Habitaciones;
