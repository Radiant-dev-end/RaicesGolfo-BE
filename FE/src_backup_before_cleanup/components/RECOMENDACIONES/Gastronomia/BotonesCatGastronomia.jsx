import React from 'react';

const CATEGORIAS = [
    { id: 'mariscos', label: 'Mariscos' },
    { id: 'tipica', label: 'Típica' },
    { id: 'gourmet', label: 'Gourmet' },
    { id: 'economica', label: 'Económica' }
];

const BotonesCatGastronomia = ({ activeCategory, onSelectCategory }) => {
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

export default BotonesCatGastronomia;
