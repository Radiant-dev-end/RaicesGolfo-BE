import React from 'react';

const CATEGORIAS = [
    { id: 'aventura', label: 'Aventura' },
    { id: 'cultura', label: 'Cultura' },
    { id: 'relajacion', label: 'Relajación' },
    { id: 'economico', label: 'Economico' }
];

const BotonesCategoria = ({ activeCategory, onSelectCategory }) => {
    return (
        <div className="botones-categoria">
            {CATEGORIAS.map((cat) => (
                <button
                    key={cat.id}
                    className={`btn-categoria ${activeCategory === cat.id ? 'active' : ''}`}
                    onClick={() => onSelectCategory(cat.id)}
                >
                    {cat.label}
                </button>
            ))}
        </div>
    );
};

export default BotonesCategoria;
