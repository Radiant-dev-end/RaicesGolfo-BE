import React from 'react';

const TarjetasRecomendadas = ({ tours, loading, error, activeCategory }) => {
    if (!activeCategory) {
        return null; // Estado inicial, no se ha hecho click en nada
    }

    if (loading) {
        return (
            <div className="loader-container">
                <div className="spinner"></div>
                <p>Buscando las mejores recomendaciones para ti...</p>
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

    if (!tours || tours.length === 0) {
        return (
            <div className="empty-state">
                <p>Lo sentimos, por el momento no hay tours disponibles para esta categoría.</p>
            </div>
        );
    }

    return (
        <div className="tarjetas-grid">
            {tours.map((tour, idx) => (
                <div className="tarjeta-tour" key={tour.id || idx}>
                    <div className="tarjeta-header">
                        <h3>{tour.nombre || 'Tour sin nombre'}</h3>
                        <span className="badge-tipo">{tour.tipo || 'General'}</span>
                    </div>
                    
                    <div className="tarjeta-body">
                        <p>{tour.descripcion || 'Sin descripción disponible.'}</p>
                    </div>

                    <div className="tarjeta-footer">
                        <span className="duracion">
                            ⏱️ {tour.duracion || 'Variable'}
                        </span>
                        <span className="precio">
                            ${Number(tour.precio || 0).toFixed(2)}
                        </span>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default TarjetasRecomendadas;
