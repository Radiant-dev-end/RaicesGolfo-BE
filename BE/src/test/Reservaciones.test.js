const request = require("supertest");
const app = require("../app");
const { Reservacion } = require("../models");

describe("Tests de Reservaciones", () => {

    const uniqueUser = () => "S_" + Math.floor(Math.random() * 1000000);

    // Test 1 - Obtener todas las reservaciones
    test("GET /api/reservaciones/obtener - debería obtener todas las reservaciones", async () => {

        const response = await request(app)
            .get("/api/reservaciones/obtener");

        expect(response.statusCode).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);

    });

    // Test 2 - Crear una reservación correctamente
    test("POST /api/reservaciones/crear - debería crear una reservación", async () => {

        const name = uniqueUser();
        const nuevaReservacion = {
            userId: 1,
            userName: name,
            habName: "Suite Deluxe",
            precio: 300,
            fecha: "2026-05-20",
            status: "Activa",
            createdAt: new Date().toISOString()
        };

        const response = await request(app)
            .post("/api/reservaciones/crear")
            .send(nuevaReservacion);

        if (response.statusCode !== 201) console.error("Error creating reservation:", response.body);
        expect(response.statusCode).toBe(201);
        expect(response.body.message).toBe("Reservación creada correctamente");
        expect(response.body.reservacion.nombre_usuario).toBe(name);

    });

    // Test 3 - No permitir precio inválido
    test("POST /api/reservaciones/crear - no debería permitir precio menor o igual a 0", async () => {

        const reservacionInvalida = {
            userId: 1,
            userName: uniqueUser(),
            habName: "Test",
            fecha: "2026-01-01",
            createdAt: new Date().toISOString(),
            precio: 0
        };

        const response = await request(app)
            .post("/api/reservaciones/crear")
            .send(reservacionInvalida);

        expect(response.statusCode).toBe(400);
        // Controller might return "Todos los campos..." if something else missing, but here precio is defined as 0
        expect(response.body.message).toMatch(/precio|campos/);

    });

    // Test 4 - Obtener reservación por ID
    test("GET /api/reservaciones/obtener/:id - debería obtener una reservación por ID", async () => {

        const name = uniqueUser();
        const resCreate = await request(app)
            .post("/api/reservaciones/crear")
            .send({
                userId: 1,
                userName: name,
                habName: "Test",
                precio: 100,
                fecha: "2026-06-01",
                status: "Activa",
                createdAt: new Date().toISOString()
            });
        
        if (resCreate.statusCode !== 201) console.error("Error creating for search test:", resCreate.body);
        const id = resCreate.body.reservacion.id_reservaciones || resCreate.body.reservacion.id;

        const response = await request(app)
            .get(`/api/reservaciones/obtener/${id}`);

        expect(response.statusCode).toBe(200);
        expect(response.body.nombre_usuario).toBe(name);

    });

    // Test 5 - Eliminar reservación
    test("DELETE /api/reservaciones/eliminar/:id - debería eliminar una reservación", async () => {

        const resCreate = await request(app)
            .post("/api/reservaciones/crear")
            .send({
                userId: 1,
                userName: uniqueUser(),
                habName: "Test",
                precio: 100,
                fecha: "2026-01-01",
                createdAt: new Date().toISOString()
            });
        
        if (resCreate.statusCode !== 201) console.error("Error creating for delete test:", resCreate.body);
        const id = resCreate.body.reservacion.id_reservaciones || resCreate.body.reservacion.id;

        const response = await request(app)
            .delete(`/api/reservaciones/eliminar/${id}`);

        expect(response.statusCode).toBe(200);
        expect(response.body.message).toBe("Reservación eliminada correctamente");

    });

});