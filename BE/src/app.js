const express = require("express") // Llama al servidor de express para subir el servidor

const app = express() // Lo instancia, para usarlo por medio de app

const sequelize = require("./config/db") // Llama al ORM y a la configuración de la base de datos

require("./index") // Llama a todos los modelos para que se creen en la base de datos, por medio de sequelize

// SWAGGER
const swaggerUi = require("swagger-ui-express")
const swaggerJsdoc = require("swagger-jsdoc")

app.use(express.json()) // El servidor va a entender JSON

// CONFIG SWAGGER
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
    apis: ["./routes/*.js"]
}

const specs = swaggerJsdoc(options)

app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(specs))

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

// RUTAS
const usuarioRoutes = require("./routes/UsuarioRoutes")
const habitacionRoutes = require("./routes/HabitacionesRoutes")
const opinionRoutes = require("./routes/OpinionesRoutes")

app.use("/usuarios", usuarioRoutes)
app.use("/habitaciones", habitacionRoutes)
app.use("/opiniones", opinionRoutes)

app.listen(3000, () => {
    console.log('servidor corriendo');
})