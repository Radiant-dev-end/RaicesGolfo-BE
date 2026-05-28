import { ENDPOINTS } from '../config/api';

/**
 * Servicio para interactuar con la API de Groq usando Fetch directo.
 */

const getSanitizedApiKey = () => {
  const rawKey = import.meta.env.VITE_GROQ_API_KEY || '';
  return rawKey.trim().replace(/^["']|["']$/g, '');
};

const tools = [
  {
    type: "function",
    function: {
      name: "buscar_citas_raicesgolfo",
      description: "Busca el historial o próximas citas (reservaciones de tours y habitaciones) de un usuario en el sistema RaicesGolfo usando su correo electrónico. Úsala SIEMPRE que el usuario mencione cancelar, reagendar, ver, consultar o modificar una cita, reserva, reservación o booking, o cuando diga frases como 'mi cita', 'mis reservaciones', 'quiero cancelar', 'cambiar mi cita'.",
      parameters: {
        type: "object",
        properties: {
          email: {
            type: "string",
            description: "El correo electrónico del usuario para buscar sus citas y reservaciones."
          }
        },
        required: ["email"]
      }
    }
  },
  {
    type: "function",
    function: {
      name: "cancelar_cita_raicesgolfo",
      description: "Cancela una cita o reservación de tour o habitación específica dado el ID y el tipo. NO necesitas pedir confirmación de cuenta ni correo electrónico adicional; si ya tienes el ID, usa esta herramienta directamente.",
      parameters: {
        type: "object",
        properties: {
          tipo: {
            type: "string",
            enum: ["tour", "habitacion"],
            description: "Opcional. El tipo de reserva a cancelar: 'tour' o 'habitacion'."
          },
          id: {
            type: "integer",
            description: "Opcional. El ID numérico de la reservación que se desea cancelar."
          },
          email: {
            type: "string",
            description: "Opcional. El correo electrónico del usuario si no se tiene el ID de la reserva."
          },
          nombre_reserva: {
            type: "string",
            description: "Opcional. El nombre del tour o habitación que se desea cancelar (ej. 'El frente')."
          }
        },
        required: []
      }
    }
  }
];

export const getChatResponse = async (userMessage, chatHistory = [], systemPrompt = '') => {
  const apiKey = getSanitizedApiKey();

  if (!apiKey || apiKey.length < 10) {
    return "⚠️ Configuración Requerida: Por favor, abre el archivo 'FE/.env' y configura tu API Key de Groq.";
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 12000);

  try {
    const messages = [];
    if (systemPrompt) {
      messages.push({ role: 'system', content: systemPrompt });
    }
    messages.push(...chatHistory);
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
        max_tokens: 500,
        tools: tools,
        tool_choice: "auto"
      }),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.error?.message || `HTTP Error ${response.status}`);
    }

    const data = await response.json();
    const responseMessage = data.choices?.[0]?.message;

    // Verificar si el modelo decidió usar una tool
    if (responseMessage.tool_calls) {
      const toolCall = responseMessage.tool_calls[0];
      const toolName = toolCall.function.name;
      
      if (toolName === 'buscar_citas_raicesgolfo' || toolName === 'cancelar_cita_raicesgolfo') {
        const args = JSON.parse(toolCall.function.arguments);
        
        // Determinar qué acción enviar al backend basándose en la tool
        const actionPayload = toolName === 'buscar_citas_raicesgolfo' 
            ? { action: 'buscar', email: args.email } 
            : { action: 'cancelar', tipo: args.tipo, id: args.id, email: args.email, nombre_reserva: args.nombre_reserva };

        // Llamar a nuestro backend BE/src/skills
        let skillResult;
        try {
            const beResponse = await fetch(ENDPOINTS.CLAUDE_SKILL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ input: actionPayload })
            });
            const beData = await beResponse.json();
            skillResult = JSON.stringify(beData);
            
            // Si la cancelación fue exitosa, disparamos un evento personalizado para recargar la UI reactivamente
            if (toolName === 'cancelar_cita_raicesgolfo' && beData && beData.success) {
                try {
                    window.dispatchEvent(new CustomEvent('reservation-cancelled', { 
                        detail: { 
                            tipo: args.tipo, 
                            id: args.id, 
                            email: args.email, 
                            nombre_reserva: args.nombre_reserva 
                        } 
                    }));
                } catch (eventErr) {
                    console.error("Error dispatching reservation-cancelled event:", eventErr);
                }
            }
        } catch (err) {
            console.error("Error calling backend skill", err);
            skillResult = JSON.stringify({ success: false, message: "No se pudo conectar con el servidor." });
        }

        // Segunda llamada a Groq con el resultado de la tool
        messages.push(responseMessage);
        messages.push({
            role: "tool",
            tool_call_id: toolCall.id,
            name: toolCall.function.name,
            content: skillResult
        });

        const secondResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
              model: 'llama-3.3-70b-versatile',
              messages: messages,
              temperature: 0.4,
              max_tokens: 500
            })
        });

        const secondData = await secondResponse.json();
        return secondData.choices?.[0]?.message?.content || '';
      }
    }

    return responseMessage.content?.trim() || 'Lo siento, no obtuve una respuesta válida del asistente.';

  } catch (error) {
    clearTimeout(timeoutId);
    console.error("Error en GroqChatService:", error);
    if (error.name === 'AbortError') {
      return "La solicitud tardó demasiado tiempo en responder. Por favor, intenta de nuevo.";
    }
    return `Ocurrió un problema al comunicarme con el asistente virtual: ${error.message}`;
  }
};
