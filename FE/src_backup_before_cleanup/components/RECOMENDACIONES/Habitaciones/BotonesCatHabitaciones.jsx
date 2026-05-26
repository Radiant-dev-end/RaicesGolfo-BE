import React from 'react';

const CATEGORIAS = [
    { id: 'economicas', label: 'Económicas' },
    { id: 'familiares', label: 'Familiares' },
    { id: 'premium', label: 'Premium' },
    { id: 'romanticas', label: 'Románticas' }
];

const BotonesCatHabitaciones = ({ activeCategory, onSelectCategory }) => {
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

export default BotonesCatHabitaciones;
