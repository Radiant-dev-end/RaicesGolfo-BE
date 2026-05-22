import React, { useState } from 'react';
import Swal from 'sweetalert2';
import {
    getHabitaciones,
    createHabitacion,
    updateHabitacion,
    deleteHabitacion,
} from '../../../services/CrudHabitaciones';
import usePagination from '../../../hooks/usePagination';
import Pagination from '../../common/Pagination';
import './AdminPanel.css'; 

const TIPO_OPCIONES = ['Estándar', 'Deluxe', 'Suite', 'Cabaña', 'Familiar'];

const FORM_INICIAL = {
    nombre: '',
    descripcion: '',
    precio: '',
    capacidad: '',
    tipo: 'Estándar',
    disponible: true,
    status: 'disponible',
    features: ['WiFi'],
    imagen: '',
};

const HabitacionesPanel = () => {
    const { 
        data: habitaciones, 
        loading, 
        page, 
        setPage, 
        totalPaginas,
        refresh: cargarHabitaciones
    } = usePagination(() => getHabitaciones(), 3); // LIMIT: 3 rooms per page

    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [modalOpen, setModalOpen] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [form, setForm] = useState(FORM_INICIAL);
    const [formError, setFormError] = useState('');
    const [saving, setSaving] = useState(false);

    const filtradas = habitaciones.filter(h =>
        (h.nombre || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (h.tipo || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

    const abrirNueva = () => {
        setEditingId(null);
        setForm(FORM_INICIAL);
        setFormError('');
        setModalOpen(true);
    };

    const abrirEditar = (hab) => {
        setEditingId(hab.id);
        setForm({
            nombre: hab.nombre,
            descripcion: hab.descripcion,
            precio: hab.precio,
            capacidad: hab.capacidad,
            tipo: hab.tipo,
            disponible: hab.disponible,
            status: hab.status || 'disponible',
            features: hab.features || [],
            imagen: hab.imagen || '',
        });
        setFormError('');
        setModalOpen(true);
    };

    const cerrarModal = () => {
        setModalOpen(false);
        setEditingId(null);
        setForm(FORM_INICIAL);
        setFormError('');
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleFeaturesChange = (e) => {
        const { value } = e.target;
        setForm(prev => ({
            ...prev,
            features: value.split(',').map(f => f.trim()).filter(f => f !== '')
        }));
    };

    const handleGuardar = async (e) => {
        e.preventDefault();
        if (!form.nombre.trim() || !form.precio || !form.capacidad) {
            Swal.fire({ icon: 'warning', title: 'Campos incompletos', text: 'Por favor complete todos los campos obligatorios.', confirmButtonColor: '#0d9488' });
            return;
        }

        try {
            setSaving(true);
            const payload = {
                ...form,
                precio: Number(form.precio),
                capacidad: Number(form.capacidad),
            };

            if (editingId) {
                await updateHabitacion(editingId, { ...payload, id: editingId });
                cargarHabitaciones(); // Recargar desde el hook
                Swal.fire({ icon: 'success', title: '¡Actualizada!', text: 'La habitación fue actualizada correctamente.', confirmButtonColor: '#0d9488' });
            } else {
                await createHabitacion(payload);
                cargarHabitaciones(); // Recargar desde el hook
                Swal.fire({ icon: 'success', title: '¡Creada!', text: 'La habitación fue registrada correctamente.', confirmButtonColor: '#0d9488' });
            }
            cerrarModal();
        } catch (err) {
            Swal.fire({ icon: 'error', title: 'Error al guardar', text: err.message || 'Ocurrió un error al guardar. Intente nuevamente.', confirmButtonColor: '#ef4444' });
        } finally {
            setSaving(false);
        }
    };

    const handleEliminar = async (id, nombre) => {
        const result = await Swal.fire({
            title: '¿Eliminar habitación?',
            text: `"${nombre}" será eliminada permanentemente.`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            cancelButtonColor: '#64748b',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar',
        });

        if (result.isConfirmed) {
            try {
                await deleteHabitacion(id);
                cargarHabitaciones(); // Recargar desde el hook
                Swal.fire({ icon: 'success', title: '¡Eliminada!', text: 'La habitación fue eliminada.', confirmButtonColor: '#0d9488' });
            } catch {
                Swal.fire('Error', 'Hubo un error al eliminar la habitación.', 'error');
            }
        }
    };

    if (loading) return <div className="tab-content"><p>Cargando habitaciones...</p></div>;
    if (error) return <div className="tab-content"><p className="error">{error}</p></div>;

    return (
        <div className="tab-content fade-in">
            <header className="panel-header">
                <div>
                    <h1>Gestión de Habitaciones</h1>
                    <p>Añada, edite o elimine habitaciones del inventario.</p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', width: '100%' }}>
                    <div className="search-container" style={{ flex: 1 }}>
                        <i className="icon-search">🔍</i>
                        <input
                            type="text"
                            placeholder="Buscar por nombre o tipo..."
                            className="search-input"
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button
                        className="btn-nueva-hab"
                        onClick={abrirNueva}
                        title="Nueva Habitación"
                        style={{
                            width: '42px',
                            height: '42px',
                            borderRadius: '50%',
                            background: '#0d9488',
                            color: 'white',
                            border: 'none',
                            fontSize: '1.5rem',
                            lineHeight: '1',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                            transition: 'background 0.3s ease, transform 0.2s ease',
                            boxShadow: '0 2px 6px rgba(13,148,136,0.3)',
                        }}
                        onMouseEnter={e => { e.currentTarget.style.background = '#0f766e'; e.currentTarget.style.transform = 'scale(1.1)'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = '#0d9488'; e.currentTarget.style.transform = 'scale(1)'; }}
                    >
                        +
                    </button>
                </div>
            </header>

            <div className="table-responsive">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>Nombre</th>
                            <th>Tipo</th>
                            <th>Precio</th>
                            <th>Capacidad</th>
                            <th>Estado</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtradas.length > 0 ? (
                            filtradas.map(hab => (
                                <tr key={hab.id}>
                                    <td>
                                        <div className="user-info">
                                            <strong>{hab.nombre}</strong>
                                            <div className="small-text">{hab.descripcion.substring(0, 40)}...</div>
                                        </div>
                                    </td>
                                    <td>{hab.tipo}</td>
                                    <td><strong>${hab.precio}</strong></td>
                                    <td>{hab.capacidad} pers.</td>
                                    <td>
                                        <span className={`badge-status ${hab.status || (hab.disponible ? 'disponible' : 'ocupada')}`}>
                                            {hab.status ? (hab.status.charAt(0).toUpperCase() + hab.status.slice(1)) : (hab.disponible ? 'Disponible' : 'Ocupada')}
                                        </span>
                                    </td>
                                    <td>
                                        <button className="btn-action edit" onClick={() => abrirEditar(hab)}>
                                            Editar
                                        </button>
                                        <button className="btn-action delete" onClick={() => handleEliminar(hab.id, hab.nombre)}>
                                            Borrar
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" className="no-results">No hay habitaciones registradas.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <Pagination 
                paginaActual={page} 
                totalPaginas={totalPaginas} 
                onPageChange={setPage} 
            />

            {/* Modal */}
            {modalOpen && (
                <div className="admin-modal-overlay">
                    <div className="admin-modal-box">
                        <h2 className="admin-modal-title">{editingId ? 'Editar' : 'Nueva'} Habitación</h2>
                        <form onSubmit={handleGuardar} className="admin-modal-form">
                            <input type="text" name="nombre" value={form.nombre} onChange={handleChange} placeholder="Nombre" required className="admin-form-field" />
                            <select name="tipo" value={form.tipo} onChange={handleChange} className="admin-form-field">
                                {TIPO_OPCIONES.map(t => <option key={t} value={t}>{t}</option>)}
                            </select>
                            <input type="number" name="precio" value={form.precio} onChange={handleChange} placeholder="Precio" required className="admin-form-field" />
                            <input type="number" name="capacidad" value={form.capacidad} onChange={handleChange} placeholder="Capacidad" required className="admin-form-field" />
                            <textarea name="descripcion" value={form.descripcion} onChange={handleChange} placeholder="Descripción" className="admin-form-field admin-form-textarea" />
                            <input type="url" name="imagen" value={form.imagen} onChange={handleChange} placeholder="URL Imagen" className="admin-form-field" />
                            <select name="status" value={form.status} onChange={handleChange} className="admin-form-field">
                                <option value="disponible">Disponible</option>
                                <option value="ocupada">Ocupada</option>
                                <option value="mantenimiento">Mantenimiento</option>
                            </select>
                            <input
                                type="text"
                                name="features"
                                value={form.features.join(', ')}
                                onChange={handleFeaturesChange}
                                placeholder="Características (WiFi, TV, AC...)"
                                className="admin-form-field"
                            />
                            <div className="admin-form-check-row">
                                <input type="checkbox" name="disponible" checked={form.disponible} onChange={handleChange} id="disp" />
                                <label htmlFor="disp">Mostrar en web</label>
                            </div>
                            <div className="admin-modal-actions">
                                <button type="button" onClick={cerrarModal} className="btn-modal-cancel">Cancelar</button>
                                <button type="submit" disabled={saving} className="btn-modal-save">
                                    {saving ? 'Guardando...' : 'Guardar'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default HabitacionesPanel;
