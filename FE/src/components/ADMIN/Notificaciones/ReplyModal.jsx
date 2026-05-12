import React, { useState } from 'react';
import Swal from 'sweetalert2';
import './ReplyModal.css';

function ReplyModal({ notification, onClose, onSend }) {
  const [reply, setReply] = useState('');
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!reply.trim()) return;

    setSending(true);
    try {
      await onSend(notification.id, reply);
      onClose();
    } catch (error) {
      console.error("Error al enviar respuesta:", error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Hubo un error al enviar la respuesta.',
        confirmButtonColor: '#ef4444'
      });
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="reply-modal-overlay" onClick={onClose}>
      <div className="reply-modal-content" onClick={e => e.stopPropagation()}>
        <div className="reply-modal-header">
          <h3>Responder a {notification.nombre || 'Usuario'}</h3>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>
        <div className="reply-modal-body">
          <div className="original-message">
            <strong>Mensaje original:</strong>
            <p>{notification.mensaje}</p>
          </div>
          <form onSubmit={handleSubmit}>
            <textarea
              placeholder="Escribe tu respuesta aqui..."
              value={reply}
              onChange={(e) => setReply(e.target.value)}
              required
              autoFocus
            ></textarea>
            <div className="reply-modal-actions">
              <button type="button" className="btn-cancel" onClick={onClose}>Cancelar</button>
              <button type="submit" className="btn-send" disabled={sending || !reply.trim()}>
                {sending ? 'Enviando...' : 'Enviar Respuesta'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ReplyModal;
