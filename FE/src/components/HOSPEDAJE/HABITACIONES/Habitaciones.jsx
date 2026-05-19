import { useEffect, useState } from 'react';
import { ENDPOINTS } from '../../../config/api';
import usePagination from '../../../hooks/usePagination'; // IMPORTANTE
import Pagination from '../../common/Pagination';       // IMPORTANTE
import './Habitaciones.css';
import ReservaModal from '../../MODAL/ReservaModal';
import { WHATSAPP_HABITACIONES } from '../../../config/whatsapp';
import habi1Img from '../../VIDEOS Y IMG/Habi.1.webp';
import habi2Img from '../../VIDEOS Y IMG/Habi.2.avif';
import chiraVistaImg from '../../VIDEOS Y IMG/img-1019-2.jpg';
import chiraRefugioImg from '../../VIDEOS Y IMG/img-0984-2.jpg';

const FILTROS_AMENIDADES = [
  "Cama Queen", "Iluminacion Solar", "Terraza Privada", "Cama King",
  "Frente al Mar", "Cocina de lena", "Balcon con vista", "Balcon",
  "Vistas al mar", "TV por cable", "Ventilacion Natural", "Hamacas Privadas",
  "Decoracion Tematica", "Tour historico opcional", "Area de estar familiar",
  "cama individual", "Ambiente de retiro"
];

// ... (habitacionesEstaticas e IMAGENES_DEFECTO se mantienen igual)

