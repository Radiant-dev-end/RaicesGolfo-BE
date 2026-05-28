// seedHabitaciones.js
// Script to seed the 'habitaciones' table with initial data.
// Run with: node src/scripts/seedHabitaciones.js (from the BE project root)

const sequelize = require('../config/db'); // Sequelize instance
const Habitacion = require('../models/Habitaciones'); // Model definition

// Define the seed data (adapted from user JSON)
const habitacionesData = [
  {
    nombre: "Glamping Ecológico Isla de Chira",
    descripcion: "Vive la experiencia de acampar con lujo en el corazón de Isla de Chira. Estructuras elevadas con vistas inigualables al Golfo de Nicoya.",
    precio_noche: 85,
    capacidad: 2,
    tipo: "Glamping",
    disponible: true,
    imagen: "/src/components/HOSPEDAJE/IMGEN/Habi.1.webp",
    estado: "disponible",
    features: ["WiFi", "Vista al Mar", "Aire Acondicionado"]
  },
  {
    nombre: "Habitación Brisa del Golfo",
    descripcion: "Habitación amplia con ventanales grandes para disfrutar de la brisa marina. Ubicada a pocos pasos de la costa.",
    precio_noche: 110,
    capacidad: 4,
    tipo: "Habitación",
    disponible: true,
    imagen: "/src/CHIRA/IMG_1019 (2).JPG",
    estado: "disponible",
    features: ["WiFi", "Vista al Mar", "Aire Acondicionado"]
  },
  {
    nombre: "Eco-Refugio del Pescador",
    descripcion: "Sumérgete en la cultura local en este refugio construido con maderas locales y técnicas tradicionales de la isla.",
    precio_noche: 70,
    capacidad: 2,
    tipo: "Refugio",
    disponible: true,
    imagen: "/src/CHIRA/IMG_0984 (2).JPG",
    estado: "disponible",
    features: ["WiFi", "Vista al Mar", "Aire Acondicionado"]
  },
  {
    nombre: "Habitación Vista al Mar",
    descripcion: "Disfruta de una vista espectacular al mar desde tu ventana. Habitación equipada con todo lo necesario para tu comodidad.",
    precio_noche: 95,
    capacidad: 3,
    tipo: "Habitación",
    disponible: true,
    imagen: "https://islavenado-cr.com/wp-content/uploads/2024/05/Cabinas-Atardecer-5.jpg",
    estado: "disponible",
    features: ["WiFi", "Vista al Mar", "Aire Acondicionado"]
  },
  {
    nombre: "Suite Familiar Raíces",
    descripcion: "Espacio ideal para familias que buscan comodidad y cercanía a la naturaleza. Cuenta con múltiples ambientes y servicios.",
    precio_noche: 150,
    capacidad: 5,
    tipo: "Suite",
    disponible: true,
    imagen: "/src/components/HOSPEDAJE/IMGEN/Habi.2.avif",
    estado: "disponible",
    features: ["WiFi", "Vista al Mar", "Aire Acondicionado"]
  },
  {
    nombre: "Refugio Histórico San Lucas",
    descripcion: "Ideal para quienes buscan descanso, aventura y un toque de historia en la antigua isla prisión, hoy santuario de vida silvestre.",
    precio_noche: 120,
    capacidad: 4,
    tipo: "Suite",
    disponible: true,
    imagen: "https://a0.muscache.com/im/pictures/miso/Hosting-963071887857759256/original/ea191874-8dbd-461b-a48e-5c8901893413.jpeg",
    estado: "disponible",
    features: ["WiFi", "Vista al Mar", "Aire Acondicionado"]
  },
  {
    nombre: "Cabaña Serena Isla Caballo",
    descripcion: "Rodeada de aguas cálidas y paisajes naturales, ofrece playas serenas y la oportunidad de desconectarse del ritmo acelerado.",
    precio_noche: 110,
    capacidad: 4,
    tipo: "Cabaña",
    disponible: true,
    imagen: "https://a0.muscache.com/im/pictures/4ac2fa8a-7fe5-47e5-beb3-3df2823f2734.jpg",
    estado: "disponible",
    features: ["WiFi", "Vista al Mar", "Aire Acondicionado"]
  }
];

async function seed() {
  try {
    await sequelize.authenticate();
    console.log('Database connection established.');

    // Ensure the table exists (sync without forcing data loss)
    await Habitacion.sync();

    // Bulk insert the data
    await Habitacion.bulkCreate(habitacionesData, { ignoreDuplicates: true });
    console.log('Seed data inserted successfully.');
  } catch (error) {
    console.error('Error seeding data:', error);
  } finally {
    await sequelize.close();
  }
}

seed();
