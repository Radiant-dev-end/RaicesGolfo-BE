import React, { useState, useEffect, useRef, useMemo } from 'react';
import { getTours } from '../../services/CrudTours';
import { getHabitaciones } from '../../services/CrudHabitaciones';
import { getChatResponse } from '../../services/GroqChatService';
import { getGastronomia } from '../../services/CrudGastronomia';
import './Chatbot.css';

// Importación de utilidades, promts y constructores de contexto

import { buildDynamicContext } from '../../services/DynamicContextBuilder';

const Chatbot = () => {
  // Opciones rápidas de consulta (Se eliminó Transporte por no existir el módulo en el backend)
  const quickOptions = [
    'Tours',
    'Habitaciones',
    'Precios',
    'Comida',
    'Historia',
    'Reservas'
  ];

  // Estado del chat y mensajes
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: '¡Hola! Soy tu guía virtual de Raíces del Golfo. 🌴 ¿En qué puedo ayudarte hoy? Puedo contarte sobre nuestros tours, habitaciones, comida o historia del Golfo.',
      sender: 'bot',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  // Datos operacionales cargados por lazy-loading
  const [data, setData] = useState({
    tours: [],
    habitaciones: [],
    gastronomia: []
  });

  // Estado para el input de texto libre
  const [inputValue, setInputValue] = useState('');

  const messagesEndRef = useRef(null);
  const optionsRef = useRef(null);

  const scrollOptionsLeft = () => {
    optionsRef.current?.scrollBy({ left: -150, behavior: 'smooth' });
  };

  const scrollOptionsRight = () => {
    optionsRef.current?.scrollBy({ left: 150, behavior: 'smooth' });
  };

  // 1. LAZY LOADING INTELIGENTE:
  // Carga tours, habitaciones y gastronomía únicamente cuando el chat es abierto por primera vez o se envía el primer mensaje.
  useEffect(() => {
    if (isOpen && data.tours.length === 0 && data.habitaciones.length === 0) {
      const fetchOperationalData = async () => {
        try {
          const [toursRes, habsRes, gastroRes] = await Promise.all([
            getTours().catch(() => []),
            getHabitaciones().catch(() => []),
            getGastronomia().catch(() => [])
          ]);
          
          setData({
            tours: toursRes.filter(t => t.disponible),
            habitaciones: habsRes.filter(h => h.disponible),
            gastronomia: gastroRes.filter(g => g.disponible)
          });
        } catch (error) {
          console.error('Error al cargar datos dinámicos del chatbot:', error);
        }
      };
      
      fetchOperationalData();
    }
  }, [isOpen, data.tours.length, data.habitaciones.length]);

  // 2. MEMOIZACIÓN DEL CONTEXTO PÚBLICO:
  // Evita reconstruir el dynamicContext en cada renderizado o mensaje si los datos operativos no han cambiado.
  const dynamicContext = useMemo(() => {
    return buildDynamicContext(data.tours, data.habitaciones, data.gastronomia);
  }, [data.tours, data.habitaciones, data.gastronomia]);

  // 3. SCROLL AUTOMÁTICO AL ÚLTIMO MENSAJE
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // 4. GENERACIÓN DE RESPUESTAS DESACOPLADA Y CON HISTORIAL LIMITADO
  const generateResponse = async (input) => {
    try {
      setIsLoading(true);

      // Limitar historial enviado a los últimos 6 mensajes (3 interacciones usuario-bot)
      const trimmedHistory = messages
        .slice(-6)
        .map(m => ({
          role: m.sender === 'bot' ? 'assistant' : 'user',
          content: m.text
        }));

      // Consultas Públicas
      // Pasamos el contexto dinámico al prompt del sistema público
      const publicSystemPrompt = `Eres el guía virtual de Raíces del Golfo. 🌴
Tu objetivo es responder de forma sumamente ordenada, directa y altamente profesional.

Reglas de Formato estrictas que DEBES cumplir bajo cualquier circunstancia:
1. Responde SIEMPRE estructurando la información en un LISTADO PROFESIONAL Y LIMPIO, evitando párrafos de introducción o textos de relleno largos.
2. Cada ítem de tu listado debe seguir estrictamente esta plantilla de viñetas con guion:
   - [Nombre del Tour/Habitación/Plato]: [Descripción corta y atractiva] | Precio: $[Monto]
3. Agrupa y divide las secciones usando títulos concisos en mayúsculas con emojis (ejemplo: 🌊 TOURS DISPONIBLES, 🏨 HABITACIONES DISPONIBLES, 🍽️ GASTRONOMÍA LOCAL).
4. Mantén un diseño limpio, alineado, sin textos desordenados. Ve directo al punto de forma sofisticada.
5. Basándote únicamente en el catálogo real adjunto abajo. No inventes precios ni servicios que no existan.
6. Si el usuario pregunta por algo que no esté relacionado con los servicios ofrecidos por Raíces del Golfo, redirígelo amablemente a los servicios que ofrecemos.
7. si el usuario pregunta en otro idioma respondele en el mismo idioma, traduce toda la información, utiliza la misma estructura y formato profesional.
8. Si el usuario pregunta lo mismo que en la petición anterior, no repitas la respuesta, solo di "ya te di esa información", no respondas nada adicional a ese simple texto.
9. Si el usuario pregunta por información relacionada a tours, habitaciones o gastronomía, utiliza los datos que te proporciona la base de datos.
10. Tienes acceso a herramientas para buscar y cancelar reservas. Si el usuario te pide cancelar una reserva, no necesitas información adicional de su cuenta si ya tienes el ID. Procede a usar la herramienta de cancelación directamente.


${dynamicContext}`;

      return await getChatResponse(input, trimmedHistory, publicSystemPrompt);

    } catch (error) {
      console.error('Error al generar respuesta:', error);
      return 'Lo siento, en este momento no puedo procesar tu solicitud. Por favor, intenta de nuevo o comunícate con soporte.';
    } finally {
      setIsLoading(false);
    }
  };

  // 5. MANEJO DE SELECCIÓN DE OPCIÓN O MENSAJE DEL USUARIO
  const handleOptionSelect = async (option) => {
    if (!option || isLoading) return;

    // Crear mensaje del usuario
    const userMessage = {
      id: Date.now(),
      text: option,
      sender: 'user',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);

    // Obtener respuesta asíncrona de la IA
    const replyText = await generateResponse(option);

    // Agregar respuesta del bot
    const botResponse = {
      id: Date.now() + 1,
      text: replyText,
      sender: 'bot',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, botResponse]);
  };

  // 6. MANEJO DE ENVÍO DE MENSAJE MANUAL (INPUT LIBRE)
  const handleSendMessage = async (e) => {
    if (e) e.preventDefault();
    const trimmedInput = inputValue.trim();
    if (!trimmedInput || isLoading) return;

    // Crear mensaje del usuario
    const userMessage = {
      id: Date.now(),
      text: trimmedInput,
      sender: 'user',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    // Agregar mensaje del usuario y limpiar input de forma reactiva e inmediata
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');

    // Obtener respuesta de la IA
    const replyText = await generateResponse(trimmedInput);

    // Agregar respuesta del bot
    const botResponse = {
      id: Date.now() + 1,
      text: replyText,
      sender: 'bot',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, botResponse]);
  };

  return (
    <div className={`chatbot-wrapper ${isOpen ? 'open' : ''}`}>
      {/* Botón flotante disparador */}
      <button className="chat-trigger" onClick={() => setIsOpen(!isOpen)} aria-label="Abrir chat">
        {isOpen ? (
          <span className="close-icon">✕</span>
        ) : (
          <div className="chat-btn-content">
            <span className="chat-emoji">💬</span>
            <span className="badge">1</span>
          </div>
        )}
      </button>

      {/* Ventana de Chat */}
      <div className="chat-window">
        {/* Cabecera */}
        <div className="chat-header">
          <div className="bot-info">
            <div className="bot-avatar">🌴</div>
            <div>
              <h3>Asistente Raíces</h3>
              <span className="online-status">En línea</span>
            </div>
          </div>
          <button className="minimize-btn" onClick={() => setIsOpen(false)} aria-label="Minimizar">
            —
          </button>
        </div>

        {/* Listado de Mensajes */}
        <div className="chat-messages">
          {messages.map((msg) => (
            <div key={msg.id} className={`message-bubble ${msg.sender}`}>
              <p>{msg.text}</p>
              <span className="message-time">{msg.time}</span>
            </div>
          ))}
          
          {/* Loader visible durante carga asíncrona */}
          {isLoading && <div className="loader" />}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Pie de ventana y Opciones Rápidas */}
        <div className="chat-footer">
          <p className="chat-options-title">Selecciona una opción:</p>
          <div className="chat-options-container">
            <button 
              type="button" 
              className="scroll-btn left" 
              onClick={scrollOptionsLeft}
              aria-label="Desplazar a la izquierda"
            >
              ‹
            </button>
            <div className="chat-options" ref={optionsRef}>
              {quickOptions.map((option) => (
                <button
                  key={option}
                  type="button"
                  className="chat-option-btn"
                  onClick={() => handleOptionSelect(option)}
                  disabled={isLoading}
                >
                  {option}
                </button>
              ))}
            </div>
            <button 
              type="button" 
              className="scroll-btn right" 
              onClick={scrollOptionsRight}
              aria-label="Desplazar a la derecha"
            >
              ›
            </button>
          </div>

          {/* Formulario de Input de Texto Libre */}
          <form className="chat-input-container" onSubmit={handleSendMessage}>
            <input
              type="text"
              className="chat-input"
              placeholder="Escribe un mensaje..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              disabled={isLoading}
            />
            <button
              type="submit"
              className="send-btn"
              disabled={isLoading || !inputValue.trim()}
              aria-label="Enviar mensaje"
            >
              ➔
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;
