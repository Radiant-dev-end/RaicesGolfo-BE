const { Habitacion } = require("../models");

const HabitacionController = {

    getAll: async (req, res) => {
        try {
            const habitaciones = await Habitacion.findAll();
            const mappedHabitaciones = habitaciones.map(h => {
                const habData = h.toJSON();
                habData.id = habData.numero || habData.id_habitaciones;
                habData.precio = habData.precio_noche;
                habData.status = habData.estado;
                return habData;
            });
            res.json(mappedHabitaciones);
        } catch (error) {
            res.status(500).json({
                message: "Error al obtener habitaciones",
                error: error.message
            });
        }
    },

    getById: async (req, res) => {
        try {
            const { id } = req.params;
            let habitacion = await Habitacion.findByPk(id);
            if (!habitacion) {
                habitacion = await Habitacion.findOne({ where: { numero: id } });
            }
            if (!habitacion) {
                return res.status(404).json({
                    message: "Habitación no encontrada"
                });
            }
            const habData = habitacion.toJSON();
            habData.id = habData.numero || habData.id_habitaciones;
            habData.precio = habData.precio_noche;
            habData.status = habData.estado;
            res.json(habData);
        } catch (error) {
            res.status(500).json({
                message: "Error al buscar habitación",
                error: error.message
            });
        }
    },

    create: async (req, res) => {
        try {
            const {
                id_caracteristicas,
                numero,
                nombre,
                descripcion,
                precio,
                capacidad,
                tipo,
                disponible,
                imagen,
                status,
                features,
            } = req.body;

            // Mapping price for consistency with test sending 'precio'
            const precio_noche = precio;

            // Compatibilidad con frontend: autogenerar numero y id_caracteristicas si no vienen
            let final_id_caracteristicas = id_caracteristicas;
            if (final_id_caracteristicas === undefined) {
                const { Caracteristica } = require("../models");
                const firstCarac = await Caracteristica.findOne();
                final_id_caracteristicas = firstCarac ? firstCarac.id_caracteristicas : 1;
            }
            const final_numero = numero || `HAB-${Math.floor(1000 + Math.random() * 9000)}`;

            console.log("DEBUG CREACION HABITACION:", {
                nombre,
                descripcion,
                precio_noche,
                capacidad,
                tipo,
                final_numero,
                final_id_caracteristicas
            });

            if (!nombre || !descripcion || precio_noche === undefined || !capacidad || !tipo || !final_numero || final_id_caracteristicas === undefined) {
                return res.status(400).json({
                    message: "Todos los campos obligatorios deben ser completados"
                });
            }

            if (nombre.length < 3) {
                return res.status(400).json({
                    message: "El nombre debe tener mínimo 3 caracteres"
                });
            }

            if (descripcion.length < 10) {
                return res.status(400).json({
                    message: "La descripción debe tener mínimo 10 caracteres"
                });
            }

            if (precio_noche <= 0) {
                return res.status(400).json({
                    message: "El precio debe ser mayor a 0"
                });
            }

            if (capacidad <= 0) {
                return res.status(400).json({
                    message: "La capacidad debe ser mayor a 0"
                });
            }

            const nuevaHabitacion = await Habitacion.create({
                id_caracteristicas: final_id_caracteristicas,
                numero: final_numero,
                nombre,
                descripcion,
                precio_noche,
                capacidad,
                tipo,
                disponible: disponible !== undefined ? disponible : true,
                imagen,
                estado: status,
                features
            });

            const habData = nuevaHabitacion.toJSON();
            habData.id = habData.numero || habData.id_habitaciones;
            habData.precio = habData.precio_noche;
            habData.status = habData.estado;

            res.status(201).json(habData);

        } catch (error) {
            res.status(500).json({
                message: "Error al crear habitación",
                error: error.message
            });
        }
    },

    update: async (req, res) => {
        try {
            const { id } = req.params;
            let habitacion = await Habitacion.findByPk(id);
            if (!habitacion) {
                habitacion = await Habitacion.findOne({ where: { numero: id } });
            }
            if (!habitacion) {
                return res.status(404).json({
                    message: "Habitación no encontrada"
                });
            }

            const {
                id_caracteristicas,
                numero,
                nombre,
                descripcion,
                precio,
                capacidad,
                tipo,
                disponible,
                imagen,
                status,
                features
            } = req.body;

            if (nombre && nombre.length < 3) {
                return res.status(400).json({
                    message: "El nombre debe tener mínimo 3 caracteres"
                });
            }

            if (descripcion && descripcion.length < 10) {
                return res.status(400).json({
                    message: "La descripción debe tener mínimo 10 caracteres"
                });
            }

            if (precio !== undefined && precio <= 0) {
                return res.status(400).json({
                    message: "El precio debe ser mayor a 0"
                });
            }

            if (capacidad && capacidad <= 0) {
                return res.status(400).json({
                    message: "La capacidad debe ser mayor a 0"
                });
            }

            await habitacion.update({
                id_caracteristicas: id_caracteristicas !== undefined ? id_caracteristicas : habitacion.id_caracteristicas,
                numero: numero !== undefined ? numero : habitacion.numero,
                nombre,
                descripcion,
                precio_noche: precio !== undefined ? precio : habitacion.precio_noche,
                capacidad,
                tipo,
                disponible,
                imagen,
                estado: status,
                features
            });

            const habData = habitacion.toJSON();
            habData.id = habData.numero || habData.id_habitaciones;
            habData.precio = habData.precio_noche;
            habData.status = habData.estado;

            res.json(habData);

        } catch (error) {
            res.status(500).json({
                message: "Error al actualizar habitación",
                error: error.message
            });
        }
    },

    delete: async (req, res) => {
        try {
            const { id } = req.params;
            let habitacion = await Habitacion.findByPk(id);
            if (!habitacion) {
                habitacion = await Habitacion.findOne({ where: { numero: id } });
            }
            if (!habitacion) {
                return res.status(404).json({
                    message: "Habitación no encontrada"
                });
            }
            await habitacion.destroy();
            res.json({
                message: "Habitación eliminada correctamente"
            });
        } catch (error) {
            res.status(500).json({
                message: "Error al eliminar habitación",
                error: error.message
            });
        }
    }

};

module.exports = HabitacionController;