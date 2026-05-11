# Raices del Golfo

Aplicacion web construida con React + Vite para promocionar servicios turisticos y gestionar reservas de tours y habitaciones. El proyecto incluye areas publicas para visitantes, autenticacion por roles y paneles privados para administracion y clientes.

## Objetivo del proyecto

La pagina esta pensada para:

- Mostrar informacion turistica de las islas y servicios disponibles.
- Permitir el registro e inicio de sesion de usuarios.
- Gestionar reservas de tours y habitaciones.
- Dar al administrador herramientas para editar usuarios, habitaciones, reservas, mensajes y configuraciones.
- Ofrecer al cliente un panel para revisar sus solicitudes, su perfil y comunicarse con administracion.

## Tecnologias usadas

- React 18
- Vite
- React Router DOM
- SweetAlert2
- ESLint
- `json-server` como backend local usando `db.json`

## Como ejecutar el proyecto

### 1. Instalar dependencias

```bash
npm install
```

### 2. Levantar el backend local

El proyecto consume datos desde `http://localhost:3007`. Para simular la API se usa `db.json`.

```bash
npx json-server --watch db.json --port 3007
```

### 3. Levantar el frontend

```bash
npm run dev
```

### 4. Otras tareas utiles

```bash
npm run lint
npm run build
npm run preview
```

## Estructura general

```text
src/
  main.jsx                  -> punto de entrada de React
  routes/                   -> configuracion de rutas y proteccion
  pages/                    -> paginas principales
  components/               -> componentes visuales y modulos funcionales
  services/                 -> consumo de API y operaciones CRUD
  config/                   -> endpoints y configuraciones globales
  styles/                   -> estilos compartidos
db.json                     -> base de datos local para json-server
```

## Como funciona la aplicacion

### 1. Entrada principal

El archivo [`src/main.jsx`](src/main.jsx) monta React dentro del `div#root` y renderiza [`src/routes/Routing.jsx`](src/routes/Routing.jsx).

### 2. Sistema de rutas

[`src/routes/Routing.jsx`](src/routes/Routing.jsx) es el mapa de navegacion principal:

- Rutas publicas:
  - `/`
  - `/tours`
  - `/habitaciones`
  - `/gastronomia`
  - `/transporte`
  - `/acerca-de`
  - `/historia-de-las-islas`
- Rutas de acceso:
  - `/login`
  - `/registro`
- Rutas protegidas:
  - `/admin`
  - `/cliente`

Ademas, `Routing.jsx` monta dos componentes globales:

- `Chatbot`
- `AccessibilityWidget`

Esto significa que ambos estan disponibles en toda la navegacion, no solo en una pagina puntual.

### 3. Proteccion por roles

[`src/routes/ProtectedRoute.jsx`](src/routes/ProtectedRoute.jsx) protege las vistas privadas.

Su logica es:

1. Leer `user` desde `localStorage`.
2. Si no existe sesion, redirigir a `/login`.
3. Si existe, parsear el JSON.
4. Verificar si el rol del usuario coincide con los roles permitidos.
5. Si el rol no coincide, redirigir al panel correcto o al inicio.

Roles detectados en el proyecto:

- `admin`
- `cliente`
- `user` como alias tratado como cliente en algunas validaciones

## Flujo principal por tipo de usuario

### Visitante

Un visitante puede:

- navegar por inicio, tours, habitaciones, gastronomia, transporte e historia
- leer contenido informativo
- abrir formularios y pantallas de acceso

### Cliente

Cuando un usuario inicia sesion con rol `cliente`, entra al panel [`src/pages/Cliente.jsx`](src/pages/Cliente.jsx), que renderiza [`src/components/CLIENTE/ClientePag.jsx`](src/components/CLIENTE/ClientePag.jsx).

Desde ahi puede:

- ver tours disponibles
- crear reservas de tours
- ver historial de reservas
- reservar habitaciones
- editar su perfil
- enviar mensajes al administrador

### Administrador

Cuando el rol es `admin`, entra al panel [`src/pages/Admin.jsx`](src/pages/Admin.jsx), que carga [`src/components/ADMIN/PANEL/AdminPanel.jsx`](src/components/ADMIN/PANEL/AdminPanel.jsx).

El panel administra:

- dashboard con estadisticas
- usuarios
- habitaciones
- tours
- reservaciones
- mensajes
- configuraciones

## Paginas principales

### Inicio

[`src/pages/Inicio.jsx`](src/pages/Inicio.jsx) ensambla la landing usando componentes como:

- `Navbar`
- `Hero`
- `Informacion`
- `Logros`
- `Contenedor`
- `Carrusel`
- `ImgUltima`
- `Footer`

La pagina de inicio no concentra demasiada logica; su trabajo es componer secciones reutilizables.

### Tours

La pagina de tours carga catalogos turisticos y tarjetas de detalle. Parte de la informacion dinamica tambien se usa dentro del panel del cliente para reservar.

### Habitaciones

La pagina de habitaciones combina:

- habitaciones estaticas definidas en el frontend
- habitaciones traidas desde la API
- reservas de habitaciones para calcular ocupacion actual

Con esto se puede mostrar si una habitacion esta disponible, ocupada o bloqueada manualmente.

### Gastronomia, Transporte, Historia y Acerca de

