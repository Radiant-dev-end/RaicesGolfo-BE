import React from 'react';
import './Transporte.css';

const transportData = [
  {
    category: "Lancha (Bote)",
    route: "Puntarenas - Isla Venado",
    description: "Servicio regular de transporte marítimo desde el muelle de Puntarenas.",
    schedules: [
      { from: "Puntarenas", to: "Isla Venado", times: ["7:00 AM", "11:30 AM", "3:30 PM"] },
      { from: "Isla Venado", to: "Puntarenas", times: ["6:00 AM", "10:00 AM", "2:00 PM"] }
    ]
  },
  {
    category: "Autobús",
    route: "San José - Puntarenas",
    description: "Transporte terrestre desde la Terminal 7-10 en San José hacia Puntarenas.",
    schedules: [
      { from: "San José", to: "Puntarenas", times: ["Cada hora desde las 6:00 AM"] },
      { from: "Puntarenas", to: "San José", times: ["Cada hora hasta las 7:00 PM"] }
    ]
  }
];

function Transporte() {
  return (
    <div className="transporte-section">
      <div className="transporte-grid">
        {transportData.map((item, index) => (
          <div key={index} className="transporte-card">
            <div className="transporte-card-header">
              <h3>{item.category}</h3>
              <p className="route-name">{item.route}</p>
            </div>
            <div className="transporte-card-body">
              <p className="description">{item.description}</p>
              <div className="schedules-wrapper">
                {item.schedules.map((sched, idx) => (
                  <div key={idx} className="schedule-item">
                    <p className="direction"><strong>{sched.from} ➔ {sched.to}</strong></p>
                    <ul className="time-list">
                      {sched.times.map((time, tIdx) => (
                        <li key={tIdx}>{time}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
      
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
