import React from 'react';
import Swal from 'sweetalert2';
import { ENDPOINTS } from '../../../config/api';
import usePagination from '../../../hooks/usePagination';
import Pagination from '../../common/Pagination';
import './ReservasPanel.css'; 

function MensajesPanel() {
    const { 
        data: messages, 
        loading, 
        page, 
        setPage, 
        totalPaginas,
        refresh: fetchMessages
    } = usePagination(async () => {
        const response = await fetch(ENDPOINTS.CONTACTOS);
        const data = await response.json();
        return Array.isArray(data) ? [...data].reverse() : [];
    }, 3); // LIMIT: 3 messages per page

    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: 'Eliminar mensaje',
            text: 'Esta accion no se puede deshacer.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Si, eliminar',
            cancelButtonText: 'Cancelar',
            confirmButtonColor: '#dc2626',
            cancelButtonColor: '#64748b'
        });

        if (!result.isConfirmed) return;

        try {
            await fetch(`${ENDPOINTS.CONTACTOS}/${id}`, { method: 'DELETE' });
            setMessages(messages.filter(m => m.id !== id));
            Swal.fire({
                icon: 'success',
                title: 'Mensaje eliminado',
                text: 'El mensaje fue eliminado correctamente.',
                confirmButtonColor: '#0d9488'
            });
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'No se pudo eliminar el mensaje.',
                confirmButtonColor: '#ef4444'
            });
        }
    };

    if (loading) return <div className="loading">Cargando mensajes...</div>;

    return (
        <div className="tab-content fade-in">
            <div className="panel-header">
                <h1>Mensajes de Contacto</h1>
                <p>Gestiona las consultas recibidas a traves del formulario de contacto.</p>
            </div>

            <div className="admin-table-container">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>Nombre</th>
                            <th>Email</th>
                            <th>Asunto / Mensaje</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {messages.length === 0 ? (
                            <tr>
                                <td colSpan="4" style={{ textAlign: 'center', padding: '40px' }}>
                                    No hay mensajes de contacto en este momento.
                                </td>
                            </tr>
                        ) : (
                            messages.map((msg) => (
                                <tr key={msg.id}>
                                    <td><strong>{msg.nombre}</strong></td>
                                    <td>{msg.email}</td>
                                    <td>
                                        <div className="msg-content">
                                            {msg.mensaje}
                                        </div>
                                    </td>
                                    <td>
                                        <div className="action-buttons">
                                            <button
                                                className="btn-deny"
                                                onClick={() => handleDelete(msg.id)}
                                                title="Eliminar mensaje"
                                            >
                                                X
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
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

export default MensajesPanel;
