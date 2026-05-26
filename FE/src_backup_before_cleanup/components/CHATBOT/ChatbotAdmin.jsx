import React, { useState, useEffect, useRef, useMemo } from 'react';
import { getChatResponse } from '../../services/GroqChatService';
import AdminContextService from '../../services/AdminContextService';
import { BASE_ADMIN_SYSTEM_PROMPT } from '../../constants/AdminPrompt';
import './Chatbot.css'; // Reutilizamos los estilos premium del chat

const ChatbotAdmin = () => {
  // Opciones rápidas exclusivas para el panel de administración
  const quickOptions = [
    '¿Quién llega hoy?',
    '¿Quién sale mañana?',
    '¿Qué habitaciones están ocupadas?',
    '¿Qué reservas están pendientes?',
    '¿Qué tours fueron reservados hoy?',
    '¿Que habitaciones estan limpias?',
    'Tours reservados para hoy',
    'Tours reservados',
    'Reservaciones pendientes',
    'Check-ins de hoy',
    'Check-outs de hoy'

  ];

  // Estado del chat y mensajes
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: '🤖 Bienvenido al Centro de Control de Raíces del Golfo. Soy tu asistente de administración. ¿Qué reporte u operativo deseas consultar hoy?',
      sender: 'bot',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

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

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // Generación de respuestas administrativas
  const generateResponse = async (input) => {
    try {
      setIsLoading(true);

      // Limitar historial a las últimas 3 interacciones
      const trimmedHistory = messages
        .slice(-6)
        .map(m => ({
          role: m.sender === 'bot' ? 'assistant' : 'user',
          content: m.text
        }));

      // Obtenemos el contexto administrativo real desde la base de datos (check-ins, check-outs, pagos, reservas)
      const adminContext = await AdminContextService.buildAdminContext(input);
      const finalAdminPrompt = `${BASE_ADMIN_SYSTEM_PROMPT}\n\n${adminContext}`;
      
      // Llamada a la IA de Groq
      return await getChatResponse(input, trimmedHistory, finalAdminPrompt);

    } catch (error) {
      console.error('Error en ChatbotAdmin:', error);
      return 'Disculpa, ha ocurrido un error al consultar la información administrativa. Verifica los logs.';
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async (e) => {
    if (e) e.preventDefault();
    const text = inputValue.trim();
    if (!text || isLoading) return;

    const userMessage = {
      id: Date.now(),
      text,
      sender: 'user',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');

    const reply = await generateResponse(text);

    const botMessage = {
      id: Date.now() + 1,
      text: reply,
      sender: 'bot',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, botMessage]);
  };

  const handleOptionSelect = async (option) => {
    if (!option || isLoading) return;

    const userMessage = {
      id: Date.now(),
      text: option,
      sender: 'user',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);

    const reply = await generateResponse(option);

    const botMessage = {
      id: Date.now() + 1,
      text: reply,
      sender: 'bot',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, botMessage]);
  };

  return (
    <div className={`chatbot-wrapper ${isOpen ? 'open' : ''}`}>
      {/* Botón flotante */}
      <button 
        className="chat-trigger" 
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Abrir asistente de administración"
      >
        {isOpen ? (
          <span className="close-icon">✕</span>
        ) : (
          <span className="chat-emoji">⚙️</span>
        )}
      </button>

      {/* Ventana de chat */}
      <div className="chat-window">
        <header className="chat-header">
          <div className="bot-info">
            <div className="bot-avatar">⚙️</div>
            <div>
              <h3>Panel Control IA</h3>
              <span className="online-status">Administrativo</span>
            </div>
          </div>
          <button className="minimize-btn" onClick={() => setIsOpen(false)}>—</button>
        </header>

        {/* Mensajes */}
        <div className="chat-messages">
          {messages.map((msg) => (
            <div key={msg.id} className={`message-bubble ${msg.sender}`}>
              <p className="message-text">{msg.text}</p>
              <span className="message-time">{msg.time}</span>
            </div>
          ))}
          {isLoading && (
            <div className="message-bubble bot loading">
              <div className="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Footer con QuickOptions y Form */}
        <footer className="chat-footer">
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
              {quickOptions.map((opt) => (
                <button
                  key={opt}
                  className="chat-option-btn"
                  onClick={() => handleOptionSelect(opt)}
                  disabled={isLoading}
                >
                  {opt}
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

          <form onSubmit={handleSendMessage} className="chat-input-container">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Pregunta sobre huéspedes, cobros o reservas..."
              className="chat-input"
              disabled={isLoading}
            />
            <button 
              type="submit" 
              className="send-btn"
              disabled={isLoading || !inputValue.trim()}
            >
              ➔
            </button>
          </form>
        </footer>
      </div>
    </div>
  );
};

export default ChatbotAdmin;
