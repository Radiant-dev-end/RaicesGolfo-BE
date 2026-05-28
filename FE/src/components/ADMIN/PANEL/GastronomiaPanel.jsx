import React, { useState } from 'react';
import Swal from 'sweetalert2';
import {
    getGastronomia,
    createGastronomia,
    updateGastronomia,
    deleteGastronomia,
} from '../../../services/CrudGastronomia';
import usePagination from '../../../hooks/usePagination';
import Pagination from '../../common/Pagination';
import './AdminPanel.css'; 

const TIPO_OPCIONES = ['Posada', 'Isla'];
const ESTADO_OPCIONES = ['disponible', 'agotado'];

const FORM_INICIAL = {
    nombre: '',
    descripcion: '',
    precio_minimo: '',
    precio_maximo: '',
    tipo: 'Posada',
    disponible: true,
    estado: 'disponible',
    features: [],
    imagen: '',
};

const GastronomiaPanel = () => {
    const { 
        data: platos, 
        loading, 
        page, 
        setPage, 
        totalPaginas,
        refresh: cargarGastronomia
    } = usePagination(() => getGastronomia(), 5); // LIMIT: 5 items per page

    const [searchTerm, setSearchTerm] = useState('');
    const [modalOpen, setModalOpen] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [form, setForm] = useState(FORM_INICIAL);
    const [saving, setSaving] = useState(false);

    const filtrados = platos.filter(p =>
        (p.nombre || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (p.tipo || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

    const abrirNueva = () => {
        setEditingId(null);
        setForm(FORM_INICIAL);
        setModalOpen(true);
    };

    const abrirEditar = (plato) => {
        setEditingId(plato.id_gastronomia || plato.id);
        setForm({
            nombre: plato.nombre,
            descripcion: plato.descripcion,
            precio_minimo: plato.precio_minimo,
            precio_maximo: plato.precio_maximo,
            tipo: plato.tipo,
            disponible: plato.disponible,
            estado: plato.estado || 'disponible',
            features: plato.features || [],
            imagen: plato.imagen || '',
        });
        setModalOpen(true);
    };

    const cerrarModal = () => {
        setModalOpen(false);
        setEditingId(null);
        setForm(FORM_INICIAL);
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
        if (!form.nombre.trim() || !form.descripcion.trim() || form.precio_minimo === '' || form.precio_maximo === '') {
            Swal.fire({ icon: 'warning', title: 'Campos incompletos', text: 'Por favor complete todos los campos obligatorios.', confirmButtonColor: '#0d9488' });
            return;
        }

        const min = Number(form.precio_minimo);
        const max = Number(form.precio_maximo);

        if (min <= 0 || max <= 0) {
            Swal.fire({ icon: 'warning', title: 'Precio inválido', text: 'Los precios deben ser mayores a 0.', confirmButtonColor: '#0d9488' });
            return;
        }

        if (min > max) {
            Swal.fire({ icon: 'warning', title: 'Rango de precios inválido', text: 'El precio mínimo no puede ser mayor que el precio máximo.', confirmButtonColor: '#0d9488' });
            return;
        }

        try {
            setSaving(true);
            const payload = {
                ...form,
                precio_minimo: min,
                precio_maximo: max,
            };

            if (editingId) {
                await updateGastronomia(editingId, payload);
                cargarGastronomia();
                Swal.fire({ icon: 'success', title: '¡Actualizado!', text: 'El platillo fue actualizado correctamente.', confirmButtonColor: '#0d9488' });
            } else {
                await createGastronomia(payload);
                cargarGastronomia();
                Swal.fire({ icon: 'success', title: '¡Creado!', text: 'El platillo fue registrado correctamente.', confirmButtonColor: '#0d9488' });
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
            title: '¿Eliminar platillo?',
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
                await deleteGastronomia(id);
                cargarGastronomia();
                Swal.fire({ icon: 'success', title: '¡Eliminado!', text: 'El platillo fue eliminado correctamente.', confirmButtonColor: '#0d9488' });
            } catch (err) {
                Swal.fire('Error', err.message || 'Hubo un error al eliminar el platillo.', 'error');
            }
        }
    };

    if (loading) return <div className="tab-content"><p>Cargando menú de gastronomía...</p></div>;

    return (
        <div className="tab-content fade-in">
            <header className="panel-header">
                <div>
                    <h1>Gestión de Gastronomía</h1>
                    <p>Añada, edite o elimine platillos del menú.</p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', width: '100%' }}>
                    <div className="search-container" style={{ flex: 1 }}>
                        <i className="icon-search">🔍</i>
                        <input
                            type="text"
                            placeholder="Buscar por nombre o tipo (Posada / Isla)..."
                            className="search-input"
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button
                        className="btn-nueva-hab"
                        onClick={abrirNueva}
                        title="Nuevo Platillo"
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
                            <th>Precio Mínimo</th>
                            <th>Precio Máximo</th>
                            <th>Estado</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtrados.length > 0 ? (
                            filtrados.map(plato => {
                                const id = plato.id_gastronomia || plato.id;
                                return (
                                    <tr key={id}>
                                        <td>
                                            <div className="user-info">
                                                <strong>{plato.nombre}</strong>
                                                <div className="small-text">{plato.descripcion ? plato.descripcion.substring(0, 40) + '...' : 'Sin descripción'}</div>
                                            </div>
                                        </td>
                                        <td>{plato.tipo}</td>
                                        <td><strong>${plato.precio_minimo}</strong></td>
                                        <td><strong>${plato.precio_maximo}</strong></td>
                                        <td>
                                            <span className={`badge-status ${plato.estado || (plato.disponible ? 'disponible' : 'agotado')}`}>
                                                {plato.estado ? (plato.estado.charAt(0).toUpperCase() + plato.estado.slice(1)) : (plato.disponible ? 'Disponible' : 'Agotado')}
                                            </span>
                                        </td>
                                        <td>
                                            <button className="btn-action edit" onClick={() => abrirEditar(plato)}>
                                                Editar
                                            </button>
                                            <button className="btn-action delete" onClick={() => handleEliminar(id, plato.nombre)}>
                                                Borrar
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })
                        ) : (
                            <tr>
                                <td colSpan="6" className="no-results">No hay platillos registrados.</td>
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

            {/* Modal de Formulario */}
            {modalOpen && (
                <div className="admin-modal-overlay">
                    <div className="admin-modal-box">
                        <h2 className="admin-modal-title">{editingId ? 'Editar' : 'Nuevo'} Platillo</h2>
                        <form onSubmit={handleGuardar} className="admin-modal-form">
                            <input type="text" name="nombre" value={form.nombre} onChange={handleChange} placeholder="Nombre del platillo" required className="admin-form-field" />

                            <select name="tipo" value={form.tipo} onChange={handleChange} className="admin-form-field">
                                {TIPO_OPCIONES.map(t => <option key={t} value={t}>{t}</option>)}
                            </select>

                            <input type="number" name="precio_minimo" value={form.precio_minimo} onChange={handleChange} placeholder="Precio mínimo" required className="admin-form-field" />
                            <input type="number" name="precio_maximo" value={form.precio_maximo} onChange={handleChange} placeholder="Precio máximo" required className="admin-form-field" />

                            <textarea name="descripcion" value={form.descripcion} onChange={handleChange} placeholder="Descripción del platillo" required className="admin-form-field admin-form-textarea" />
                            <input type="url" name="imagen" value={form.imagen} onChange={handleChange} placeholder="URL de la Imagen" required className="admin-form-field" />

                            <select name="estado" value={form.estado} onChange={handleChange} className="admin-form-field">
                                <option value="disponible">Disponible</option>
                                <option value="agotado">Agotado</option>
                            </select>

                            <input
                                type="text"
                                name="features"
                                value={form.features.join(', ')}
                                onChange={handleFeaturesChange}
                                placeholder="Características (ej: Picante, Sin gluten, Recomendado...)"
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

export default GastronomiaPanel;
