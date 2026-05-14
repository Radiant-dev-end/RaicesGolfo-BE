const request = require("supertest");
const app = require("../app");
const { Caracteristica } = require("../models");

describe("Tests de Características", () => {

    const uniqueName1 = "Wifi_" + Date.now();
    const uniqueName2 = "Pool_" + Date.now();

    // Test 1 - Obtener todas las características
    test("GET /api/caracteristicas/obtener - debería obtener todas las características", async () => {

        const response = await request(app)
            .get("/api/caracteristicas/obtener");

        expect(response.statusCode).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);

    });

    // Test 2 - Crear una característica correctamente
    test("POST /api/caracteristicas/crear - debería crear una característica", async () => {

        const nuevaCaracteristica = {
            nombre: uniqueName1,
            icono: "wifi.png"
        };

        const response = await request(app)
            .post("/api/caracteristicas/crear")
            .send(nuevaCaracteristica);

        expect(response.statusCode).toBe(201);
        expect(response.body.message).toBe("Característica creada correctamente");
        expect(response.body.caracteristica.nombre).toBe(uniqueName1);

    });

    // Test 3 - No permitir nombre muy corto
    test("POST /api/caracteristicas/crear - no debería permitir nombre menor a 3 caracteres", async () => {

        const caracteristicaInvalida = {
            nombre: "Wi",
            icono: "wifi.png"
        };

        const response = await request(app)
            .post("/api/caracteristicas/crear")
            .send(caracteristicaInvalida);

        expect(response.statusCode).toBe(400);
        expect(response.body.message).toBe("El nombre debe tener mínimo 3 caracteres");

    });

    // Test 4 - Eliminar característica
    test("DELETE /api/caracteristicas/eliminar/:id - debería eliminar una característica", async () => {

        const resCreate = await request(app)
            .post("/api/caracteristicas/crear")
            .send({ nombre: uniqueName2, icono: "test.png" });
        
        const id = resCreate.body.caracteristica.id_caracteristicas || resCreate.body.caracteristica.id;

        const response = await request(app)
            .delete(`/api/caracteristicas/eliminar/${id}`);

        expect(response.statusCode).toBe(200);
        expect(response.body.message).toBe("Característica eliminada correctamente");

    });

});