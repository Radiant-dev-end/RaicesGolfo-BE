const sequelize = require('./src/config/db');
const { Opinion } = require('./src/models');

async function test() {
  try {
    await sequelize.authenticate();
    console.log("Authenticated");
    
    const nuevaOpinion = await Opinion.create({
        nombre: "Test User",
        imagen: "https://example.com/img.jpg",
        calificacion: 5,
        comentario: "Este es un comentario de prueba con mas de 10 caracteres.",
        experiencia: "General"
    });
    console.log("Created successfully:", nuevaOpinion.toJSON());
  } catch (error) {
    console.error("Error creating opinion:", error);
  } finally {
    process.exit();
  }
}

test();
