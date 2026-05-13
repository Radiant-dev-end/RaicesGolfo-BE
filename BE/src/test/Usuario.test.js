const request = require("supertest");
const app = require("../app");

describe("Tests de Usuario", () => {

    // 1. Obtener usuarios
    test("GET /usuarios/obtener -> debe retornar lista de usuarios", async () => {

        const res = await request(app)
            .get("/usuarios/obtener");

        expect(res.statusCode).toBe(200);

    });

    // 2. Crear usuario correctamente
    test("POST /usuarios/crear -> debe crear un usuario", async () => {

        const res = await request(app)
            .post("/usuarios/crear")
            .send({
                id: 1,
                email: "stacy@test.com",
                password: "123456",
                role: "admin",
                name: "Stacy",
                photo: "foto.jpg"
            });

        expect(res.statusCode).toBe(201);

        expect(res.body.message)
            .toBe("Usuario creado correctamente");

    });

    // 3. Validar email incorrecto
    test("POST /usuarios/crear -> debe validar email inválido", async () => {

        const res = await request(app)
            .post("/usuarios/crear")
            .send({
                id: 2,
                email: "correo_malo",
                password: "123456",
                role: "admin",
                name: "Usuario Test"
            });

        expect(res.statusCode).toBe(400);

        expect(res.body.message)
            .toBe("Correo electrónico inválido");

    });

    // 4. Validar contraseña corta
    test("POST /usuarios/crear -> debe validar contraseña corta", async () => {

        const res = await request(app)
            .post("/usuarios/crear")
            .send({
                id: 3,
                email: "password@test.com",
                password: "123",
                role: "admin",
                name: "Password Test"
            });

        expect(res.statusCode).toBe(400);

        expect(res.body.message)
            .toBe("La contraseña debe tener mínimo 6 caracteres");

    });

    // 5. Obtener usuario por ID
    test("GET /usuarios/obtener/:id -> debe obtener un usuario", async () => {

        // Crear usuario primero
        await request(app)
            .post("/usuarios/crear")
            .send({
                id: 10,
                email: "usuarioid@test.com",
                password: "123456",
                role: "cliente",
                name: "Usuario ID"
            });

        const res = await request(app)
            .get("/usuarios/obtener/10");

        expect(res.statusCode).toBe(200);

        expect(res.body.email)
            .toBe("usuarioid@test.com");

    });

});