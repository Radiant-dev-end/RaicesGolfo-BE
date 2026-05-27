import React, { useState } from 'react';
import BotonesCatHabitaciones from './BotonesCatHabitaciones';
import TarjetasHabitaciones from './TarjetasHabitaciones';
import { getRoomRecommendations } from '../../../services/RecommendationService';
import '../Recomendaciones.css';

const RecomendadorHabitaciones = () => {
    const [activeCategory, setActiveCategory] = useState(null);
    const [habitaciones, setHabitaciones] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSelectCategory = async (categoryId) => {
        if (loading || (activeCategory === categoryId && habitaciones.length > 0)) return;

        setActiveCategory(categoryId);
        setLoading(true);
        setError(null);

        try {
            const data = await getRoomRecommendations(categoryId);
            setHabitaciones(data);
        } catch (err) {
            setError('No pudimos cargar las recomendaciones de habitaciones. Intenta de nuevo más tarde.');
            setHabitaciones([]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="recomendaciones-container">
            <div className="recomendaciones-header">
                <h2>Encuentra tu Habitación Ideal</h2>
                <p>Selecciona tu estilo de viaje y te mostraremos las mejores opciones de alojamiento.</p>
            </div>

            <BotonesCatHabitaciones
                activeCategory={activeCategory}
                onSelectCategory={handleSelectCategory}
            />

            <TarjetasHabitaciones
                habitaciones={habitaciones}
                loading={loading}
                error={error}
                activeCategory={activeCategory}
            />
        </section>
    );
};

export default RecomendadorHabitaciones;
