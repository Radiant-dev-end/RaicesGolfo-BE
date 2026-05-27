/**
 * Servicio para interactuar con la API de Groq usando Fetch directo.
 */

// Recupera y sanitiza dinámicamente la API Key de las variables de entorno de Vite
const getSanitizedApiKey = () => {
  const rawKey = import.meta.env.VITE_GROQ_API_KEY || '';
  return rawKey.trim().replace(/^["']|["']$/g, '');
};

/**
 * Obtiene la respuesta de la IA de Groq para el mensaje del usuario.
 * @param {string} userMessage - Mensaje enviado por el usuario.
 * @param {Array} chatHistory - Historial previo recortado [{ role, content }].
 * @param {string} systemPrompt - Prompt de sistema personalizado (opcional).
 * @returns {Promise<string>} La respuesta generada por la IA o mensaje genérico de fallback.
 */
export const getChatResponse = async (userMessage, chatHistory = [], systemPrompt = '') => {
  const apiKey = getSanitizedApiKey();

  // Log claro en consola
  console.log(`[GroqChatService] Procesando consulta. Longitud API Key detectada: ${apiKey.length} chars.`);

  if (!apiKey || apiKey === 'tu_api_key_real' || apiKey.length < 10) {
    console.warn("[GroqChatService] Advertencia: Clave API no configurada o con valor placeholder predeterminado.");
    return "⚠️ Configuración Requerida: Por favor, abre el archivo 'FE/.env' y reemplaza 'tu_api_key_real' con tu API Key real de Groq (gsk_...).";
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 12000); // 12 segundos de timeout

  try {
    const messages = [];
    
    if (systemPrompt) {
      messages.push({ role: 'system', content: systemPrompt });
    }

    // Agregar el historial (que ya viene formateado como { role, content })
    messages.push(...chatHistory);

    // Agregar el mensaje actual del usuario
    messages.push({ role: 'user', content: userMessage });

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: messages,
        temperature: 0.4,
        max_tokens: 400
      }),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      if (response.status === 401) {
        console.error("[GroqChatService] Error 401: Groq API Key inválida o caducada.");
        return "❌ Error 401 (Acceso no Autorizado): La clave de API de Groq ingresada en tu archivo 'FE/.env' es inválida o ha expirado. Por favor, verifica que la clave comience con 'gsk_' y no contenga comillas o espacios.";
      }
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.error?.message || `HTTP Error ${response.status}`);
    }

    const data = await response.json();
    let reply = data.choices?.[0]?.message?.content || '';

    return reply.trim() || 'Lo siento, no obtuve una respuesta válida del asistente.';

  } catch (error) {
    clearTimeout(timeoutId);
    console.error("Error en GroqChatService:", error);
    if (error.name === 'AbortError') {
      return "La solicitud tardó demasiado tiempo en responder. Por favor, intenta de nuevo.";
    }
    return `Ocurrió un problema al comunicarme con el asistente virtual: ${error.message}`;
  }
};



