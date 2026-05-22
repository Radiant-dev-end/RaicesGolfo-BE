import React from 'react';
import Swal from 'sweetalert2';
import { getAllReservas, updateReserva, deleteReserva } from '../../../services/CrudReservas';
import { getAllRoomReservas, updateRoomReserva, deleteRoomReserva } from '../../../services/CrudReservasHabitaciones';
import usePagination from '../../../hooks/usePagination';
import Pagination from '../../common/Pagination';
import './ReservasPanel.css';

function ReservasPanel() {
  const { 
    data: reservas, 
    loading, 
    page, 
    setPage, 
    totalPaginas,
    refresh: fetchReservas
  } = usePagination(async () => {
    const [toursData, roomsData] = await Promise.all([
      getAllReservas(),
      getAllRoomReservas()
    ]);

    // Etiquetar cada reserva con su tipo para diferenciar en la UI
    const tours = (toursData || []).map(r => ({ ...r, tipo: 'Tour', item: r.tourName }));
    const rooms = (roomsData || []).map(r => ({ ...r, tipo: 'Habitación', item: r.roomName, date: `${r.checkIn} al ${r.checkOut}` }));

    const allData = [...tours, ...rooms];

    // Ordenar por fecha de creación (más recientes primero)
    allData.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    return allData;
  }, 3); // LIMIT: 3 reservations per page

  const handleStatusUpdate = async (id, newStatus, tipo) => {
    const actionText = newStatus === 'Aprobada' ? 'aprobar' : 'denegar';
    
    const result = await Swal.fire({
      title: `¿${actionText.charAt(0).toUpperCase() + actionText.slice(1)} reserva?`,
      text: `¿Estás seguro de que deseas ${actionText} esta solicitud?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: newStatus === 'Aprobada' ? '#0d9488' : '#ef4444',
      cancelButtonColor: '#64748b',
      confirmButtonText: `Sí, ${actionText}`,
      cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
      try {
        const reservaToUpdate = reservas.find(r => r.id === id);
        const updatedData = { ...reservaToUpdate, status: newStatus };

        if (tipo === 'Habitación') {
          await updateRoomReserva(id, updatedData);
        } else {
          await updateReserva(id, updatedData);
        }

        await fetchReservas();
        Swal.fire({
          icon: 'success',
          title: '¡Actualizado!',
          text: `La reserva ha sido ${newStatus.toLowerCase()} con éxito.`,
          confirmButtonColor: '#0d9488'
        });
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo actualizar la reserva.',
          confirmButtonColor: '#0d9488'
        });
      }
    }
  };

  const handleDelete = async (id, tipo, itemName) => {
    const result = await Swal.fire({
      title: '¿Eliminar reserva?',
      text: `Se eliminará permanentemente la reserva de ${itemName}. Esta acción no se puede deshacer.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
      try {
        if (tipo === 'Habitación') {
          await deleteRoomReserva(id);
        } else {
          await deleteReserva(id);
        }

        await fetchReservas();
        Swal.fire({
          icon: 'success',
          title: 'Eliminado',
          text: 'La reserva ha sido eliminada correctamente.',
          confirmButtonColor: '#0d9488'
        });
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo eliminar la reserva.',
          confirmButtonColor: '#0d9488'
        });
      }
    }
  };

  if (loading) return <div className="loading">Cargando reservaciones...</div>;

  return (
    <div className="tab-content fade-in">
      <div className="panel-header">
        <h1>Gestión de Reservaciones</h1>
        <p>Revisa y aprueba las solicitudes de los clientes.</p>
      </div>

      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Cliente</th>
              <th>Tipo</th>
              <th>Servicio / Habitación</th>
              <th>Fecha / Estancia</th>
              <th>Horario</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {reservas.length === 0 ? (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center', padding: '40px' }}>
                  No hay solicitudes de reserva en este momento.
                </td>
              </tr>
            ) : (
              reservas.map((res) => {
                const resStatus = res.status || 'Pendiente';
                return (
                  <tr key={`${res.tipo}-${res.id}`}>
                    <td>
                      <div className="client-cell">
                        <strong>{res.userName}</strong>
                        <span className="user-id">ID: {res.userId}</span>
                      </div>
                    </td>
                    <td>
                      <span className={`badge-tipo ${res.tipo === 'Tour' ? 'tour' : 'room'}`}>
                        {res.tipo}
                      </span>
                    </td>
                    <td>{res.item}</td>
                    <td>{res.date}</td>
                    <td>{res.time || 'N/A'}</td>
                    <td>
                      <span className={`status-badge ${resStatus.toLowerCase()}`}>
                        {resStatus}
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons">
                        {resStatus === 'Pendiente' ? (
                          <>
                            <button
                              className="btn-approve"
                              onClick={() => handleStatusUpdate(res.id, 'Aprobada', res.tipo)}
                              title="Aprobar"
                            >
                              ✓
                            </button>
                            <button
                              className="btn-deny"
                              onClick={() => handleStatusUpdate(res.id, 'Denegada', res.tipo)}
                              title="Denegar"
                            >
                              ✕
                            </button>
                          </>
                        ) : (
                          <span className="action-complete">Procesada</span>
                        )}
                      <button
                        className="btn-delete-reserva"
                        onClick={() => handleDelete(res.id, res.tipo, res.item)}
                        title="Eliminar"
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <Pagination 
        paginaActual={page} 
        totalPaginas={totalPaginas} 
        onPageChange={setPage} 
      />
    </div>
  );
}

export default ReservasPanel;
