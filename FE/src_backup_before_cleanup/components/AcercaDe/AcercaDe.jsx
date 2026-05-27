import React, { useState } from 'react';
import Navbar from '../INICIO/NAVBAR/Navbar';
import Footer from '../INICIO/IMGULTIMA/ImgUltima';
import Swal from 'sweetalert2';
import "../AcercaDe/AcercaDe.css";
import { createContacto } from '../../services/CrudContactos';

const sections = [
  {
    title: "Nuestra Historia",
    content: "Raíces del Golfo nació del sueño de compartir la belleza inigualable del Golfo de Nicoya con el mundo. Lo que comenzó como un pequeño emprendimiento familiar en Isla de Chira ha crecido hasta convertirse en un referente de turismo sostenible en la región."
  },
  {
    title: "Misión",
    content: "Proveer experiencias turísticas auténticas en Isla de Chira a través de la Posada Rural La Amistad, celebrando la identidad isleña y promoviendo el desarrollo socioeconómico local mediante un turismo sostenible y responsable."
  },
  {
    title: "Visión",
    content: "Consolidar a la Posada Rural La Amistad como el referente principal de hospitalidad en Isla de Chira, siendo reconocidos por nuestra conexión profunda con la naturaleza y nuestro impacto positivo en la comunidad del Golfo de Nicoya."
  }
];

function AcercaDe({ variant }) {
  const [formData, setFormData] = useState({
    nombre: '',
    correo: '',
    asunto: '',
    mensaje: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validar campos (aunque esten marcados como required en el HTML, reforzamos aqui)
    if (!formData.nombre || !formData.correo || !formData.asunto || !formData.mensaje) {
      Swal.fire({
        title: 'Error',
        text: 'Por favor, completa todos los campos.',
        icon: 'error',
        confirmButtonColor: '#ef4444'
      });
      return;
    }

    try {
      setLoading(true);
      const now = new Date();
      const fecha = now.toISOString().split('T')[0]; // Formato YYYY-MM-DD

      const dataToSave = {
        ...formData,
        fecha
      };

      await createContacto(dataToSave);

      Swal.fire({
        title: '¡Enviado!',
        text: 'Mensaje enviado correctamente. ¡Gracias por contactarnos!',
        icon: 'success',
        confirmButtonColor: '#0d9488'
      });

      // Limpiar formulario
      setFormData({
        nombre: '',
        correo: '',
        asunto: '',
        mensaje: ''
      });
    } catch (error) {
      Swal.fire({
        title: 'Error',
        text: 'Hubo un problema al enviar tu mensaje. Inténtalo de nuevo.',
        icon: 'error',
        confirmButtonColor: '#ef4444'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="acerca-de-page">
      <Navbar variant={variant} />

      <header className="acerca-de-hero">
        <h1>Sobre Nosotros</h1>
        <p>Conectando personas con la naturaleza y la cultura del Golfo.</p>
      </header>

      <main className="acerca-container">
        <section className="acerca-grid">
          {sections.map((section, index) => (
            <div key={index} className="acerca-card">
              <h2>{section.title}</h2>
              <p>{section.content}</p>
            </div>
          ))}
        </section>

        <section className="contacto-section">
          <div className="contacto-header">
            <h2>Contáctanos</h2>
            <p>¿Tienes alguna duda? Estamos aquí para ayudarte.</p>
          </div>
          <form className="contacto-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="nombre">Nombre Completo</label>
              <input 
                type="text" 
                id="nombre" 
                placeholder="Tu nombre" 
                required 
                value={formData.nombre}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="correo">Correo Electrónico</label>
              <input 
                type="email" 
                id="correo" 
                placeholder="ejemplo@correo.com" 
                required 
                value={formData.correo}
                onChange={handleChange}
              />
            </div>
            <div className="form-group full-width">
              <label htmlFor="asunto">Asunto</label>
              <input 
                type="text" 
                id="asunto" 
                placeholder="¿En qué podemos ayudarte?" 
                required 
                value={formData.asunto}
                onChange={handleChange}
              />
            </div>
            <div className="form-group full-width">
              <label htmlFor="mensaje">Mensaje</label>
              <textarea 
                id="mensaje" 
                rows="5" 
                placeholder="Escribe tu mensaje aquí..." 
                required 
                value={formData.mensaje}
                onChange={handleChange}
              ></textarea>
            </div>
            <button type="submit" className="btn-enviar" disabled={loading}>
              {loading ? 'Enviando...' : 'Enviar Mensaje'}
            </button>
          </form>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default AcercaDe;
