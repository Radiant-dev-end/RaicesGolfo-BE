import React from 'react';
import FoodCard from '../INFO/FoodCard';
import { getGastronomia } from '../../../services/CrudGastronomia';
import usePagination from '../../../hooks/usePagination';
import Pagination from '../../common/Pagination';
import './GastronomiaSection.css';

import marisco1 from '../../VIDEOS Y IMG/marisco1.jpg';
import marisco2 from '../../VIDEOS Y IMG/marisco2.jpg';
import marisco3 from '../../VIDEOS Y IMG/marisco3.jpg';
import marisco4 from '../../VIDEOS Y IMG/marisco4.jpg';

const IMAGES = {
  'g005': marisco1,
  'g006': marisco2,
  'g007': marisco3,
  'g008': marisco4,
};

const getFoodImage = (dish) => {
  if (dish.imagen && dish.imagen.trim() !== '' && !dish.imagen.includes('github.com/Radiant-dev-end')) {
    return dish.imagen;
  }
  const id = dish.id_gastronomia || dish.id;
  const key = typeof id === 'number' ? `g${String(id).padStart(3, '0')}` : id;
  return IMAGES[key] || marisco1;
};

function GastronomiaIsla() {
  const { 
    data: dishes, 
    loading, 
    page, 
    setPage, 
    totalPaginas 
  } = usePagination(() => getGastronomia('Isla'), 3); // LIMIT: 3 items per page

  return (
    <section id="gastro-isla" className="gastro-section isla-bg">
      <div className="gastro-container">
        <div className="gastro-header">
          <h2 className="gastro-title">Gastronomía Isla Venado</h2>
          <div className="gastro-divider"></div>
          <p className="gastro-subtitle">
            Delicias extraídas directamente del Golfo de Nicoya. Nuestra especialidad son los mariscos frescos y los sabores vibrantes de la costa pacífica.
          </p>
        </div>
        
        <div className="gastro-grid">
          {loading ? (
            <p>Cargando platos...</p>
          ) : dishes && dishes.length > 0 ? (
            dishes.map(dish => (
              <FoodCard 
                key={dish.id_gastronomia || dish.id} 
                {...dish} 
                imagen={getFoodImage(dish)}
                precio={`₡${parseInt(dish.precio).toLocaleString('es-CR')}`}
              />
            ))
          ) : (
            <p>No hay platos disponibles en este momento.</p>
          )}
        </div>

        <Pagination 
          paginaActual={page} 
          totalPaginas={totalPaginas} 
          onPageChange={setPage} 
        />
      </div>
    </section>
  );
}

export default GastronomiaIsla;
