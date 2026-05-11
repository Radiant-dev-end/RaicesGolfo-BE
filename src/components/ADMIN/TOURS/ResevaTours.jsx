import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import {
    getTours,
    createTour,
    updateTour,
    deleteTour,
} from '../../../services/CrudTours';
import './ReservaTours.css';

const TIPO_OPCIONES = ['Posada', 'Isla'];

const FORM_INICIAL = {
    nombre: '',
    descripcion: '',
    precio: '',
    duracion: '',
    imagen: '',
    tipo: 'Posada',
    disponible: true,
};

const ResevaTours = () => {
    const [tours, setTours] = useState([]);
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
    const cargarTours = async () => {
        try {
            setLoading(true);
            const data = await getTours();
            setTours(data);
        } catch {
            setError('No se pudieron cargar los tours.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { cargarTours(); }, []);

    // ── Filtrado ─────────────────────────────────────────────
    const filtrados = tours.filter(t =>
        t.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.tipo.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // ── Auxiliares del modal ──────────────────────────────────
    const abrirNuevo = () => {
        setEditingId(null);
        setForm(FORM_INICIAL);
        setFormError('');
        setModalOpen(true);
    };

    const abrirEditar = (tour) => {
        setEditingId(tour.id);
        setForm({
            nombre: tour.nombre,
            descripcion: tour.descripcion,
            precio: tour.precio,
            duracion: tour.duracion,
            imagen: tour.imagen || '',
            tipo: tour.tipo,
            disponible: tour.disponible,
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
        if (!form.nombre.trim() || !form.precio || !form.duracion) {
            setFormError('Por favor complete todos los campos obligatorios.');
            return;
        }
        if (Number(form.precio) <= 0) {
            setFormError('El precio debe ser un valor positivo.');
            return;
        }

        try {
            setSaving(true);
            const payload = {
                ...form,
                precio: Number(form.precio),
            };

            if (editingId) {
                const updated = await updateTour(editingId, { ...payload, id: editingId });
                setTours(prev => prev.map(t => t.id === editingId ? updated : t));
                Swal.fire({ icon: 'success', title: '¡Actualizado!', text: 'El tour fue actualizado correctamente.', confirmButtonColor: '#0d9488' });
            } else {
                const created = await createTour(payload);
                setTours(prev => [...prev, created]);
                Swal.fire({ icon: 'success', title: '¡Creado!', text: 'El tour fue registrado correctamente.', confirmButtonColor: '#0d9488' });
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
            title: '¿Eliminar tour?',
            text: `"${nombre}" será eliminado permanentemente.`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            cancelButtonColor: '#64748b',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar',
        });

        if (result.isConfirmed) {
            try {
                await deleteTour(id);
                setTours(prev => prev.filter(t => t.id !== id));
                Swal.fire({ icon: 'success', title: '¡Eliminado!', text: 'El tour fue eliminado.', confirmButtonColor: '#0d9488' });
            } catch {
                Swal.fire('Error', 'Hubo un error al eliminar el tour.', 'error');
            }
        }
    };

    // ── Renderizado ──────────────────────────────────────────
    if (loading) return <div className="tab-content fade-in"><p>Cargando tours...</p></div>;
    if (error)   return <div className="tab-content fade-in"><p className="error">{error}</p></div>;

    return (
        <>
            <div className="tab-content fade-in">
                {/* ─ Encabezado ─ */}
                <header className="panel-header">
                    <div>
                        <h1>Gestión de Tours</h1>
                        <p>Añada, edite o elimine tours del sistema.</p>
                    </div>
                    <div className="tour-header-actions">
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
                        <button className="btn-nuevo-tour" onClick={abrirNuevo}>
                            ＋ Nuevo Tour
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
                                <th>Precio (adulto)</th>
                                <th>Duración</th>
                                <th>Disponible</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtrados.length > 0 ? (
                                filtrados.map(tour => (
                                    <tr key={tour.id}>
                                        <td>
                                            <div className="tour-nombre">{tour.nombre}</div>
                                            <div className="tour-desc">{tour.descripcion}</div>
                                        </td>
                                        <td>
                                            <span className={`badge-tipo badge-${tour.tipo?.toLowerCase()}`}>
                                                {tour.tipo}
                                            </span>
                                        </td>
                                        <td className="tour-precio">${tour.precio}</td>
                                        <td>{tour.duracion}</td>
                                        <td>
                                            <span className={`badge-disponible ${tour.disponible ? 'disponible' : 'no-disponible'}`}>
                                                {tour.disponible ? '✔ Disponible' : '✘ No disponible'}
                                            </span>
                                        </td>
                                        <td>
                                            <button
                                                className="btn-action edit"
                                                onClick={() => abrirEditar(tour)}
                                                title="Editar"
                                            >
                                                Editar
                                            </button>
                                            <button
                                                className="btn-action delete"
                                                onClick={() => handleEliminar(tour.id, tour.nombre)}
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
                                        No se encontraron tours.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* ─ Modal de formulario ─ */}
            {modalOpen && (
                <div className="tour-modal-overlay" onClick={cerrarModal}>
                    <div className="tour-modal" onClick={e => e.stopPropagation()}>
                        <div className="tour-modal-header">
                            <h2>{editingId ? 'Editar Tour' : 'Nuevo Tour'}</h2>
                            <button className="tour-modal-close" onClick={cerrarModal}>✕</button>
                        </div>

                        <form className="tour-form" onSubmit={handleGuardar}>
                            {formError && <p className="tour-form-error">{formError}</p>}

                            <div className="tour-form-row">
                                <div className="tour-form-group">
                                    <label>Nombre <span className="req">*</span></label>
                                    <input
                                        type="text"
                                        name="nombre"
                                        value={form.nombre}
                                        onChange={handleChange}
                                        placeholder="Ej: Recorrido por manglares"
                                        required
                                    />
                                </div>
                                <div className="tour-form-group">
                                    <label>Tipo</label>
                                    <select name="tipo" value={form.tipo} onChange={handleChange}>
                                        {TIPO_OPCIONES.map(t => (
                                            <option key={t} value={t}>{t}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="tour-form-row">
                                <div className="tour-form-group">
                                    <label>Precio (USD) <span className="req">*</span></label>
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
                                <div className="tour-form-group">
                                    <label>Duración <span className="req">*</span></label>
                                    <input
                                        type="text"
                                        name="duracion"
                                        value={form.duracion}
                                        onChange={handleChange}
                                        placeholder="Ej: 2 horas"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="tour-form-group">
                                <label>Imagen (URL)</label>
                                <input
                                    type="text"
                                    name="imagen"
                                    value={form.imagen}
                                    onChange={handleChange}
                                    placeholder="https://ejemplo.com/imagen.jpg"
                                />
                            </div>

                            <div className="tour-form-group">
                                <label>Descripción</label>
                                <textarea
                                    name="descripcion"
                                    value={form.descripcion}
                                    onChange={handleChange}
                                    rows={3}
                                    placeholder="Descripción del tour..."
                                />
                            </div>

                            <div className="tour-form-check">
                                <input
                                    type="checkbox"
                                    id="disponible"
                                    name="disponible"
                                    checked={form.disponible}
                                    onChange={handleChange}
                                />
                                <label htmlFor="disponible">Disponible para contratación</label>
                            </div>

                            <div className="tour-form-actions">
                                <button type="button" className="btn-cancelar" onClick={cerrarModal} disabled={saving}>
                                    Cancelar
                                </button>
                                <button type="submit" className="btn-guardar" disabled={saving}>
                                    {saving ? 'Guardando...' : editingId ? 'Guardar Cambios' : 'Crear Tour'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
};

export default ResevaTours;
