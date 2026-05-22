const rateLimit = require('express-rate-limit');

// Limitador general para rutas de recuperación de contraseña
// Máximo 3 solicitudes por cada 15 minutos para evitar spam de correos
const passwordResetLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 3, 
    message: {
        message: "Demasiadas solicitudes de recuperación. Inténtalo de nuevo en 15 minutos."
    },
    standardHeaders: true,
    legacyHeaders: false,
});

// Limitador para el login para evitar fuerza bruta
const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 10,
    message: {
        message: "Demasiados intentos de inicio de sesión. Por seguridad, tu acceso ha sido limitado temporalmente."
    }
});

module.exports = {
    passwordResetLimiter,
    loginLimiter
};
