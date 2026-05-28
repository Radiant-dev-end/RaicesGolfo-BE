const request = require("supertest");
const app = require("../app");
const { Tour } = require("../models");

describe("Tests de Tour", () => {

    // Test 1 - Obtener todos los tours
    test("GET /api/tours/obtener - debería obtener todos los tour", async () => {

        const response = await request(app)
            .get("/api/tours/obtener");

        expect(response.statusCode).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);

    });

    // Test 2 - Crear un tour correctamente
    test("POST /api/tours/crear - debería crear un tour", async () => {

        const nuevoTour = {
            nombre: "Tour Volcán " + Date.now(),
            descripcion: "Recorrido por el volcán activo con guía certificado",
            precio: 50,
            duracion: "3 horas",
            tipo: "Aventura",
            disponible: true
        };

        const response = await request(app)
            .post("/api/tours/crear")
            .send(nuevoTour);

        expect(response.statusCode).toBe(201);
        expect(response.body.message).toBe("Tour creado correctamente");
        expect(response.body.tour.nombre).toContain("Tour Volcán");

    });

    // Test 3 - No permitir precio inválido
    test("POST /api/tours/crear - no debería permitir precio inválido", async () => {

        const tourInvalido = {
            nombre: "Tour Playa",
            descripcion: "Tour de playa con almuerzo incluido",
            precio: 0,
            duracion: "2 horas",
            tipo: "Relajación",
            disponible: true
        };

        const response = await request(app)
            .post("/api/tours/crear")
            .send(tourInvalido);

        expect(response.statusCode).toBe(400);
        expect(response.body.message).toBe("El precio debe ser mayor a 0");

    });

    // Test 4 - Obtener tour por ID
    test("GET /api/tours/obtener/:id - debería obtener un tour por ID", async () => {

        const resCreate = await request(app)
            .post("/api/tours/crear")
            .send({
                nombre: "Tour ID Test " + Date.now(),
                descripcion: "Descripción para test de ID",
                precio: 10,
                duracion: "1h",
                tipo: "Test"
            });
        
        const id = resCreate.body.tour.id_tours || resCreate.body.tour.id;

        const response = await request(app)
            .get(`/api/tours/obtener/${id}`);

        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty("nombre");

    });

    // Test 5 - Eliminar un tour
    test("DELETE /api/tours/eliminar/:id - debería eliminar un tour", async () => {

        const resCreate = await request(app)
            .post("/api/tours/crear")
            .send({
                nombre: "Tour Delete Test " + Date.now(),
                descripcion: "Descripción para test de delete",
                precio: 20,
                duracion: "2h",
                tipo: "Test"
            });
        
        const id = resCreate.body.tour.id_tours || resCreate.body.tour.id;

        const response = await request(app)
            .delete(`/api/tours/eliminar/${id}`);

        expect(response.statusCode).toBe(200);
        expect(response.body.message).toBe("Tour eliminado correctamente");

    });

});