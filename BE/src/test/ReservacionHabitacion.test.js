const request = require("supertest");
const app = require("../app");
const { ReservacionHabitaciones } = require("../models");

describe("Tests de ReservacionHabitacion", () => {

    const uniqueUser = () => "U_" + Math.floor(Math.random() * 1000000);
    const getShortNum = () => "R" + Math.floor(Math.random() * 1000000);

    let habitacionId;
    let reservacionId;

    beforeAll(async () => {
        // Create a parent room
        const resRoom = await request(app)
            .post("/api/habitaciones/crear")
            .send({
                id_caracteristicas: 1,
                numero: getShortNum(),
                nombre: "Suite Parent",
                descripcion: "Description for parent room long enough",
                precio: 100,
                capacidad: 2,
                tipo: "Standard",
                imagen: "img.jpg",
                features: []
            });
        habitacionId = resRoom.body.habitacion.id_habitaciones || resRoom.body.habitacion.id;

        // Create a parent reservation
        const resRes = await request(app)
            .post("/api/reservaciones/crear")
            .send({
                userId: 1,
                userName: "Parent User",
                habName: "Suite",
                precio: 100,
                fecha: "2026-01-01",
                createdAt: new Date().toISOString()
            });
        reservacionId = resRes.body.reservacion.id_reservaciones || resRes.body.reservacion.id;
    });

    // Test 1 - Obtener todas las reservaciones
    test("GET /api/reservaciondehabitaciones/obtener - debería obtener todas las reservaciones", async () => {

        const response = await request(app)
            .get("/api/reservaciondehabitaciones/obtener");

        expect(response.statusCode).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);

    });

    // Test 2 - Crear una reservación correctamente
    test("POST /api/reservaciondehabitaciones/crear - debería crear una reservacion", async () => {

        const nuevaReservacion = {
            nombre_usuario: uniqueUser(),
            id_reservaciones: reservacionId,
            id_habitaciones: habitacionId,
            nombre_habitacion: "Suite Deluxe",
            fecha_checkin: "2026-05-20",
            fecha_checkout: "2026-05-25",
            total: 500,
            status: "Activa",
            tipo: "Habitación",
            item: "Suite",
            date: "May 2026",
            tiempo: new Date(),
            creado_en: new Date()
        };

        const response = await request(app)
            .post("/api/reservaciondehabitaciones/crear")
            .send(nuevaReservacion);

        if (response.statusCode !== 201) console.error("Error creating room reservation:", response.body);
        expect(response.statusCode).toBe(201);

    });

    // Test 4 - Obtener reservación por ID
    test("GET /api/reservaciondehabitaciones/obtener/:id - debería obtener una reservacion por ID", async () => {

        const resCreate = await request(app)
            .post("/api/reservaciondehabitaciones/crear")
            .send({
                nombre_usuario: uniqueUser(),
                id_reservaciones: reservacionId,
                id_habitaciones: habitacionId,
                nombre_habitacion: "Test",
                fecha_checkin: "2026-06-01",
                fecha_checkout: "2026-06-05",
                total: 100,
                status: "Activa",
                tipo: "Habitación",
                item: "Standard",
                date: "June 2026",
                tiempo: new Date(),
                creado_en: new Date()
            });
        
        const id = resCreate.body.reservacion.id_reservacion_habitaciones || resCreate.body.reservacion.id_reservacioneshabitaciones || resCreate.body.reservacion.id;

        const response = await request(app)
            .get(`/api/reservaciondehabitaciones/obtener/${id}`);

        expect(response.statusCode).toBe(200);

    });

    // Test 5 - Eliminar reservación
    test("DELETE /api/reservaciondehabitaciones/eliminar/:id - debería eliminar una reservacion", async () => {

        const resCreate = await request(app)
            .post("/api/reservaciondehabitaciones/crear")
            .send({
                nombre_usuario: uniqueUser(),
                id_reservaciones: reservacionId,
                id_habitaciones: habitacionId,
                nombre_habitacion: "Del",
                fecha_checkin: "2026-07-01",
                fecha_checkout: "2026-07-05",
                tipo: "T", item: "I", date: "D", tiempo: new Date(), creado_en: new Date(),
                total: 100,
                status: "Activa"
            });
        
        const id = resCreate.body.reservacion.id_reservacion_habitaciones || resCreate.body.reservacion.id_reservacioneshabitaciones || resCreate.body.reservacion.id;

        const response = await request(app)
            .delete(`/api/reservaciondehabitaciones/eliminar/${id}`);

        expect(response.statusCode).toBe(200);

    });

});