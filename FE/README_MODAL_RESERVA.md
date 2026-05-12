# Modal Flotante de Reserva - Guía de Uso

## ¿Qué es?

Un componente modal reutilizable que muestra 2 opciones cuando el usuario quiere reservar:

1. **Reservar en Línea** → Redirige al Login (si no está logueado) o al Panel de Cliente (si está logueado).
2. **Reservar por WhatsApp** → Abre WhatsApp con un mensaje predeterminado.

---

## Instalación y Configuración

### 1. Cambiar el número de WhatsApp

Edita `src/config/whatsapp.js` y reemplaza los números: