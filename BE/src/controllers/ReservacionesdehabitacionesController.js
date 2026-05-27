const { ReservacionHabitaciones, Reservacion, Habitacion, Usuario } = require("../models");
const { sendConfirmationEmail } = require('../services/emailService');

// Helper to format database Room Reservation into frontend format
const formatRoomReservation = (rh) => {
    // Determine userId from parent Reservation if joined
    const userId = rh.Reservation ? rh.Reservation.id_usuarios : 1;
    
    // Convert id_habitaciones integer (e.g. 2) to frontend roomId string (e.g. "hab002")
    const roomId = rh.id_habitaciones ? `hab${String(rh.id_habitaciones).padStart(3, '0')}` : 'hab001';

    // Format valid Date tiempo to time string format (e.g. "12:00 PM" or "12:00")
    let timeStr = '12:00 PM';
    if (rh.tiempo) {
        try {
            timeStr = new Date(rh.tiempo).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
        } catch (e) {
            timeStr = String(rh.tiempo);
        }
    }

    return {
        id: rh.id_reservacion_habitaciones,
        userId: userId,
        userName: rh.nombre_usuario,
        roomId: roomId,
        roomName: rh.nombre_habitacion,
        checkIn: rh.checkIn,
        checkOut: rh.checkOut,
        time: timeStr,
        price: parseFloat(rh.precio),
        status: rh.estado,
        createdAt: rh.creado_en
    };
};

