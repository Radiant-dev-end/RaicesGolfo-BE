const express = require('express');
const router = express.Router();

// Mock/Static data for Transporte to populate the frontend beautifully
const transporteServicios = [
    {
        id_transporte: 1,
        categoria: "Ferry Público",
        ruta: "Puntarenas ➔ Isla Chira (Montero)",
        descripcion: "El ferry público es la opción tradicional y económica para viajar a la isla. Cuenta con capacidad para pasajeros y vehículos ligeros. Se recomienda llegar 30 minutos antes.",
        horarios: [
            {
                from: "Puntarenas",
                to: "Isla Chira (Montero)",
                times: ["12:30 PM"]
            },
            {
                from: "Isla Chira (Montero)",
                to: "Puntarenas",
                times: ["06:00 AM"]
            }
        ]
    },
    {
        id_transporte: 2,
        categoria: "Lancha Rápida",
        ruta: "Puntarenas ➔ Isla Chira (Muelle)",
        descripcion: "Servicio de lancha rápida de pasajeros. Es una opción ágil y directa. Ideal para quienes viajan sin vehículo.",
        horarios: [
            {
                from: "Puntarenas",
                to: "Isla Chira",
                times: ["09:00 AM", "03:00 PM"]
            },
            {
                from: "Isla Chira",
                to: "Puntarenas",
                times: ["07:00 AM", "01:00 PM"]
            }
        ]
    },
    {
        id_transporte: 3,
        categoria: "Taxi Acuático Privado",
        ruta: "Muelle de San Bernardo ➔ Isla Chira",
        descripcion: "Servicio privado exclusivo y bajo demanda. Ideal para grupos grandes o viajes fuera de los horarios regulares de lanchas públicas. Requiere reservación previa.",
        horarios: [
            {
                from: "Muelle San Bernardo",
                to: "Isla Chira (Cualquier muelle)",
                times: ["Bajo Demanda (Reserva previa 24/7)"]
            }
        ]
    }
];

router.get('/', (req, res) => {
    try {
        res.json(transporteServicios);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener servicios de transporte", error: error.message });
    }
});

router.post('/', (req, res) => {
    try {
        // Enviar respuesta exitosa simulando la creación
        const nuevoTransporte = {
            id_transporte: Date.now(),
            ...req.body
        };
        res.status(201).json({ message: "Servicio de transporte creado exitosamente (Simulado)", nuevoTransporte });
    } catch (error) {
        res.status(500).json({ message: "Error al crear servicio de transporte", error: error.message });
    }
});

module.exports = router;
