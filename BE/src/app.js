require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { sequelize } = require('./models/index');
const authenticateToken = require('./middlewares/authMiddleware');

const caracteristicasRoutes = require('./routes/CaracteristicasRoutes');
const gastronomiaRoutes = require('./routes/GastronomiaRoutes');
const authRoutes = require('./routes/authRoutes');
const habitacionesRoutes = require('./routes/HabitacionesRoutes');
const opinionesRoutes = require('./routes/OpinionesRoutes');
const reservaciondehabitacionesRoutes = require('./routes/ReservaciondehabitacionesRoutes');
const reservacionesRoutes = require('./routes/ReservacionesRoutes');
const rolRoutes = require('./routes/RoleRoutes');
const toursRoutes = require('./routes/ToursRoutes');
const UsuarioRoutes = require('./routes/UsuarioRoutes');
const recommendationRoutes = require('./routes/RecommendationRoutes');
const claudeRoutes = require('./routes/ClaudeRoutes');

const app = express();

app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Swagger setup (optional for tests, but keeping it)
const swaggerUi = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");
const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Raices del Golfo API",
            version: "1.0.0",
            description: "Documentacion inicial de la API"
        },
        servers: [
            {
                url: "http://localhost:3000"
            }
        ]
    },
    apis: ["./src/routes/*.js"]
};
const specs = swaggerJsdoc(options);
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(specs));

// Public routes
app.use('/api/auth', authRoutes);

// Protected routes (middleware applied after auth)
// app.use(authenticateToken); // Uncomment if you want to protect all subsequent routes

app.use('/api/caracteristicas', caracteristicasRoutes);
app.use('/api/habitaciones', habitacionesRoutes);
app.use('/api/opiniones', opinionesRoutes);
app.use('/api/reservaciondehabitaciones', reservaciondehabitacionesRoutes);
app.use('/api/reservaciones', reservacionesRoutes);
app.use('/api/roles', rolRoutes);
app.use('/api/tours', toursRoutes);
app.use('/api/usuarios', UsuarioRoutes);
app.use('/api/recommendations', recommendationRoutes);
app.use('/api/claude', claudeRoutes);

app.use('/api/gastronomia', gastronomiaRoutes);

module.exports = app;
