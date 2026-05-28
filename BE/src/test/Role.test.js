const request = require("supertest");
const app = require("../app");
const { Role } = require("../models");

describe("Tests de Role", () => {

    // Test 1 - Obtener todos los roles
    test("GET /api/roles/obtener - debería obtener todos los roles", async () => {

        const response = await request(app)
            .get("/api/roles/obtener");

        expect(response.statusCode).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);

    });

    // Test 2 - Crear un rol correctamente
    test("POST /api/roles/crear - debería crear un role", async () => {

        const nuevoRol = {
            nombre: "Admin_" + Date.now(),
            fecha: new Date()
        };

        const response = await request(app)
            .post("/api/roles/crear")
            .send(nuevoRol);

        expect(response.statusCode).toBe(201);
        expect(response.body.message).toBe("Rol creado correctamente");
        expect(response.body.rol.nombre).toContain("Admin_");

    });

    // Test 3 - No permitir nombre corto
    test("POST /api/roles/crear - no debería permitir nombres menores a 3 caracteres", async () => {

        const rolInvalido = {
            nombre: "Ad",
            fecha: new Date()
        };

        const response = await request(app)
            .post("/api/roles/crear")
            .send(rolInvalido);

        expect(response.statusCode).toBe(400);
        expect(response.body.message).toBe("El nombre debe tener mínimo 3 caracteres");

    });

    // Test 4 - Obtener role por ID
    test("GET /api/roles/obtener/:id - debería obtener un role por ID", async () => {

        const resCreate = await request(app)
            .post("/api/roles/crear")
            .send({ nombre: "ID_Test_" + Date.now(), fecha: new Date() });
        
        const id = resCreate.body.rol.id_roles || resCreate.body.rol.id;

        const response = await request(app)
            .get(`/api/roles/obtener/${id}`);

        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty("nombre");

    });

    // Test 5 - Eliminar role
    test("DELETE /api/roles/eliminar/:id - debería eliminar un role", async () => {

        const resCreate = await request(app)
            .post("/api/roles/crear")
            .send({ nombre: "Del_Test_" + Date.now(), fecha: new Date() });
        
        const id = resCreate.body.rol.id_roles || resCreate.body.rol.id;

        const response = await request(app)
            .delete(`/api/roles/eliminar/${id}`);

        expect(response.statusCode).toBe(200);
        expect(response.body.message).toBe("Rol eliminado correctamente");

    });

});