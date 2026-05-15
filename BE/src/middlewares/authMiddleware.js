const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Acceso denegado. No se proporcionó token.' });
    }

    jwt.verify(token, 'secreto_jwt', (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'Token no válido o expirado.' });
        }
        req.user = user;
        next();
    });
};

module.exports = authenticateToken;