const ReservacionHabitacionesController = {

    getAll: async (req, res) => {
        try {
            const { userId } = req.query;
            let filter = {};

            if (userId) {
                const parsedUserId = parseInt(userId, 10);
                if (!isNaN(parsedUserId)) {
                    // Find all parent reservations for this user
                    const parentReservas = await Reservacion.findAll({ where: { id_usuarios: parsedUserId } });
                    const parentIds = parentReservas.map(r => r.id_reservaciones);
                    filter = { id_reservaciones: parentIds };
                }
            }

            const reservaciones = await ReservacionHabitaciones.findAll({
                where: filter,
                include: [{ model: Reservacion }]
            });

            res.json(reservaciones.map(formatRoomReservation));
        } catch (error) {
            res.status(500).json({
                message: "Error al obtener reservaciones",
                error: error.message
            });
        }
    },

    getById: async (req, res) => {
        try {
            const { id } = req.params;
            const reservacion = await ReservacionHabitaciones.findByPk(id, {
                include: [{ model: Reservacion }]
            });
            if (!reservacion) {
                return res.status(404).json({
                    message: "Reservación no encontrada"
                });
            }
            res.json(formatRoomReservation(reservacion));
        } catch (error) {
            res.status(500).json({
                message: "Error al buscar reservación",
                error: error.message
            });
        }
    },

    create: async (req, res) => {
        try {
            const {
                nombre_usuario,
                id_reservaciones,
                id_habitaciones,
                nombre_habitacion,
                fecha_checkin,
                fecha_checkout,
                total,
                status,
                tipo,
                item,
                date,
                tiempo,
                creado_en,

                // Frontend fields
                userId,
                userName,
                roomId,
                roomName,
                checkIn,
                checkOut,
                time,
                price,
                email,
                createdAt
            } = req.body;

            // Map frontend fields to DB equivalents
            const nombre_usuario_val = userName || nombre_usuario || 'Cliente';
            const nombre_habitacion_val = roomName || nombre_habitacion || 'Habitación';
            const checkIn_val = checkIn || fecha_checkin;
            const checkOut_val = checkOut || fecha_checkout;
            const precio_val = price !== undefined ? price : (total !== undefined ? total : 0);
            const status_val = status || 'Pendiente';
            const tipo_val = tipo || 'Habitación';
            const item_val = item || nombre_habitacion_val;
            const date_val = date || (checkIn_val && checkOut_val ? `${checkIn_val} al ${checkOut_val}` : 'Fecha no especificada');
            const creado_en_val = creado_en || createdAt || new Date();

            // Resolve id_habitaciones from roomId
            let id_habitaciones_val = id_habitaciones;
            if (!id_habitaciones_val && roomId) {
                let room = null;
                const roomIdStr = String(roomId);
                
                // Buscar por numero exacto primero (ej. "hab002")
                room = await Habitacion.findOne({ where: { numero: roomIdStr } });
                
                if (!room) {
                    const cleanRoomId = parseInt(roomIdStr.replace(/[^\d]/g, ''), 10);
                    if (!isNaN(cleanRoomId)) {
                        room = await Habitacion.findByPk(cleanRoomId);
                    }
                }
                
                if (!room && roomName) {
                    room = await Habitacion.findOne({ where: { nombre: roomName } });
                }
                
                if (room) {
                    id_habitaciones_val = room.id_habitaciones;
                } else {
                    const cleanRoomId = parseInt(roomIdStr.replace(/[^\d]/g, ''), 10);
                    id_habitaciones_val = cleanRoomId || 1;
                }
            }

            // Create parent Reservacion if missing
            let id_reservaciones_val = id_reservaciones;
            if (!id_reservaciones_val) {
                let parsedUserId = parseInt(userId, 10);
                if (isNaN(parsedUserId)) parsedUserId = 1;
                
                const parentReservacion = await Reservacion.create({
                    id_usuarios: parsedUserId,
                    nombre_usuario: nombre_usuario_val,
                    nombre_habitacion: nombre_habitacion_val,
                    precio: precio_val,
                    fecha: checkIn_val || new Date().toISOString().split('T')[0],
                    estado: status_val,
                    creado_en: creado_en_val
                });
                id_reservaciones_val = parentReservacion.id_reservaciones;
            }

            // Resolve tiempo to a valid Date object
            let tiempo_val = tiempo;
            if (!tiempo_val) {
                const timeStr = time || '12:00';
                const dateStr = checkIn_val || new Date().toISOString().split('T')[0];
                try {
                    tiempo_val = new Date(`${dateStr}T${timeStr.includes(':') ? timeStr : '12:00'}`);
                    if (isNaN(tiempo_val.getTime())) {
                        tiempo_val = new Date();
                    }
                } catch {
                    tiempo_val = new Date();
                }
            }

            if (
                !nombre_usuario_val ||
                !id_reservaciones_val ||
                !id_habitaciones_val ||
                !nombre_habitacion_val ||
                !checkIn_val ||
                !checkOut_val ||
                precio_val === undefined ||
                !tipo_val ||
                !item_val ||
                !date_val ||
                !tiempo_val ||
                !creado_en_val
            ) {
                return res.status(400).json({
                    message: "Todos los campos obligatorios deben ser completados"
                });
            }

            if (precio_val < 0) {
                return res.status(400).json({
                    message: "El total debe ser mayor o igual a 0"
                });
            }

            const fechaEntrada = new Date(checkIn_val);
            const fechaSalida = new Date(checkOut_val);
            if (fechaSalida <= fechaEntrada) {
                return res.status(400).json({
                    message: "La fecha de salida debe ser mayor a la fecha de entrada"
                });
            }

            const nuevaReservacion = await ReservacionHabitaciones.create({
                nombre_usuario: nombre_usuario_val,
                id_reservaciones: id_reservaciones_val,
                id_habitaciones: id_habitaciones_val,
                nombre_habitacion: nombre_habitacion_val,
                checkIn: checkIn_val,
                checkOut: checkOut_val,
                precio: precio_val,
                estado: status_val,
                tipo: tipo_val,
                item: item_val,
                date: date_val,
                tiempo: tiempo_val,
                creado_en: creado_en_val
            });

            // Return formatted reservation, joining the parent Reservation dynamically
            const fullyLoaded = await ReservacionHabitaciones.findByPk(nuevaReservacion.id_reservacion_habitaciones, {
                include: [{ model: Reservacion }]
            });

            const formattedRes = formatRoomReservation(fullyLoaded);
            let emailSent = false;
            
            // Envío de correo de confirmación
            try {
                let targetEmail = email; // del frontend
                if (!targetEmail) {
                    const userIdToEmail = fullyLoaded.Reservation ? fullyLoaded.Reservation.id_usuarios : 1;
                    const user = await Usuario.findByPk(userIdToEmail);
                    if (user && user.email) targetEmail = user.email;
                }
                
                if (targetEmail) {
                    emailSent = await sendConfirmationEmail(targetEmail, 'room', formattedRes);
                }
            } catch (err) {
                console.error("Error silencioso enviando correo de habitación:", err);
            }

            res.status(201).json({ ...formattedRes, emailSent });

        } catch (error) {
            res.status(500).json({
                message: "Error al crear reservación",
                error: error.message
            });
        }
    },

    update: async (req, res) => {
        try {
            const { id } = req.params;
            const reservacion = await ReservacionHabitaciones.findByPk(id, {
                include: [{ model: Reservacion }]
            });
            if (!reservacion) {
                return res.status(404).json({
                    message: "Reservación no encontrada"
                });
            }

            const {
                nombre_usuario,
                id_reservaciones,
                id_habitaciones,
                nombre_habitacion,
                fecha_checkin,
                fecha_checkout,
                total,
                status,
                tipo,
                item,
                date,
                tiempo,
                creado_en,

                // Frontend fields
                userId,
                userName,
                roomId,
                roomName,
                checkIn,
                checkOut,
                time,
                price,
                createdAt
            } = req.body;

            // Map and update selectively
            const updates = {};
            if (nombre_usuario !== undefined || userName !== undefined) updates.nombre_usuario = userName || nombre_usuario;
            if (nombre_habitacion !== undefined || roomName !== undefined) updates.nombre_habitacion = roomName || nombre_habitacion;
            if (fecha_checkin !== undefined || checkIn !== undefined) updates.checkIn = checkIn || fecha_checkin;
            if (fecha_checkout !== undefined || checkOut !== undefined) updates.checkOut = checkOut || fecha_checkout;
            if (total !== undefined || price !== undefined) updates.precio = price !== undefined ? price : total;
            if (status !== undefined) updates.estado = status;
            if (tipo !== undefined) updates.tipo = tipo;
            if (item !== undefined) updates.item = item;
            if (date !== undefined) updates.date = date;
            if (creado_en !== undefined || createdAt !== undefined) updates.creado_en = creado_en || createdAt;

            // Resolve id_habitaciones
            if (id_habitaciones !== undefined || roomId !== undefined) {
                const searchRoomId = roomId || id_habitaciones;
                if (typeof searchRoomId === 'string' && searchRoomId.startsWith('hab')) {
                    const cleanId = parseInt(searchRoomId.replace(/[^\d]/g, ''), 10);
                    updates.id_habitaciones = isNaN(cleanId) ? 1 : cleanId;
                } else {
                    updates.id_habitaciones = parseInt(searchRoomId) || 1;
                }
            }

            // Resolve tiempo
            if (tiempo !== undefined || time !== undefined) {
                const timeStr = time || tiempo;
                const dateStr = updates.checkIn || reservacion.checkIn;
                try {
                    updates.tiempo = new Date(`${dateStr}T${timeStr.includes(':') ? timeStr : '12:00'}`);
                    if (isNaN(updates.tiempo.getTime())) delete updates.tiempo;
                } catch {
                    // Ignore invalid time update
                }
            }

            await reservacion.update(updates);

            // Update parent reservation's user or status if updated
            if (reservacion.Reservation) {
                const parentUpdates = {};
                if (userId !== undefined) {
                    const parsedUserId = parseInt(userId, 10);
                    if (!isNaN(parsedUserId)) {
                        parentUpdates.id_usuarios = parsedUserId;
                    }
                }
                if (status !== undefined) parentUpdates.estado = status;
                if (Object.keys(parentUpdates).length > 0) {
                    await reservacion.Reservation.update(parentUpdates);
                }
            }

            const updatedReloaded = await ReservacionHabitaciones.findByPk(id, {
                include: [{ model: Reservacion }]
            });

            res.json(formatRoomReservation(updatedReloaded));

        } catch (error) {
            res.status(500).json({
                message: "Error al actualizar reservación",
                error: error.message
            });
        }
    },

    delete: async (req, res) => {
        try {
            const { id } = req.params;
            const reservacion = await ReservacionHabitaciones.findByPk(id);
            if (!reservacion) {
                return res.status(404).json({
                    message: "Reservación no encontrada"
                });
            }
            await reservacion.destroy();
            res.json({
                message: "Reservación eliminada correctamente"
            });
        } catch (error) {
            res.status(500).json({
                message: "Error al eliminar reservación",
                error: error.message
            });
        }
    }

};

module.exports = ReservacionHabitacionesController;