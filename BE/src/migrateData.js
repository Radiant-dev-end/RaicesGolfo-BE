const fs = require('fs');
const path = require('path');
const { sequelize, Habitacion, Tour, Opinion, Caracteristica } = require('./models/index.js');

async function migrate() {
    try {
        await sequelize.authenticate();
        console.log('Database connected.');

        // Read db.json
        const dataPath = path.join(__dirname, '../../FE/db.json');
        if (!fs.existsSync(dataPath)) {
            console.log('db.json not found!');
            return;
        }
        
        const rawData = fs.readFileSync(dataPath, 'utf8');
        const dbJson = JSON.parse(rawData);

        // Ensure at least one Caracteristica exists for Habitaciones
        let caracteristica = await Caracteristica.findOne();
        if (!caracteristica) {
            caracteristica = await Caracteristica.create({
                nombre: 'General',
                icono: 'fas fa-star'
            });
            console.log('Created default Caracteristica');
        }

        // Migrate Habitaciones
        if (dbJson.habitaciones && dbJson.habitaciones.length > 0) {
            console.log(`Migrating ${dbJson.habitaciones.length} habitaciones...`);
            for (const hab of dbJson.habitaciones) {
                // Check if it already exists
                const existing = await Habitacion.findOne({ where: { nombre: hab.nombre } });
                if (!existing) {
                    await Habitacion.create({
                        id_caracteristicas: caracteristica.id_caracteristicas,
                        numero: hab.id.substring(0, 10),
                        nombre: hab.nombre,
                        descripcion: hab.descripcion,
                        precio_noche: hab.precio,
                        capacidad: hab.capacidad,
                        tipo: hab.tipo,
                        disponible: hab.disponible,
                        imagen: hab.imagen || '',
                        estado: hab.status || 'disponible',
                        features: hab.features || []
                    });
                }
            }
            console.log('Habitaciones migrated.');
        }

        // Migrate Tours
        if (dbJson.tours && dbJson.tours.length > 0) {
            console.log(`Migrating ${dbJson.tours.length} tours...`);
            for (const tour of dbJson.tours) {
                const existing = await Tour.findOne({ where: { nombre: tour.nombre } });
                if (!existing) {
                    await Tour.create({
                        nombre: tour.nombre,
                        descripcion: tour.descripcion,
                        precio: tour.precio,
                        duracion: tour.duracion,
                        tipo: tour.tipo,
                        estado: tour.disponible
                    });
                }
            }
            console.log('Tours migrated.');
        }

        // Migrate Opiniones
        if (dbJson.opiniones && dbJson.opiniones.length > 0) {
            console.log(`Migrating ${dbJson.opiniones.length} opiniones...`);
            for (const op of dbJson.opiniones) {
                const existing = await Opinion.findOne({ where: { nombre: op.nombre, comentario: op.comentario } });
                if (!existing) {
                    await Opinion.create({
                        nombre: op.nombre || 'Anónimo',
                        imagen: op.imagen || 'https://via.placeholder.com/150',
                        calificacion: op.calificacion || 5,
                        comentario: op.comentario || '',
                        experiencia: op.experiencia || 'General'
                    });
                }
            }
            console.log('Opiniones migrated.');
        }

        console.log('Migration completed successfully.');
        process.exit(0);

    } catch (error) {
        console.error('Migration failed:', error);
        process.exit(1);
    }
}

migrate();
