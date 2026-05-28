import React from 'react';
import FoodCard from '../INFO/FoodCard';
import { getGastronomia } from '../../../services/CrudGastronomia';
import usePagination from '../../../hooks/usePagination';
import Pagination from '../../common/Pagination';
import './GastronomiaSection.css';

import comida1 from '../../VIDEOS Y IMG/comida1.jpg';
import comida2 from '../../VIDEOS Y IMG/comida2.jpg';
import comida3 from '../../VIDEOS Y IMG/comida3.jpg';
import comida4 from '../../VIDEOS Y IMG/comida4.jpg';

const IMAGES = {
  'g009': comida1,
  'g010': comida2,
  'g011': comida3,
  'g012': comida4,
};

const getFoodImage = (dish) => {
  if (dish.imagen && dish.imagen.trim() !== '' && !dish.imagen.includes('github.com/Radiant-dev-end')) {
    return dish.imagen;
  }
  const id = dish.id_gastronomia || dish.id;
  const key = typeof id === 'number' ? `g${String(id).padStart(3, '0')}` : id;
  return IMAGES[key] || comida1;
};

function GastronomiaPosada() {
  const { 
    data: dishes, 
    loading, 
    page, 
    setPage, 
    totalPaginas 
  } = usePagination(() => getGastronomia('Posada'), 3); // LIMIT: 3 items per page

  return (
    <section id="gastro-posada" className="gastro-section posada-bg">
      <div className="gastro-container">
        <div className="gastro-header">
          <h2 className="gastro-title">Gastronomía Posada Rural La Amistad</h2>
          <div className="gastro-divider"></div>
          <p className="gastro-subtitle">
            Saborea la auténtica cocina costarricense con ingredientes frescos de la zona. Disfruta de platos tradicionales preparados con amor y sazón criollo.
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

export default GastronomiaPosada;
