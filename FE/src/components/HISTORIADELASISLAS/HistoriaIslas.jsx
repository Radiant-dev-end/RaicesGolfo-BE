import React, { useEffect } from 'react';
import Navbar from '../INICIO/NAVBAR/Navbar';
import './HistoriaIslas.css';
import historiaPosadaImg from '../VIDEOS Y IMG/img-0984-2.jpg';
import historiaIslasImg from '../VIDEOS Y IMG/img-1019-2.jpg';

const islandsData = [
  {
    name: "Isla Chira",
    description: "La más grande del golfo y hogar de la Posada Rural La Amistad. Históricamente conocida por su producción de sal, su rica herencia pesquera y su hospitalidad rural."
  },
  {
    name: "Isla Venado",
    description: "Famosa por sus manglares vírgenes y su comunidad dedicada a la pesca artesanal y el turismo rural. Un rincón de paz en el corazón del Golfo de Nicoya."
  },
  {
    name: "Isla San Lucas",
    description: "Antigua prisión nacional, hoy convertida en Parque Nacional. Un sitio de inmenso valor histórico y natural que guarda los secretos del pasado de Costa Rica."
  },
  {
    name: "Isla Caballo",
    description: "Una de las joyas más tranquilas del golfo, ideal para quienes buscan desconexión total y contacto puro con el ecosistema marino."
  }
];

function HistoriaIslas() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="historia-islas">
      <Navbar variant="solid" />

      <header className="historia-hero">
        <h1>Nuestra Herencia</h1>
        <p>Descubre el legado cultural y natural que define al Golfo de Nicoya y a Raíces del Golfo.</p>
      </header>

      <main className="historia-container">
        {/* Section: Posada Rural La Amistad */}
        <section className="historia-section">
          <div className="historia-content">
            <h2>Posada Rural La Amistad</h2>
            <p>
              Nuestra historia comienza con un sueño familiar en las costas de Isla de Chira. Lo que nació como 
              un pequeño emprendimiento para ofrecer refugio a los pescadores y viajeros, se transformó con 
              el tiempo en la <strong>Posada Rural La Amistad</strong>.
            </p>
            <p>
              Fundada bajo los principios de la hospitalidad isleña y el respeto por el medio ambiente, 
              nuestra posada ha sido el puente entre la cultura local y visitantes de todo el mundo. 
              Cada rincón de nuestra casa cuenta una historia de esfuerzo, tradición y amor por el golfo.
            </p>
            <p>
              Hoy, somos orgullosos representantes de "Raíces del Golfo", integrando servicios que 
              celebran la gastronomía autóctona, los recorridos naturales y la calidez humana que nos caracteriza.
            </p>
          </div>
          <div className="historia-image-wrapper">
            <img src={historiaPosadaImg} alt="Historia de la Posada" />
          </div>
        </section>

        {/* Section: Islas del Golfo */}
        <section className="historia-section reverse">
          <div className="historia-content">
            <h2>Islas del Golfo de Nicoya</h2>
            <p>
              El Golfo de Nicoya no es solo un cuerpo de agua; es un archipiélago de historias. Con una extensión de 90 km, este entrante de mar —el más profundo de Costa Rica— recibe las aguas de los ríos Tempisque y Grande de Tárcoles, creando un ecosistema estuarino vital.
            </p>
            <p>
              Su historia se remonta a siglos de tradición. Documentado por primera vez en 1519 por la expedición de Juan de Castañeda, este territorio fue el hogar del Reino de Nicoya, una prominente nación de origen chorotega que dejó un legado imborrable en la cultura local.
            </p>
            <p>
              Hoy, el golfo alberga diversos microclimas y manglares que son cuna de biodiversidad marina. Explorar sus islas es viajar en el tiempo, sintiendo la brisa que ha bañado estas tierras desde la época precolombina hasta nuestra era de turismo regenerativo.
            </p>
          </div>
          <div className="historia-image-wrapper">
            <img src={historiaIslasImg} alt="Islas del Golfo" />
          </div>
        </section>

        {/* Section: Grid de Islas */}
        <section>
          <div className="historia-content" style={{textAlign: 'center', marginBottom: '50px'}}>
            <h2>Explora Nuestras Islas</h2>
            <p>Cada una con un encanto único y una historia por contar.</p>
          </div>
          <div className="islas-grid">
            {islandsData.map((isla, index) => (
              <div key={index} className="isla-card">
                <h3>{isla.name}</h3>
                <p>{isla.description}</p>
              </div>
            ))}
          </div>
        </section>
      </main>


    </div>
  );
}

export default HistoriaIslas;
