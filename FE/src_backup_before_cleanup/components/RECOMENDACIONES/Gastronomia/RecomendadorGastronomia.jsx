import React, { useState } from 'react';
import BotonesCatGastronomia from './BotonesCatGastronomia';
import TarjetasGastronomia from './TarjetasGastronomia';
import { getFoodRecommendations } from '../../../services/RecommendationService';
import '../Recomendaciones.css';

const RecomendadorGastronomia = () => {
    const [activeCategory, setActiveCategory] = useState(null);
    const [platos, setPlatos] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSelectCategory = async (categoryId) => {
        if (loading || (activeCategory === categoryId && platos.length > 0)) return;

        setActiveCategory(categoryId);
        setLoading(true);
        setError(null);

        try {
            const data = await getFoodRecommendations(categoryId);
            setPlatos(data);
        } catch (err) {
            setError('No pudimos cargar las recomendaciones gastronómicas. Intenta de nuevo más tarde.');
            setPlatos([]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="recomendaciones-container">
            <div className="recomendaciones-header">
                <h2>Descubre Nuestros Sabores</h2>
                <p>Elige tu preferencia culinaria y te mostraremos los mejores platos del Golfo.</p>
            </div>

            <BotonesCatGastronomia
                activeCategory={activeCategory}
                onSelectCategory={handleSelectCategory}
            />

            <TarjetasGastronomia
                platos={platos}
                loading={loading}
                error={error}
                activeCategory={activeCategory}
            />
        </section>
    );
};

export default RecomendadorGastronomia;