const normalizarTexto = valor =>
  (valor ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();

function Habitaciones() {
  const [roomReservations, setRoomReservations] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [habitacionSeleccionada, setHabitacionSeleccionada] = useState(null);
  const [filtrosActivos, setFiltrosActivos] = useState([]);
  const [searchNombre, setSearchNombre] = useState('');

  // Paginación vinculada a la carga de datos unificada
  const {
    data: listaPaginada,
    loading: cargando,
    page,
    setPage,
    totalPaginas,
  } = usePagination(async () => {
    try {
      const [habitacionesRes, reservasRes] = await Promise.all([
        fetch(ENDPOINTS.HABITACIONES),
        fetch(ENDPOINTS.RESERVAS_HABITACIONES),
      ]);

      const habitacionesAdmin = await habitacionesRes.json();
      const reservasData = await reservasRes.json();
      const currentReservations = Array.isArray(reservasData) ? reservasData : [];
      setRoomReservations(currentReservations);

      const checkOccupied = (roomId, roomNombre) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const roomNombreNormalizado = normalizarTexto(roomNombre);

        return currentReservations.some(res => {
          const matches = res.roomId === roomId || normalizarTexto(res.roomName) === roomNombreNormalizado;
          if (!matches || res.status !== 'Aprobada') return false;
          const checkIn = new Date(res.checkIn);
          const checkOut = new Date(res.checkOut);
          checkIn.setHours(0, 0, 0, 0);
          checkOut.setHours(0, 0, 0, 0);
          return today >= checkIn && today < checkOut;
        });
      };

      // Unificar estáticas y dinámicas
      const todasLasEstaticas = habitacionesEstaticas.map(staticHab => {
        const adminData = habitacionesAdmin.find(h => normalizarTexto(h.nombre) === normalizarTexto(staticHab.nombre));
        return {
          ...staticHab,
          isManualDisabled: adminData ? adminData.disponible === false : false,
          isNowOccupied: checkOccupied(adminData?.id, staticHab.nombre),
          disponible: (adminData ? adminData.disponible !== false : true) && !checkOccupied(adminData?.id, staticHab.nombre),
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

      return [...todasLasEstaticas, ...habitacionesNuevas];
    } catch (err) {
      return habitacionesEstaticas;
    }
  }, 100); // Traemos "todos" para filtrar localmente o ajusta el limite

  // --- Lógica de Filtrado (Sobre la data que devuelve el hook) ---
  const listaFiltrada = listaPaginada.filter(hab => {
    const matchNombre = searchNombre === '' || normalizarTexto(hab.nombre).includes(normalizarTexto(searchNombre));
    if (!matchNombre) return false;

    if (filtrosActivos.length === 0) return true;
    const todasLasCaracteristicas = [
      ...(hab.amenidades || []),
      ...(hab.features ? (typeof hab.features === 'string' ? JSON.parse(hab.features) : hab.features) : [])
    ].map(normalizarTexto);

    return filtrosActivos.every(filtro => {
      const filtroNormalizado = normalizarTexto(filtro);
      return todasLasCaracteristicas.some(c => c.includes(filtroNormalizado));
    });
  });

  // --- Lógica de Paginación Local ---
  // Dado que los filtros ocurren en el cliente, paginamos el resultado filtrado
  const ITEMS_PER_PAGE = 4;
  const totalPaginasFiltradas = Math.ceil(listaFiltrada.length / ITEMS_PER_PAGE);
  const offset = (page - 1) * ITEMS_PER_PAGE;
  const itemsVisualizados = listaFiltrada.slice(offset, offset + ITEMS_PER_PAGE);

  const handleToggleFiltro = (filtro) => {
    setPage(1); // Reiniciar a página 1 al filtrar
    setFiltrosActivos(prev => prev.includes(filtro) ? prev.filter(f => f !== filtro) : [...prev, filtro]);
  };

  const clearFiltros = () => {
    setPage(1);
    setFiltrosActivos([]);
    setSearchNombre('');
  };

  const handleReservar = habitacion => {
    setHabitacionSeleccionada(habitacion);
    setIsModalOpen(true);
  };

  return (
    <>
      <div className="filtros-wrapper">
        <div className="search-habitacion-container">
          <i className="icon-search-hab">🔍</i>
          <input
            type="text"
            placeholder="Buscar habitación por nombre..."
            className="search-habitacion-input"
            value={searchNombre}
            onChange={(e) => { setSearchNombre(e.target.value); setPage(1); }}
          />
        </div>

        <div className="filtros-header">
          <h3>Filtrar por Características:</h3>
          {filtrosActivos.length > 0 && <button className="btn-limpiar-filtros" onClick={clearFiltros}>Limpiar ({filtrosActivos.length})</button>}
        </div>
        <div className="filtros-carousel">
          {FILTROS_AMENIDADES.map((filtro, index) => (
            <button
              key={index}
              className={`filtro-pill ${filtrosActivos.includes(filtro) ? 'activo' : ''}`}
              onClick={() => handleToggleFiltro(filtro)}
            >
              {filtro}
            </button>
          ))}
        </div>
      </div>

      <div className="habitaciones-grid">
        {itemsVisualizados.map((hab, index) => (
          <div key={hab.id} className="habitacion-card">
            {/* ... Contenido de la card (Igual al tuyo) ... */}
            <div className="hab-image-container">
              <h5 className="hab-status">{hab.status}</h5>
              <img src={hab.imagenes ? hab.imagenes[0] : hab.imagen || IMAGENES_DEFECTO[index % IMAGENES_DEFECTO.length]} alt={hab.nombre} />
              <div className="hab-price">${hab.precio}/noche</div>
            </div>
            <div className="hab-info">
              <div className="hab-header-info">
                <h3>{hab.nombre}</h3>
                <span className={`availability-badge ${hab.isManualDisabled ? 'unavailable' : hab.isNowOccupied ? 'occupied' : 'available'}`}>
                  {hab.isManualDisabled ? '* No Disponible' : hab.isNowOccupied ? '* Ocupada' : '* Disponible'}
                </span>
              </div>
              <p>{hab.descripcion || hab.description}</p>
              <button className="btn-reservar-hab" onClick={() => handleReservar(hab)} disabled={hab.disponible === false}>
                {hab.isManualDisabled ? 'No Disponible' : hab.isNowOccupied ? 'Habitacion Ocupada' : 'Reservar Habitacion'}
              </button>
            </div>
          </div>
        ))}

        {cargando && <p style={{ gridColumn: '1 / -1', textAlign: 'center' }}>Cargando...</p>}

        {!cargando && listaFiltrada.length === 0 && (
          <div className="no-rooms-found" style={{ gridColumn: '1 / -1', textAlign: 'center' }}>
            <h3>No se encontraron habitaciones</h3>
            <button className="btn-limpiar-filtros" onClick={clearFiltros}>Quitar Filtros</button>
          </div>
        )}
      </div>

      <Pagination
        paginaActual={page}
        totalPaginas={totalPaginasFiltradas}
        onPageChange={setPage}
      />

      {habitacionSeleccionada && (
        <ReservaModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          tourName={habitacionSeleccionada.nombre}
          whatsappNumber={WHATSAPP_HABITACIONES}
        />
      )}
    </>
  );
}

export default Habitaciones;