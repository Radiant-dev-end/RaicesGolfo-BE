const jwt = require('jsonwebtoken');
const { Usuario, Role } = require('../models');

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Token de autenticación no proporcionado' });
    }

    jwt.verify(token, process.env.JWT_SECRET || 'secreto_jwt', (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'Token inválido o expirado' });
        }
        req.user = user;
        next();
    });
};

const isAdmin = async (req, res, next) => {
    try {
        const user = await Usuario.findByPk(req.user.id, {
            include: [{ model: Role, as: 'role' }]
        });

        if (!user || !user.role || user.role.nombre.toLowerCase() !== 'admin') {
            return res.status(403).json({ message: 'Acceso denegado: Se requieren permisos de administrador' });
        }

        next();
    } catch (error) {
        res.status(500).json({ message: 'Error al verificar permisos de administrador', error: error.message });
    }
};

const isHotel = async (req, res, next) => {
    try {
        const user = await Usuario.findByPk(req.user.id, {
            include: [{ model: Role, as: 'role' }]
        });

        const roleName = user?.role?.nombre.toLowerCase();
        if (roleName === 'admin' || roleName === 'hotel') {
            return next();
        }

        return res.status(403).json({ message: 'Acceso denegado: Se requieren permisos de hotel o administrador' });
    } catch (error) {
        res.status(500).json({ message: 'Error al verificar permisos', error: error.message });
    }
};

module.exports = {
    authenticateToken,
    isAdmin,
    isHotel
};
