const app = require('./app');
const { sequelize } = require('./models/index');

const PORT = process.env.PORT || 3000;

const startServer = async () => {

    try {

        await sequelize.authenticate();

        console.log('Conexión a la base de datos validada exitosamente.');

        // Sincronizar modelos si es necesario
        // await sequelize.sync({ alter: true });

        app.listen(PORT, () => {

            console.log(`Servidor corriendo en puerto ${PORT}`);

        });

    } catch (error) {

        console.error('Error al iniciar servidor:', error);

    }

};

startServer();