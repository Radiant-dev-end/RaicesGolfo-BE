import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import {
    getHabitaciones,
    createHabitacion,
    updateHabitacion,
    deleteHabitacion,
} from '../../../services/CrudHabitaciones';
import './ReservaHabitaciones.css';

const TIPO_OPCIONES = ['Estándar', 'Deluxe', 'Suite', 'Cabaña', 'Familiar'];

const FORM_INICIAL = {
    nombre: '',
    descripcion: '',
    precio: '',
    capacidad: '',
    tipo: 'Estándar',
    disponible: true,
    imagen: '',
};

const ReservaHabitaciones = () => {
    const [habitaciones, setHabitaciones] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    // Modal state
    const [modalOpen, setModalOpen] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [form, setForm] = useState(FORM_INICIAL);
    const [formError, setFormError] = useState('');
    const [saving, setSaving] = useState(false);

    // ── Carga de datos ─────────────────────────────────────────
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

    // ── Filtrado ─────────────────────────────────────────────
    const filtradas = habitaciones.filter(h =>
        h.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        h.tipo.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // ── Auxiliares del modal ──────────────────────────────────
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

    // ── Envío del formulario (crear / actualizar) ────────────
    const handleGuardar = async (e) => {
        e.preventDefault();
        if (!form.nombre.trim() || !form.precio || !form.capacidad) {
            setFormError('Por favor complete todos los campos obligatorios.');
            return;
        }
        if (Number(form.precio) <= 0 || Number(form.capacidad) <= 0) {
            setFormError('El precio y la capacidad deben ser valores positivos.');
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

    // ── Eliminación ──────────────────────────────────────────
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

    // ── Renderizado ──────────────────────────────────────────
    if (loading) return <div className="tab-content fade-in"><p>Cargando habitaciones...</p></div>;
    if (error)   return <div className="tab-content fade-in"><p className="error">{error}</p></div>;

    return (
        <>
            <div className="tab-content fade-in">
                {/* ─ Encabezado ─ */}
                <header className="panel-header">
                    <div>
                        <h1>Gestión de Habitaciones</h1>
                        <p>Añada, edite o elimine habitaciones del hotel.</p>
                    </div>
                    <div className="hab-header-actions">
                        <div className="search-container">
                            <i className="icon-search">🔍</i>
                            <input
                                type="text"
                                placeholder="Buscar por nombre o tipo..."
                                className="search-input"
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <button className="btn-nueva-hab" onClick={abrirNueva}>
                            ＋ Nueva Habitación
                        </button>
                    </div>
                </header>

                {/* ─ Tabla ─ */}
                <div className="table-responsive">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Nombre</th>
                                <th>Tipo</th>
                                <th>Precio / noche</th>
                                <th>Capacidad</th>
                                <th>Disponible</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtradas.length > 0 ? (
                                filtradas.map(hab => (
                                    <tr key={hab.id}>
                                        <td>
                                            <div className="hab-info-flex">
                                                {hab.imagen && (
                                                    <div className="hab-table-img">
                                                        <img src={hab.imagen} alt={hab.nombre} />
                                                    </div>
                                                )}
                                                <div>
                                                    <div className="hab-nombre">{hab.nombre}</div>
                                                    <div className="hab-desc">{hab.descripcion}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <span className={`badge-tipo badge-${hab.tipo?.toLowerCase().replace(/\s/g, '-')}`}>
                                                {hab.tipo}
                                            </span>
                                        </td>
                                        <td className="hab-precio">${hab.precio}</td>
                                        <td>{hab.capacidad} persona{hab.capacidad !== 1 ? 's' : ''}</td>
                                        <td>
                                            <span className={`badge-disponible ${hab.disponible ? 'disponible' : 'no-disponible'}`}>
                                                {hab.disponible ? '✔ Disponible' : '✘ No disponible'}
                                            </span>
                                        </td>
                                        <td>
                                            <button
                                                className="btn-action edit"
                                                onClick={() => abrirEditar(hab)}
                                                title="Editar"
                                            >
                                                Editar
                                            </button>
                                            <button
                                                className="btn-action delete"
                                                onClick={() => handleEliminar(hab.id, hab.nombre)}
                                                title="Eliminar"
                                            >
                                                Eliminar
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="no-results">
                                        No se encontraron habitaciones.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* ─ Modal de formulario ─ */}
            {modalOpen && (
                <div className="hab-modal-overlay" onClick={cerrarModal}>
                    <div className="hab-modal" onClick={e => e.stopPropagation()}>
                        <div className="hab-modal-header">
                            <h2>{editingId ? 'Editar Habitación' : 'Nueva Habitación'}</h2>
                            <button className="hab-modal-close" onClick={cerrarModal}>✕</button>
                        </div>

                        <form className="hab-form" onSubmit={handleGuardar}>
                            {formError && <p className="hab-form-error">{formError}</p>}

                            <div className="hab-form-row">
                                <div className="hab-form-group">
                                    <label>Nombre <span className="req">*</span></label>
                                    <input
                                        type="text"
                                        name="nombre"
                                        value={form.nombre}
                                        onChange={handleChange}
                                        placeholder="Ej: Habitación Estándar"
                                        required
                                    />
                                </div>
                                <div className="hab-form-group">
                                    <label>Tipo</label>
                                    <select name="tipo" value={form.tipo} onChange={handleChange}>
                                        {TIPO_OPCIONES.map(t => (
                                            <option key={t} value={t}>{t}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="hab-form-row">
                                <div className="hab-form-group">
                                    <label>Precio por noche (USD) <span className="req">*</span></label>
                                    <input
                                        type="number"
                                        name="precio"
                                        value={form.precio}
                                        onChange={handleChange}
                                        placeholder="0"
                                        min="1"
                                        required
                                    />
                                </div>
                                <div className="hab-form-group">
                                    <label>Capacidad (personas) <span className="req">*</span></label>
                                    <input
                                        type="number"
                                        name="capacidad"
                                        value={form.capacidad}
                                        onChange={handleChange}
                                        placeholder="2"
                                        min="1"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="hab-form-group">
                                <label>Descripción</label>
                                <textarea
                                    name="descripcion"
                                    value={form.descripcion}
                                    onChange={handleChange}
                                    rows={3}
                                    placeholder="Descripción de la habitación..."
                                />
                            </div>

                            <div className="hab-form-group">
                                <label>URL de la Imagen</label>
                                <div className="img-input-container">
                                    <input
                                        type="url"
                                        name="imagen"
                                        value={form.imagen}
                                        onChange={handleChange}
                                        placeholder="https://ejemplo.com/foto.jpg"
                                    />
                                    {form.imagen && (
                                        <div className="img-preview-mini">
                                            <img src={form.imagen} alt="Vista previa" onError={(e) => e.target.style.display = 'none'} />
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="hab-form-check">
                                <input
                                    type="checkbox"
                                    id="disponible"
                                    name="disponible"
                                    checked={form.disponible}
                                    onChange={handleChange}
                                />
                                <label htmlFor="disponible">Disponible para reservaciones</label>
                            </div>

                            <div className="hab-form-actions">
                                <button type="button" className="btn-cancelar" onClick={cerrarModal} disabled={saving}>
                                    Cancelar
                                </button>
                                <button type="submit" className="btn-guardar" disabled={saving}>
                                    {saving ? 'Guardando...' : editingId ? 'Guardar Cambios' : 'Crear Habitación'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
};

export default ReservaHabitaciones;
