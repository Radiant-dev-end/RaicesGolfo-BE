import React, { useState } from 'react';
import BotonesCategoria from './BotonesCategoria';
import TarjetasRecomendadas from './TarjetasRecomendadas';
import { getTourRecommendations } from '../../../services/RecommendationService';
import '../Recomendaciones.css';

const RecomendadorTours = () => {
    const [activeCategory, setActiveCategory] = useState(null);
    const [tours, setTours] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSelectCategory = async (categoryId) => {
        // Evitar múltiples llamadas si ya está cargando o si es la misma categoría y ya tenemos datos
        if (loading || (activeCategory === categoryId && tours.length > 0)) return;

        setActiveCategory(categoryId);
        setLoading(true);
        setError(null);

        try {
            const data = await getTourRecommendations(categoryId);
            setTours(data);
        } catch (err) {
            setError('No pudimos cargar las recomendaciones en este momento. Intenta de nuevo más tarde.');
            setTours([]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="recomendaciones-container">
            <div className="recomendaciones-header">
                <h2>Recomendaciones para ti</h2>
                <p>Selecciona lo que más te apetece y descubre tu próxima aventura ideal.</p>
            </div>
            
            <BotonesCategoria 
                activeCategory={activeCategory} 
                onSelectCategory={handleSelectCategory} 
            />
            
            <TarjetasRecomendadas 
                tours={tours} 
                loading={loading} 
                error={error} 
                activeCategory={activeCategory} 
            />
        </section>
    );
};

export default RecomendadorTours;
