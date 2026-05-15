const request = require("supertest");
const app = require("../app");
const { Opinion } = require("../models");

describe("Tests de Opiniones", () => {

    const uniqueName = "Stacy_" + Date.now();

    // Test 1 - Obtener todas las opiniones
    test("GET /api/opiniones/obtener - debería obtener todas las opiniones", async () => {

        const response = await request(app)
            .get("/api/opiniones/obtener");

        expect(response.statusCode).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);

    });

    // Test 2 - Crear una opinión correctamente
    test("POST /api/opiniones/crear - debería crear una opinión", async () => {

        const nuevaOpinion = {
            nombre: uniqueName,
            imagen: "foto.jpg",
            calificacion: 5,
            comentario: "La experiencia fue increíble y muy divertida hoy",
            experiencia: "Excelente"
        };

        const response = await request(app)
            .post("/api/opiniones/crear")
            .send(nuevaOpinion);

        expect(response.statusCode).toBe(201);
        expect(response.body.message).toBe("Opinión creada correctamente");
        expect(response.body.opinion.nombre).toBe(uniqueName);

    });

    // Test 3 - No permitir calificación inválida
    test("POST /api/opiniones/crear - no debería permitir calificación mayor a 5", async () => {

        const opinionInvalida = {
            nombre: "Maria",
            imagen: "foto.jpg",
            calificacion: 6,
            comentario: "Muy buena experiencia en el hotel",
            experiencia: "Excelente"
        };

        const response = await request(app)
            .post("/api/opiniones/crear")
            .send(opinionInvalida);

        expect(response.statusCode).toBe(400);
        expect(response.body.message).toBe("La calificación debe estar entre 1 y 5");

    });

    // Test 4 - Obtener opinión por ID
    test("GET /api/opiniones/obtener/:id - debería obtener una opinión por ID", async () => {

        const resCreate = await request(app)
            .post("/api/opiniones/crear")
            .send({
                nombre: "TestID_" + Date.now(),
                imagen: "img.jpg",
                calificacion: 4,
                comentario: "Comentario para test de ID",
                experiencia: "Buena"
            });
        
        const id = resCreate.body.opinion.id_opiniones || resCreate.body.opinion.id;

        const response = await request(app)
            .get(`/api/opiniones/obtener/${id}`);

        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty("nombre");

    });

    // Test 5 - Eliminar opinión
    test("DELETE /api/opiniones/eliminar/:id - debería eliminar una opinión", async () => {

        const resCreate = await request(app)
            .post("/api/opiniones/crear")
            .send({
                nombre: "Delete_" + Date.now(),
                imagen: "img.jpg",
                calificacion: 3,
                comentario: "Comentario para test de delete",
                experiencia: "Neutral"
            });
        
        const id = resCreate.body.opinion.id_opiniones || resCreate.body.opinion.id;

        const response = await request(app)
            .delete(`/api/opiniones/eliminar/${id}`);

        expect(response.statusCode).toBe(200);
        expect(response.body.message).toBe("Opinión eliminada correctamente");

    });

});