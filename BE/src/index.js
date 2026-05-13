require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { sequelize } = require('./models/index'); 

const caracteristicasRoutes = require('../routes/CaracteristicasRoutes');
const authRoutes = require('../routes/authRoutes');
const habitacionesRoutes = require('../routes/HabitacionesRoutes');
const opinionesRoutes = require('../routes/OpinionesRoutes');
const reservaciondehabitacionesRoutes = require('../routes/ReservaciondehabitacionesRoutes');
const reservacionesRoutes = require('../routes/ReservacionesRoutes');
const rolRoutes = require('../routes/RolRoutes');
const toursRoutes = require('../routes/ToursRoutes');
const UsuarioRoutes = require('./routes/UsuarioRoutes');


const app = express();
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', authRoutes);

app.use(authenticateToken);

app.use('/api/caracteristicas', caracteristicasRoutes);
app.use('/api/habitaciones', habitacionesRoutes);
app.use('/api/opiniones', opinionesRoutes);
app.use('/api/reservac', reservaciondehabitacionesRoutes);
app.use('/api/usuarios', reservacionesRoutes);
app.use('/api/pilotos', rolRoutes);
app.use('/api/reservas', toursRoutes);
app.use('/api/roles', UsuarioRoutes);

const PORT = process.env.PORT || 3000;

const startServer = async () => {
    try {
        await sequelize.authenticate();
        console.log('Conexión a la base de datos validada exitosamente.');
        
        app.listen(PORT, () => {
            console.log(`Servidor de API corriendo en el puerto ${PORT}`);
        });
    } catch (error) {
        console.error('Error al iniciar el servidor:', error);
    }
};

startServer();
