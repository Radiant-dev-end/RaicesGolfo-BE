const {Sequelize} = require('sequelize'); // Importación de sequelize (ORM)

const config = require("./config")  // Importación de la configuración de la BD


/*
 Tomamos todo lo del archivo de configuración 
    y por medio de sequelize creamos la instacia para que se conecte a la base de datos
*/
const sequelize = new Sequelize(
    config.development.name,
    config.development.user,
    config.development.password,
    {
        host: config.development.host,
        dialect: config.development.dialect
    }
)
module.exports = sequelize