const request = require("supertest");
const app = require("../app");
const { Usuario } = require("../models");

describe("Tests de Usuario", () => {

    const uniqueEmail1 = `stacy_${Date.now()}@test.com`;
    const uniqueEmail2 = `usuarioid_${Date.now()}@test.com`;

    // 1. Obtener usuarios
    test("GET /api/usuarios/obtener -> debe retornar lista de usuarios", async () => {

        const res = await request(app)
            .get("/api/usuarios/obtener");

        expect(res.statusCode).toBe(200);

    });

    // 2. Crear usuario correctamente
    test("POST /api/usuarios/crear -> debe crear un usuario", async () => {

        const res = await request(app)
            .post("/api/usuarios/crear")
            .send({
                email: uniqueEmail1,
                password: "123456",
                role: 1,
                name: "Stacy",
                photo: "foto.jpg"
            });

        if (res.statusCode !== 201) console.error("Error creating user:", res.body);
        expect(res.statusCode).toBe(201);

        expect(res.body.message)
            .toBe("Usuario creado correctamente");

    });

    // 3. Validar email incorrecto
    test("POST /api/usuarios/crear -> debe validar email inválido", async () => {

        const res = await request(app)
            .post("/api/usuarios/crear")
            .send({
                email: "correo_malo",
                password: "123456",
                role: 1,
                name: "Usuario Test"
            });

        expect(res.statusCode).toBe(400);

        expect(res.body.message)
            .toBe("Correo electrónico inválido");

    });

    // 4. Validar contraseña corta
    test("POST /api/usuarios/crear -> debe validar contraseña corta", async () => {

        const res = await request(app)
            .post("/api/usuarios/crear")
            .send({
                email: "password@test.com",
                password: "123",
                role: 1,
                name: "Password Test"
            });

        expect(res.statusCode).toBe(400);

        expect(res.body.message)
            .toBe("La contraseña debe tener mínimo 6 caracteres");

    });

    // 5. Obtener usuario por ID
    test("GET /api/usuarios/obtener/:id -> debe obtener un usuario", async () => {

        const resCreate = await request(app)
            .post("/api/usuarios/crear")
            .send({
                email: uniqueEmail2,
                password: "123456",
                role: 1,
                name: "Usuario ID"
            });
        
        if (resCreate.statusCode !== 201) {
             console.error("Error creating user for search:", resCreate.body);
        }
        
        const id = resCreate.body.usuario.id_usuarios || resCreate.body.usuario.id;

        const res = await request(app)
            .get(`/api/usuarios/obtener/${id}`);

        expect(res.statusCode).toBe(200);

        expect(res.body.email)
            .toBe(uniqueEmail2);

    });

});