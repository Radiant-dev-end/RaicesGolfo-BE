import './Transporte.css';
import { getTransporte } from '../../services/CrudTransporte';
import usePagination from '../../hooks/usePagination';
import Pagination from '../common/Pagination';

function Transporte() {
  const { 
    data: transportData, 
    loading, 
    page, 
    setPage, 
    totalPaginas 
  } = usePagination(() => getTransporte(), 1); // LIMIT: 1 item per page
  return (
    <div className="transporte-section">
      <div className="transporte-grid">
        {loading ? (
          <p>Cargando servicios de transporte...</p>
        ) : transportData && transportData.length > 0 ? (
          transportData.map((item, index) => (
            <div key={item.id_transporte || index} className="transporte-card">
              <div className="transporte-card-header">
                <h3>{item.categoria || item.category}</h3>
                <p className="route-name">{item.ruta || item.route}</p>
              </div>
              <div className="transporte-card-body">
                <p className="description">{item.descripcion || item.description}</p>
                <div className="schedules-wrapper">
                  {(item.horarios || item.schedules || []).map((sched, idx) => (
                    <div key={idx} className="schedule-item">
                      <p className="direction"><strong>{sched.from} ➔ {sched.to}</strong></p>
                      <ul className="time-list">
                        {(sched.times || []).map((time, tIdx) => (
                          <li key={tIdx}>{time}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))
        ) : (
          <p>No hay servicios de transporte disponibles.</p>
        )}
      </div>

      <Pagination 
        paginaActual={page} 
        totalPaginas={totalPaginas} 
        onPageChange={setPage} 
      />
      
      <div className="transporte-info-extra">
        <h4>Información Importante</h4>
        <ul>
          <li>Se recomienda llegar al muelle 15 minutos antes de la salida.</li>
          <li>Los horarios pueden variar según las condiciones climáticas o días feriados.</li>
          <li>Para servicios privados de lancha, favor contactarnos directamente.</li>
        </ul>
      </div>
    </div>
  );
}

export default Transporte;
