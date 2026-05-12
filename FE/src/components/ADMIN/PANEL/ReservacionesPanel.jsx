import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { getReservations, updateReservationStatus, deleteReservation } from '../../../services/CrudReservaciones';
import './AdminPanel.css'; // Reutilizamos estilos de tabla generales

const ReservacionesPanel = () => {
    const [reservas, setReservas] = useState([]);
    const [loading, setLoading] = useState(true);

    const cargarReservas = async () => {
        try {
            setLoading(true);
            const data = await getReservations();
            setReservas(data);
        } catch (error) {
            console.error("Error al cargar reservas:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        cargarReservas();
    }, []);

    const handleAction = async (id, status, currentStatus) => {
        if (currentStatus === status) return;

        const actionText = status === 'Aprobada' ? 'Aprobar' : 'Denegar';
        const result = await Swal.fire({
            title: `¿${actionText} reservación?`,
            text: `Esta acción cambiará el estado de la reserva y afectará los balances.`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: status === 'Aprobada' ? '#0d9488' : '#ef4444',
            cancelButtonColor: '#64748b',
            confirmButtonText: `Sí, ${actionText.toLowerCase()}`,
            cancelButtonText: 'Cancelar'
        });

        if (result.isConfirmed) {
            try {
                await updateReservationStatus(id, status);
                setReservas(prev => prev.map(r => r.id === id ? { ...r, status } : r));
                Swal.fire('¡Éxito!', `La reservación ha sido ${status.toLowerCase()}.`, 'success');
            } catch (error) {
                Swal.fire('Error', 'No se pudo actualizar la reservación.', 'error');
            }
        }
    };

    const handleEliminar = async (id) => {
        const result = await Swal.fire({
            title: '¿Eliminar registro?',
            text: "Esta acción no se puede deshacer.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            confirmButtonText: 'Sí, eliminar'
        });

        if (result.isConfirmed) {
            try {
                await deleteReservation(id);
                setReservas(prev => prev.filter(r => r.id !== id));
                Swal.fire('Eliminado', 'La reservación ha sido borrada.', 'success');
            } catch (error) {
                Swal.fire('Error', 'No se pudo eliminar la reservación.', 'error');
            }
        }
    };

    if (loading) return <div className="tab-content"><p>Cargando reservaciones...</p></div>;

    return (
        <div className="tab-content fade-in">
            <header className="panel-header">
                <div>
                    <h1>Gestión de Reservaciones</h1>
                    <p>Apruebe o deniegue las solicitudes de los clientes para actualizar el balance real.</p>
                </div>
            </header>

            <div className="table-responsive">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>Cliente</th>
                            <th>Habitación</th>
                            <th>Precio</th>
                            <th>Fecha Reserva</th>
                            <th>Estado</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {reservas.length > 0 ? (
                            reservas.map(res => (
                                <tr key={res.id}>
                                    <td>
                                        <div className="user-info">
                                            <strong>{res.userName}</strong>
                                            <div className="small-text">ID: {res.userId}</div>
                                        </div>
                                    </td>
                                    <td>{res.habName}</td>
                                    <td><strong>${res.precio}</strong></td>
                                    <td>{res.fecha}</td>
                                    <td>
                                        <span className={`badge-status ${res.status?.toLowerCase()}`}>
                                            {res.status}
                                        </span>
                                    </td>
                                    <td>
                                        <button 
                                            className="btn-action edit" 
                                            onClick={() => handleAction(res.id, 'Aprobada', res.status)}
                                            disabled={res.status === 'Aprobada'}
                                            title="Aprobar"
                                        >
                                            Aprobar
                                        </button>
                                        <button 
                                            className="btn-action delete" 
                                            onClick={() => handleAction(res.id, 'Denegada', res.status)}
                                            disabled={res.status === 'Denegada'}
                                            title="Denegar"
                                        >
                                            Denegar
                                        </button>
                                        <button 
                                            className="btn-action" 
                                            style={{ borderColor: '#64748b', color: '#64748b' }}
                                            onClick={() => handleEliminar(res.id)}
                                            title="Borrar"
                                        >
                                            🗑️
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" className="no-results">No hay reservaciones registradas.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ReservacionesPanel;
