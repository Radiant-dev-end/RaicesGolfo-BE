import React from 'react';

const TarjetasHabitaciones = ({ habitaciones, loading, error, activeCategory }) => {
    if (!activeCategory) {
        return null;
    }

    if (loading) {
        return (
            <div className="loader-container">
                <div className="spinner"></div>
                <p>Buscando las mejores habitaciones para ti...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="empty-state" style={{ color: '#ef4444' }}>
                <p>⚠️ {error}</p>
            </div>
        );
    }

    if (!habitaciones || habitaciones.length === 0) {
        return (
            <div className="empty-state">
                <p>No hay habitaciones disponibles para esta categoría por el momento.</p>
            </div>
        );
    }

    return (
        <div className="tarjetas-grid">
            {habitaciones.map((hab, idx) => (
                <div className="tarjeta-tour" key={hab.id || hab.id_habitaciones || idx}>
                    <div className="tarjeta-header">
                        <h3>{hab.nombre || 'Habitación sin nombre'}</h3>
                        <span className="badge-tipo">{hab.tipo || 'Estándar'}</span>
                    </div>

                    <div className="tarjeta-body">
                        <p>{hab.descripcion || 'Sin descripción disponible.'}</p>
                    </div>

                    <div className="tarjeta-footer">
                        <span className="duracion">
                            👥 {hab.capacidad || '?'} personas
                        </span>
                        <span className="precio">
                            ${Number(hab.precio || hab.precio_noche || 0).toFixed(2)}
                        </span>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default TarjetasHabitaciones;
