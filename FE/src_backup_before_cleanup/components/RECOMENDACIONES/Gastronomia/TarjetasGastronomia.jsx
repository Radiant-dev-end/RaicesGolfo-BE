import React from 'react';

const TarjetasGastronomia = ({ platos, loading, error, activeCategory }) => {
    if (!activeCategory) {
        return null;
    }

    if (loading) {
        return (
            <div className="loader-container">
                <div className="spinner"></div>
                <p>Buscando los mejores platos para ti...</p>
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

    if (!platos || platos.length === 0) {
        return (
            <div className="empty-state">
                <p>No hay platos disponibles para esta categoría por el momento.</p>
            </div>
        );
    }

    return (
        <div className="tarjetas-grid">
            {platos.map((plato, idx) => (
                <div className="tarjeta-tour" key={plato.id || plato.id_gastronomia || idx}>
                    <div className="tarjeta-header">
                        <h3>{plato.nombre || 'Plato sin nombre'}</h3>
                        <span className="badge-tipo">{plato.tipo || 'General'}</span>
                    </div>

                    <div className="tarjeta-body">
                        <p>{plato.descripcion || 'Sin descripción disponible.'}</p>
                    </div>

                    <div className="tarjeta-footer">
                        <span className="duracion">
                            🍽️ {plato.tipo || 'Variado'}
                        </span>
                        <span className="precio">
                            ${Number(plato.precio || 0).toFixed(2)}
                        </span>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default TarjetasGastronomia;
