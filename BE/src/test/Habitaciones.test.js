const request = require("supertest");
const app = require("../app");
const { Habitacion } = require("../models");

describe("Tests de Habitaciones", () => {

    const getShortNum = () => "R" + Math.floor(Math.random() * 1000000);

    // Test 1 - Obtener todas las habitaciones
    test("GET /api/habitaciones/obtener - debería obtener todas las habitaciones", async () => {

        const response = await request(app)
            .get("/api/habitaciones/obtener");

        expect(response.statusCode).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);

    });

    // Test 2 - Crear una habitación correctamente
    test("POST /api/habitaciones/crear - debería crear una habitación", async () => {

        const num = getShortNum();
        const nuevaHabitacion = {
            id_caracteristicas: 1,
            numero: num,
            nombre: "Suite Deluxe",
            descripcion: "Habitación amplia con vista al mar y balcón privado",
            precio: 250,
            capacidad: 4,
            tipo: "Suite",
            disponible: true,
            imagen: "suite.jpg",
            status: "Disponible",
            features: ["WiFi", "TV"]
        };

        const response = await request(app)
            .post("/api/habitaciones/crear")
            .send(nuevaHabitacion);

        if (response.statusCode !== 201) console.error("Error creating room:", response.body);
        expect(response.statusCode).toBe(201);
        expect(response.body.message).toBe("Habitación creada correctamente");
        expect(response.body.habitacion.numero).toBe(num);

    });

    // Test 3 - No permitir precio inválido
    test("POST /api/habitaciones/crear - no debería permitir precio menor o igual a 0", async () => {

        const habitacionInvalida = {
            id_caracteristicas: 1,
            numero: getShortNum(),
            nombre: "Suite",
            descripcion: "Habitación con balcón y jacuzzi privado",
            precio: 0,
            capacidad: 2,
            tipo: "Premium"
        };

        const response = await request(app)
            .post("/api/habitaciones/crear")
            .send(habitacionInvalida);

        expect(response.statusCode).toBe(400);
        expect(response.body.message).toBe("El precio debe ser mayor a 0");

    });

    // Test 4 - Obtener habitación por ID
    test("GET /api/habitaciones/obtener/:id - debería obtener una habitación por ID", async () => {

        const resCreate = await request(app)
            .post("/api/habitaciones/crear")
            .send({
                id_caracteristicas: 1,
                numero: getShortNum(),
                nombre: "Test Room",
                descripcion: "Description for ID test room long enough",
                precio: 100,
                capacidad: 2,
                tipo: "Standard",
                imagen: "img.jpg",
                features: []
            });
        
        if (resCreate.statusCode !== 201) console.error("Error creating room for ID test:", resCreate.body);
        const id = resCreate.body.habitacion.id_habitaciones || resCreate.body.habitacion.id;

        const response = await request(app)
            .get(`/api/habitaciones/obtener/${id}`);

        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty("nombre");

    });

    // Test 5 - Eliminar habitación
    test("DELETE /api/habitaciones/eliminar/:id - debería eliminar una habitación", async () => {

        const resCreate = await request(app)
            .post("/api/habitaciones/crear")
            .send({
                id_caracteristicas: 1,
                numero: getShortNum(),
                nombre: "Delete Room",
                descripcion: "Description for delete test room long enough",
                precio: 100,
                capacidad: 2,
                tipo: "Standard",
                imagen: "img.jpg",
                features: []
            });
        
        const id = resCreate.body.habitacion.id_habitaciones || resCreate.body.habitacion.id;

        const response = await request(app)
            .delete(`/api/habitaciones/eliminar/${id}`);

        expect(response.statusCode).toBe(200);
        expect(response.body.message).toBe("Habitación eliminada correctamente");

    });

});