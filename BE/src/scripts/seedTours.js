// seedTours.js
// Script to seed the 'tours' table with initial data.
// Run with: node src/scripts/seedTours.js (from the BE project root)

const sequelize = require('../config/db'); // Sequelize instance
const Tour = require('../models/Tours'); // Tour model

// Define the seed data (adapted from user JSON)
const toursData = [
  {
    nombre: "Tour de pesca artesanal",
    descripcion: "Experiencia con pescadores locales donde se aprenden técnicas tradicionales y se participa en la pesca.",
    precio: 15,
    duracion: "4 horas",
    tipo: "Posada",
    estado: true
  },
  {
    nombre: "Taller de artesanías",
    descripcion: "Taller para crear artesanías locales con materiales de la zona.",
    precio: 10,
    duracion: "3 horas",
    tipo: "Posada",
    estado: true
  },
  {
    nombre: "Avistamiento de aves marinas",
    descripcion: "Tour guiado para observar aves en la isla y alrededores.",
    precio: 12,
    duracion: "1 hora",
    tipo: "Posada",
    estado: true
  },
  {
    nombre: "Recorrido por los manglares",
    descripcion: "Paseo en bote por manglares con guía local, observando fauna y ecosistemas.",
    precio: 14,
    duracion: "2 horas",
    tipo: "Posada",
    estado: true
  },
  {
    nombre: "Tour en bote por el Golfo",
    descripcion: "Paseos en lancha visitando otras islas cercanas del Golfo de Nicoya.",
    precio: 30,
    duracion: "3 horas",
    tipo: "Isla",
    estado: true
  },
  {
    nombre: "Kayak y actividades acuáticas",
    descripcion: "Recorridos en kayak y exploración del mar a tu propio ritmo.",
    precio: 20,
    duracion: "2 horas",
    tipo: "Isla",
    estado: true
  },
  {
    nombre: "Senderismo y tours ecológicos",
    descripcion: "Caminatas guiadas por la isla disfrutando de la naturaleza local.",
    precio: 15,
    duracion: "2 horas",
    tipo: "Isla",
    estado: true
  },
  {
    nombre: "Experiencias de bienestar",
    descripcion: "Actividades como yoga, meditación y relajación frente al mar.",
    precio: 18,
    duracion: "1.5 horas",
    tipo: "Isla",
    estado: true
  }
];

async function seed() {
  try {
    await sequelize.authenticate();
    console.log('Database connection established.');

    // Ensure the table exists (sync without forcing data loss)
    await Tour.sync();

    // Bulk insert the data, ignoring duplicates based on primary key
    await Tour.bulkCreate(toursData, { ignoreDuplicates: true });
    console.log('Tour seed data inserted successfully.');
  } catch (error) {
    console.error('Error seeding tours:', error);
  } finally {
    await sequelize.close();
  }
}

seed();