Estas paginas funcionan como secciones informativas y visuales que refuerzan la experiencia del sitio y el contexto turistico del proyecto.

## Capa de servicios

La carpeta [`src/services`](src/services) encapsula toda la comunicacion con la API local. La idea es separar la interfaz visual de la logica de datos.

### Configuracion central

[`src/config/api.js`](src/config/api.js) declara:

- `API_BASE_URL`
- `ENDPOINTS`

Esto evita repetir URLs duras por todo el proyecto.

### Autenticacion

[`src/services/authService.js`](src/services/authService.js) maneja:

- registro de usuarios
- login por `email` y `password`

El login hace dos intentos:

1. consulta directa con query string a `json-server`
2. fallback manual filtrando todos los usuarios

Esto ayuda cuando el filtrado por query no responde como se espera.

### Contactos

[`src/services/CrudContactos.js`](src/services/CrudContactos.js) envia mensajes del formulario de contacto al endpoint configurado.

### Habitaciones

[`src/services/CrudHabitaciones.js`](src/services/CrudHabitaciones.js) permite:

- listar habitaciones
- crear habitaciones
- actualizar habitaciones
- eliminar habitaciones

### Reservas de tours

Hay dos servicios relacionados:

- [`src/services/CrudReservas.js`](src/services/CrudReservas.js): reservas orientadas al cliente
- [`src/services/CrudReservaciones.js`](src/services/CrudReservaciones.js): gestion de reservaciones para administracion

### Reservas de habitaciones

[`src/services/CrudReservasHabitaciones.js`](src/services/CrudReservasHabitaciones.js) permite:

- consultar reservas por usuario
- crear reservas
- listar todas las reservas
- actualizar reservas
- eliminar reservas

## Base de datos local

El archivo [`db.json`](db.json) funciona como base de datos de desarrollo. Entre sus colecciones principales estan:

- `users`
- `habitaciones`
- `tours`
- `reservations`
- `room_reservations`
- `opiniones`
- `formularioContacto`
- `settings`

Estas colecciones son consumidas desde los servicios mediante `fetch`.

## Como se guarda la sesion

La sesion se maneja principalmente con `localStorage`, guardando un objeto `user`.

Ese objeto se usa para:

- proteger rutas
- identificar el rol
- cargar datos del usuario actual
- relacionar reservas y mensajes con el cliente autenticado

## Flujo de una reserva de tour

1. El cliente entra a su panel.
2. Se cargan tours desde la API.
3. El cliente elige tour, fecha y horario.
4. Se valida disponibilidad.
5. Se envian los datos al endpoint de reservas.
6. El administrador puede revisar y actualizar el estado.

## Flujo de una reserva de habitacion

1. El cliente selecciona una habitacion.
2. Ingresa `check-in` y `check-out`.
3. El sistema calcula disponibilidad usando reservas existentes.
4. Se calcula el precio total estimado.
5. La solicitud se guarda en `room_reservations`.
6. El administrador puede aprobar, modificar o eliminar la reserva.

## Comentarios agregados en el codigo

Se agregaron comentarios explicativos en archivos clave para una lectura mas clara:

- [`src/main.jsx`](src/main.jsx)
- [`src/routes/Routing.jsx`](src/routes/Routing.jsx)
- [`src/routes/ProtectedRoute.jsx`](src/routes/ProtectedRoute.jsx)
- [`src/pages/Inicio.jsx`](src/pages/Inicio.jsx)
- [`src/pages/Admin.jsx`](src/pages/Admin.jsx)
- [`src/pages/Cliente.jsx`](src/pages/Cliente.jsx)
- [`src/config/api.js`](src/config/api.js)
- [`src/services/authService.js`](src/services/authService.js)
- [`src/services/CrudContactos.js`](src/services/CrudContactos.js)
- [`src/services/CrudHabitaciones.js`](src/services/CrudHabitaciones.js)
- [`src/services/CrudReservaciones.js`](src/services/CrudReservaciones.js)
- [`src/services/CrudReservasHabitaciones.js`](src/services/CrudReservasHabitaciones.js)
- [`src/components/ADMIN/PANEL/AdminPanel.jsx`](src/components/ADMIN/PANEL/AdminPanel.jsx)
- [`src/components/CLIENTE/ClientePag.jsx`](src/components/CLIENTE/ClientePag.jsx)

## Credenciales de prueba

En `db.json` existen usuarios de prueba con rol administrador y cliente. Puedes revisar esa coleccion para entrar rapidamente al sistema durante las pruebas.

## Posibles mejoras futuras

- migrar de `localStorage` a un sistema real de autenticacion con tokens
- mover validaciones criticas al backend
- unificar textos con problemas de codificacion
- agregar pruebas automatizadas
- separar aun mas la logica de negocio en hooks personalizados
- normalizar nombres de archivos y componentes

## Resumen rapido para exponer el proyecto

Si te preguntan "como funciona la pagina", puedes resumirlo asi:

1. React renderiza la app desde `main.jsx`.
2. `Routing.jsx` decide que pagina mostrar segun la ruta.
3. `ProtectedRoute.jsx` protege paneles segun el rol guardado en `localStorage`.
4. Las paginas ensamblan componentes visuales.
5. Los servicios hacen `fetch` a `json-server` usando endpoints centralizados.
6. `db.json` actua como backend local para usuarios, tours, habitaciones, reservas y mensajes.
