---
name: buscar-citas-raicesgolfo
description: >
  Busca el historial o próximas citas (reservaciones de tours y habitaciones) de un usuario
  en el sistema RaicesGolfo usando su correo electrónico. Úsala SIEMPRE que el usuario mencione
  cancelar, reagendar, ver, consultar o modificar una cita, reserva, reservación o booking,
  o cuando diga frases como "mi cita de mañana", "mis reservaciones", "tengo una reserva",
  "quiero cancelar", "quiero cambiar mi cita", o cualquier referencia a una reservación existente
  sin conocer el ID exacto. Esta skill permite resolver el ID real de la reserva antes de
  ejecutar cualquier acción sobre ella.
---

# Buscar Citas — RaicesGolfo

## Cuándo usar esta skill

Úsala cuando el usuario haga referencia a una reservación existente sin conocer su ID:
- "Quiero cancelar mi cita de mañana"
- "¿Qué tours tengo reservados?"
- "Necesito cambiar la fecha de mi reserva"
- "¿Tengo alguna habitación reservada para este fin de semana?"

## Flujo completo

### Paso 1 — Obtener el correo del usuario

Si no está disponible en el contexto de la conversación, pide solo el correo:

> "Para buscar tus reservaciones, ¿me puedes dar el correo electrónico con el que te registraste?"

**Nota:** El modelo de usuarios no tiene campo de teléfono. Solo se puede buscar por email.

---

### Paso 2 — Buscar el ID del usuario por correo

```
GET {BASE_URL}/api/usuarios/obtener
```

No existe un endpoint de búsqueda por email directamente. Descarga todos los usuarios y filtra localmente por `email` (case-insensitive).

```js
const match = usuarios.find(u => u.email.toLowerCase() === emailIngresado.toLowerCase());
if (!match) { /* usuario no encontrado */ }
const userId = match.id_usuarios;
```

Si no se encuentra ningún usuario con ese correo, informa al usuario y pide que verifique el correo o que se registre.

---

### Paso 3 — Obtener reservaciones de tours

```
GET {BASE_URL}/api/reservaciones?userId={userId}
```

Respuesta esperada (array):
```json
[
  {
    "id": 12,
    "userId": 3,
    "userName": "Ana López",
    "tourName": "Tour Golfo",
    "date": "2026-05-26",
    "time": "08:00 AM",
    "status": "Pendiente",
    "createdAt": "2026-05-20T..."
  }
]
```

---

### Paso 4 — Obtener reservaciones de habitaciones

```
GET {BASE_URL}/api/reservaciondehabitaciones?userId={userId}
```

Respuesta esperada (array):
```json
[
  {
    "id": 5,
    "userId": 3,
    "userName": "Ana López",
    "roomId": "hab002",
    "roomName": "Suite Vista al Mar",
    "checkIn": "2026-05-27",
    "checkOut": "2026-05-30",
    "price": 150.00,
    "status": "Confirmada",
    "createdAt": "2026-05-19T..."
  }
]
```

---

### Paso 5 — Filtrar según la intención del usuario

Combina ambas listas y aplica el filtro correspondiente a lo que el usuario quiere hacer:

| Intención del usuario | Filtro sugerido |
|---|---|
| "mi cita de mañana" | `date === mañana` (tours) o `checkIn === mañana` (habitaciones) |
| "mis reservas futuras" | `date >= hoy` o `checkIn >= hoy` |
| "mis reservas pasadas" | `date < hoy` o `checkOut < hoy` |
| "todas mis reservas" | sin filtro adicional |
| "la reserva del Tour Golfo" | filtrar por `tourName` |
| "mi habitación" | solo las de habitaciones |

Para comparar fechas, usa la fecha actual del sistema. Las fechas en tours usan el campo `date` (formato `YYYY-MM-DD`). Las habitaciones usan `checkIn` y `checkOut`.

---

### Paso 6 — Presentar resultados y confirmar acción

Si se encontró exactamente **una** reservación relevante:
> Muéstrala con todos los detalles y confirma si es la correcta antes de proceder con la acción (cancelar, modificar, etc.)

Si se encontraron **varias** opciones:
> Muéstralas en una lista concisa (tour/habitación, fecha, estado) y pide que el usuario elija cuál.

Si **no se encontró ninguna**:
> Informa que no hay reservaciones que coincidan con esa descripción, y menciona si el usuario sí tiene otras reservas (pasadas o de otro tipo).

---

## Variables de configuración

| Variable | Descripción |
|---|---|
| `BASE_URL` | URL base de la API, e.g. `http://localhost:3000` |

La `BASE_URL` debe venir del contexto del sistema (system prompt del operador). Si no está disponible, pregunta al usuario o usa `http://localhost:3000` como fallback de desarrollo.

---

## Campos clave para acciones posteriores

Una vez identificada la reservación, los campos críticos son:

- **Tours:** `id` → usado en `DELETE /api/reservaciones/{id}` o `PATCH /api/reservaciones/{id}`
- **Habitaciones:** `id` → usado en `DELETE /api/reservaciondehabitaciones/{id}` o `PATCH /api/reservaciondehabitaciones/{id}`

Pasa ese `id` a la siguiente acción (cancelar, actualizar estado, etc.) sin volver a pedirle información al usuario.

---

## Estados válidos de una reservación

| Estado | Significado |
|---|---|
| `Pendiente` | Creada, sin confirmar |
| `Confirmada` | Confirmada por el hotel |
| `Cancelada` | Cancelada |

Al cancelar, el flujo correcto es hacer un `PATCH /{id}` con `{ "status": "Cancelada" }` en lugar de un `DELETE`, salvo que el operador indique lo contrario.

---

## Errores comunes y cómo manejarlos

| Situación | Respuesta sugerida |
|---|---|
| Email no encontrado | "No encontré ninguna cuenta con ese correo. ¿Podría verificarlo?" |
| Usuario sin reservaciones | "No tenés reservaciones activas con ese correo." |
| Error 500 del servidor | "Hubo un problema al conectar con el sistema. Intentá de nuevo en un momento." |
| Array vacío `[]` | El usuario existe pero no tiene reservas del tipo consultado |
