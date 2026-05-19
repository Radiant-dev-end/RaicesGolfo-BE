const jwt = require("jsonwebtoken");

const authUsuario = (req, res, next) => {

    try {

        // Obtener token del header
        const token = req.header("Authorization");

        // Verificar si existe token
        if (!token) {

            return res.status(401).json({
                message: "Acceso denegado. Token requerido"
            });

        }

        // Verificar token
        const verified = jwt.verify(token, "secreto_jwt");

        // Guardar datos del usuario
        req.usuario = verified;

        next();

    } catch (error) {

        res.status(400).json({
            message: "Token inválido"
        });

    }

};

module.exports = authUsuario;