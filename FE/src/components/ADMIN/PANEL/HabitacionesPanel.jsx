import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import {
    getHabitaciones,
    createHabitacion,
    updateHabitacion,
    deleteHabitacion,
} from '../../../services/CrudHabitaciones';
import './AdminPanel.css'; // Reutilizamos estilos generales de tabla

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
    const [habitaciones, setHabitaciones] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    // Modal state
    const [modalOpen, setModalOpen] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [form, setForm] = useState(FORM_INICIAL);
    const [, setFormError] = useState('');
    const [, setSaving] = useState(false);

    const cargarHabitaciones = async () => {
        try {
            setLoading(true);
            const data = await getHabitaciones();
            setHabitaciones(data);
        } catch {
            setError('No se pudieron cargar las habitaciones.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { cargarHabitaciones(); }, []);

    const filtradas = habitaciones.filter(h =>
        h.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        h.tipo.toLowerCase().includes(searchTerm.toLowerCase())
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
            setFormError('Por favor complete todos los campos obligatorios.');
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
                const updated = await updateHabitacion(editingId, { ...payload, id: editingId });
                setHabitaciones(prev => prev.map(h => h.id === editingId ? updated : h));
                Swal.fire({ icon: 'success', title: '¡Actualizada!', text: 'La habitación fue actualizada correctamente.', confirmButtonColor: '#0d9488' });
            } else {
                const created = await createHabitacion(payload);
                setHabitaciones(prev => [...prev, created]);
                Swal.fire({ icon: 'success', title: '¡Creada!', text: 'La habitación fue registrada correctamente.', confirmButtonColor: '#0d9488' });
            }
            cerrarModal();
        } catch {
            setFormError('Ocurrió un error al guardar. Intente nuevamente.');
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
                setHabitaciones(prev => prev.filter(h => h.id !== id));
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
                <div className="search-container">
                    <i className="icon-search">🔍</i>
                    <input
                        type="text"
                        placeholder="Buscar por nombre o tipo..."
                        className="search-input"
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                    />
                    <button className="btn-nueva-hab" style={{ marginLeft: '1rem', padding: '0.5rem 1rem', background: '#0d9488', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }} onClick={abrirNueva}>
                        ＋ Nueva
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

            {/* Modal Simplificado */}
            {modalOpen && (
                <div className="modal-overlay" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
                    <div className="modal-content" style={{ background: 'white', padding: '2rem', borderRadius: '8px', width: '90%', maxWidth: '500px' }}>
                        <h2>{editingId ? 'Editar' : 'Nueva'} Habitación</h2>
                        <form onSubmit={handleGuardar} style={{ display: 'grid', gap: '1rem', marginTop: '1rem' }}>
                            <input type="text" name="nombre" value={form.nombre} onChange={handleChange} placeholder="Nombre" required style={{ padding: '0.5rem' }} />
                            <select name="tipo" value={form.tipo} onChange={handleChange} style={{ padding: '0.5rem' }}>
                                {TIPO_OPCIONES.map(t => <option key={t} value={t}>{t}</option>)}
                            </select>
                            <input type="number" name="precio" value={form.precio} onChange={handleChange} placeholder="Precio" required style={{ padding: '0.5rem' }} />
                            <input type="number" name="capacidad" value={form.capacidad} onChange={handleChange} placeholder="Capacidad" required style={{ padding: '0.5rem' }} />
                            <textarea name="descripcion" value={form.descripcion} onChange={handleChange} placeholder="Descripción" style={{ padding: '0.5rem' }} />
                            <input type="url" name="imagen" value={form.imagen} onChange={handleChange} placeholder="URL Imagen" style={{ padding: '0.5rem' }} />
                            <select name="status" value={form.status} onChange={handleChange} style={{ padding: '0.5rem' }}>
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
                                style={{ padding: '0.5rem' }} 
                            />
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <input type="checkbox" name="disponible" checked={form.disponible} onChange={handleChange} id="disp" />
                                <label htmlFor="disp">Mostrar en web</label>
                            </div>
                            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '1rem' }}>
                                <button type="button" onClick={cerrarModal} style={{ padding: '0.5rem 1rem', background: '#ccc', border: 'none', borderRadius: '4px' }}>Cancelar</button>
                                <button type="submit" style={{ padding: '0.5rem 1rem', background: '#0d9488', color: 'white', border: 'none', borderRadius: '4px' }}>Guardar</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default HabitacionesPanel;
