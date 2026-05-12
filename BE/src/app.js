const express = require("express") // Llama al servidor de express para subir el servidor

const app = express() // Lo instancia, para usarlo por medio de app

const sequelize = require("./config/db") // Llama al ORM y a la configuración de la base de datos

require("./index") // Llama a todos los modelos para que se creen en la base de datos, por medio de sequelize

app.use(express.json()) // El servidor va a entender JSON

/*
    Conexión por medio de  sequelize, con la base de datos, y luego levanta el servidor
*/

// Llamamos al archivo de routes dentro de usuario, para obtener
// las rutas
// Usamos el archivo de rutas, para que el servidor acceda a ellas
/*
    alter true permite modificaciones dentro de las tablas por medio de sequelize
    Sin tener que eliminar tablas o la base de datos
*/


app.listen(3000, () => {
    console.log('servidor corriendo');
})